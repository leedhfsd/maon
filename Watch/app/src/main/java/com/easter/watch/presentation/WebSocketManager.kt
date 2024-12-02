package com.easter.watch.presentation

import android.os.Handler
import android.os.Looper
import com.easter.watch.presentation.dataModel.MemberInfo
import com.easter.watch.presentation.dataModel.WebSocketMessage
import com.google.gson.Gson
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import okhttp3.WebSocket
import okhttp3.WebSocketListener
import java.util.concurrent.TimeUnit

class WebSocketManager private constructor() {
    private var webSocket: WebSocket? = null
    private val client = OkHttpClient.Builder()
        .readTimeout(0, TimeUnit.MILLISECONDS) // WebSocket은 타임아웃 없음
        .build()

    private var memberInfoCallback: ((MemberInfo) -> Unit)? = null

    companion object {
        @Volatile
        private var instance: WebSocketManager? = null

        fun getInstance() = instance ?: synchronized(this) {
            instance ?: WebSocketManager().also { instance = it }
        }
    }

    fun connect(url: String, deviceToken: String) {
        val request = Request.Builder()
            .url("${url}/ws/watch?deviceToken=${deviceToken}")
            .build()

        val listener = object : WebSocketListener() {
            override fun onMessage(webSocket: WebSocket, text: String) {
                try {
                    val message = Gson().fromJson(text, WebSocketMessage::class.java)
                    when (message.type) {
                        "MEMBER_INFO" -> {
                            val memberInfo = Gson().fromJson(message.data, MemberInfo::class.java)
                            memberInfoCallback?.invoke(memberInfo)
                        }
                    }
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }

            override fun onFailure(webSocket: WebSocket, t: Throwable, response: Response?) {
                // 연결 실패시 재연결 로직
                reconnect(url, deviceToken)
            }
        }

        webSocket = client.newWebSocket(request, listener)
    }

    private fun reconnect(url: String, deviceToken: String) {
        Handler(Looper.getMainLooper()).postDelayed({
            connect(url, deviceToken)
        }, 5000) // 5초 후 재연결
    }

    fun setMemberInfoCallback(callback: (MemberInfo) -> Unit) {
        memberInfoCallback = callback
    }

    fun disconnect() {
        webSocket?.close(1000, null)
        webSocket = null
        memberInfoCallback = null
    }
}