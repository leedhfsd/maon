package com.easter.watch.presentation.view.intro

import StompWebSocketClient
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.os.VibrationEffect
import android.os.Vibrator
import android.text.InputFilter
import android.util.Log
import android.view.View
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.easter.watch.R
import com.easter.watch.databinding.ActivityAuthBinding
import com.easter.watch.presentation.service.ApiService
import com.easter.watch.presentation.dataModel.AuthInfo
import com.easter.watch.presentation.dataModel.Enum.Connect
import com.easter.watch.presentation.dataModel.MemberInfo
import com.easter.watch.presentation.db.MemberDatabase
import com.easter.watch.presentation.db.dao.MemberDao
import com.easter.watch.presentation.db.entity.Member
import com.easter.watch.presentation.view.notification.ConnectFailedActivity
import com.easter.watch.presentation.view.notification.ConnectSuccessActivity
import com.easter.watch.presentation.view.run.StartActivity
import com.google.firebase.messaging.FirebaseMessaging
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import com.google.gson.TypeAdapter
import com.google.gson.stream.JsonReader
import com.google.gson.stream.JsonWriter
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.time.LocalDateTime

class AuthActivity : AppCompatActivity() {

    private lateinit var binding: ActivityAuthBinding
    private lateinit var stompClient: StompWebSocketClient
    private lateinit var memberDao: MemberDao
    val TAG = "인증화면"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityAuthBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val authCode = binding.authCodeText
        authCode.filters = arrayOf(InputFilter.LengthFilter(6))

        // Database 초기화
        val db = MemberDatabase.getDatabase(this)
        memberDao = db.memberDao()

        // 모든 데이터 삭제
        CoroutineScope(Dispatchers.IO).launch {
            memberDao.deleteAll() // 테이블 초기화
            Log.d(TAG, "MemberDatabase 초기화 완료")
        }

        // WebSocket + STOMP 연결
        CoroutineScope(Dispatchers.IO).launch {
            stompClient = StompWebSocketClient("wss://k11c207.p.ssafy.io/maon/route/ws/location")
            stompClient.connect()
        }

        binding.connectBtn.setOnClickListener {
            val authCodeText = authCode.text.toString()
            subscribeToAuthTopic(authCodeText)
            // JSON 형식의 메시지 생성
            val messageMap = mapOf("timestamp" to LocalDateTime.now().toString())
            val messageJson = Gson().toJson(messageMap) // JSON 문자열로 변환
            stompClient.sendMessageJson("/pub/connection/watch/$authCodeText", messageJson)
        }
    }

    // STOMP 메시지에서 JSON 추출
    private fun extractJsonFromStompMessage(stompMessage: String): String {
        val parts = stompMessage.split("\n\n")
        val json = if (parts.size >= 2) {
            parts.last().trim()
        } else {
            stompMessage.trim()
        }

        // 한글(AC00-D7A3)을 제외한 모든 비ASCII 유니코드 문자 제거
        return json.replace(Regex("[^\\x20-\\x7E가-힣]"), "").trim()
    }

    // Auth 토픽 구독 함수
    fun subscribeToAuthTopic(authCode: String) {
        stompClient.subscribeToTopic("/sub/connection/$authCode","sub-auth") { payload ->
            try {
                // JSON 데이터를 AuthInfo 객체로 변환
                val jsonBody = extractJsonFromStompMessage(payload)
                Log.d(TAG, "추출된 JSON: $jsonBody")

                // Gson 설정
                val gson = GsonBuilder()
                    .setLenient()
                    .registerTypeAdapter(Connect::class.java, object : TypeAdapter<Connect>() {
                        override fun write(out: JsonWriter, value: Connect?) {
                            out.value(value?.name)
                        }

                        override fun read(`in`: JsonReader): Connect {
                            val connectionType = `in`.nextString()
                            return Connect.valueOf(connectionType)
                        }
                    })
                    .create()

                val authInfo = gson.fromJson(jsonBody, AuthInfo::class.java)
                Log.d(TAG, "변환된 AuthInfo: $authInfo")

                when (authInfo.type) {
                    Connect.CONNECTION_SUCCEED -> {
                        // memberId와 memberNickname이 null이 아닌 경우에만 처리
                        if (authInfo.memberId != null && authInfo.memberNickname != null) {
                            Log.d(TAG, "연결 성공: memberNickName = ${authInfo.memberNickname}")

                            CoroutineScope(Dispatchers.IO).launch {
                                memberDao.insertMember(Member(authInfo.memberId, authInfo.memberNickname))
                                Log.d(TAG, "멤버 저장 완료")
                            }

                            // 진동 알림
                            val vibrator = getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
                            if (vibrator.hasVibrator()) {
                                val vibrationEffect =
                                    VibrationEffect.createOneShot(500, VibrationEffect.DEFAULT_AMPLITUDE)
                                vibrator.vibrate(vibrationEffect)
                            }

                            // ConnectSuccessActivity로 이동
                            runOnUiThread {
                                val intent = Intent(this@AuthActivity, ConnectSuccessActivity::class.java).apply {
                                    putExtra("memberNickname", authInfo.memberNickname)
                                }
                                startActivity(intent)
                                finish()
                            }
                        }
                    }

                    Connect.CONNECTION_FAILED -> {
                        Log.d(TAG, "연결 실패")
                        runOnUiThread {
                            val intent = Intent(this@AuthActivity, ConnectFailedActivity::class.java)
                            startActivity(intent)
                        }
                    }
                }
                stompClient.disconnect()

            } catch (e: Exception) {
                Log.e(TAG, "JSON 파싱 에러: ${e.message}", e)
                runOnUiThread {
                    Toast.makeText(this@AuthActivity, "연결 처리 중 오류가 발생했습니다", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }
}