package com.easter.watch.presentation.view

import StompWebSocketClient
import android.os.Bundle
import android.util.Log
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.easter.watch.R
import com.easter.watch.presentation.dataModel.StartInfo
import com.easter.watch.presentation.db.MemberDatabase
import com.easter.watch.presentation.db.dao.MemberDao
import com.google.gson.Gson
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class TestActivity : AppCompatActivity() {

    private lateinit var stompClient: StompWebSocketClient
    private lateinit var memberDao: MemberDao

    val TAG =  "TEST"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_test)

        // Database 초기화
        val db = MemberDatabase.getDatabase(this)
        memberDao = db.memberDao()

        CoroutineScope(Dispatchers.Main).launch {
            val memberId = memberDao.getMemberId()
            stompClient = StompWebSocketClient("wss://k11c207.p.ssafy.io/maon/route/ws/location")

            stompClient.connect {
                Log.d(TAG, "STOMP 연결 후 구독 요청 실행")
                subscribeToMemberTopic(memberId) // 연결 후에 구독
            }
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

    fun subscribeToMemberTopic(memberId : String){
        stompClient.subscribeToTopic("/sub/start/$memberId","sub-test"){ payload ->
            try{
                // JSON 데이터를 AuthInfo 객체로 변환
                val jsonBody = extractJsonFromStompMessage(payload)
                Log.d(TAG, "추출된 JSON: $jsonBody")

                // Gson을 사용해 JSON을 StartInfo 객체로 변환
                val startInfo = Gson().fromJson(jsonBody, StartInfo::class.java)
                Log.d(TAG, "변환된 StartInfo 객체: $startInfo")

            }catch (e : Exception){
                Log.d(TAG, e.toString())
            }
        }
    }
}