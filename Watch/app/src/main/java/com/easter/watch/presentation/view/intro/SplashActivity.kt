package com.easter.watch.presentation.view.intro

import StompWebSocketClient
import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import androidx.compose.ui.text.InternalTextApi
import androidx.room.Room
import com.easter.watch.R
import com.easter.watch.presentation.dataModel.StartInfo
import com.easter.watch.presentation.db.MemberDatabase
import com.easter.watch.presentation.db.dao.MemberDao
import com.easter.watch.presentation.view.RecordActivity
import com.easter.watch.presentation.view.run.RunActivity
import com.easter.watch.presentation.view.run.StartActivity
import com.google.android.gms.wearable.NodeClient
import com.google.android.gms.wearable.Wearable
import com.google.gson.Gson
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import kotlin.math.log

class SplashActivity : AppCompatActivity() {

    private lateinit var nodeClient: NodeClient
    private lateinit var intent : Intent
    private lateinit var memberDao: MemberDao
    private lateinit var stompClient: StompWebSocketClient

    val TAG =  "Splash"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_splash)

        // 윈도우 배경을 투명하게 설정하여 더 빠른 로딩처럼 보이게 함
        window.setBackgroundDrawable(null)

        // Database 초기화
        val db = MemberDatabase.getDatabase(this)
        memberDao = db.memberDao()

        // 모든 데이터 삭제
//        CoroutineScope(Dispatchers.IO).launch {
//            memberDao.deleteAll() // 테이블 초기화
//            Log.d(TAG, "MemberDatabase 초기화 완료")
//        }

        nodeClient = Wearable.getNodeClient(this)


        Handler().postDelayed(Runnable { // 타이머가 끝나면 내부 실행

            //test용 - 후에 주석 쳐주기
//            intent = Intent(this@SplashActivity, AuthActivity::class.java) // 앱의 MainActivity로 넘어가기
//            startActivity(intent)
//            finish()

//            CoroutineScope 내에서 Room 작업을 처리하면 비동기적으로 실행되기 때문에,
//            anyMemberExists 값은 CoroutineScope가 완료되기 전에 평가될 수 있습니다.
//            이를 해결하려면 suspend 함수나 runBlocking을 활용하여 데이터를 가져온 뒤, 조건을 평가해야 합니다.

//            CoroutineScope(Dispatchers.Main).launch {
//                // Room 쿼리 실행 및 결과 확인
//                val anyMemberExists = withContext(Dispatchers.IO) {
//                    memberDao.isMemberExists() > 0
//                }
//
//                val intent = if (anyMemberExists) {
//                    val memberId = memberDao.getMemberId()
//                    stompClient = StompWebSocketClient("wss://k11c207.p.ssafy.io/maon/route/ws/location")
//                    CoroutineScope(Dispatchers.IO).launch {
//                        stompClient.connect()
//                    }
//                    subscribeToMemberTopic(memberId)
//
//                    Intent(this@SplashActivity, StartActivity::class.java)
//                } else {
//                    Intent(this@SplashActivity, AuthActivity::class.java)
//                }
//                startActivity(intent)
//                finish()
//            }

            //핸드폰 연결 여부 따른 페이지 이동
            checkConnectionToPhone{isConnected ->
                if(isConnected){
                    // 전체 테이블에 memberId가 하나라도 있는지 확인
                    CoroutineScope(Dispatchers.Main).launch {
                        // Room 쿼리 실행 및 결과 확인
                        val anyMemberExists = withContext(Dispatchers.IO) {
                            memberDao.isMemberExists() > 0
                        }

                        val intent = if (anyMemberExists) {
//                            CoroutineScope(Dispatchers.Main).launch {
//                                val memberId = memberDao.getMemberId()
//                                stompClient = StompWebSocketClient("wss://k11c207.p.ssafy.io/maon/route/ws/location")
//
//                                stompClient.connect {
//                                    Log.d(TAG, "STOMP 연결 후 구독 요청 실행")
//                                    subscribeToMemberTopic(memberId) // 연결 후에 구독
//                                }
//                            }
                            Intent(this@SplashActivity, RecordActivity::class.java)
                        } else {
                            Intent(this@SplashActivity, AuthActivity::class.java)
                        }
                        startActivity(intent)
                        finish()
                    }
                }else{
                    intent = Intent(this@SplashActivity,RestartActivity::class.java)
                    startActivity(intent)
                    finish() // 현재 액티비티 닫기
                }
            }

        }, 2000) // 2초
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
        stompClient.subscribeToTopic("/sub/start/$memberId","sub-member"){ payload ->
            try{
                // JSON 데이터를 AuthInfo 객체로 변환
                val jsonBody = extractJsonFromStompMessage(payload)
                Log.d(TAG, "추출된 JSON: $jsonBody")

                // Gson을 사용해 JSON을 StartInfo 객체로 변환
                val startInfo = Gson().fromJson(jsonBody, StartInfo::class.java)
                Log.d(TAG, "변환된 StartInfo 객체: $startInfo")

                when(startInfo.mode){
                    "notSelectedRoute" ->{
                        val intent = Intent(this, RunActivity::class.java)
                        startActivity(intent)
                        finish()
                    }
                }

            }catch (e : Exception){
                Log.d(TAG, e.toString())
            }
        }
    }


    //비동기 -> callback
    fun checkConnectionToPhone(callback: (Boolean) -> Unit) {
        nodeClient.connectedNodes.addOnSuccessListener { nodes ->
            if (nodes.isNotEmpty()) {
                Log.d("WatchConnection", "스마트폰과 연결되어 있습니다.")
                callback(true)
            } else {
                Log.d("WatchConnection", "스마트폰과 연결되어 있지 않습니다.")
                callback(false)
            }
        }.addOnFailureListener { e ->
            Log.e("WatchConnection", "연결 확인 중 오류 발생", e)
            callback(false)
        }
    }
}