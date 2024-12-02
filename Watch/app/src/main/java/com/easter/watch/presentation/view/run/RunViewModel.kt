package com.easter.watch.presentation.view.run

import StompWebSocketClient
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log
import androidx.core.content.ContentProviderCompat.requireContext
import androidx.core.content.ContextCompat.startActivity
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.easter.watch.presentation.dataModel.RunInfo
import com.easter.watch.presentation.dataModel.RunResult
import com.easter.watch.presentation.dataModel.StartInfo
import com.easter.watch.presentation.service.LocationTrackingService
import com.easter.watch.presentation.view.RecordActivity
import com.google.android.gms.maps.model.LatLng
import com.google.gson.Gson
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*
import kotlin.math.log


class RunViewModel : ViewModel() {

    val TAG = "RunViewModel"

    // WebSocket 클라이언트
    private lateinit var stompClient: StompWebSocketClient
    private var webSocketJob: Job? = null

    private var tt = 0
    private var total = 0.0  // total 변수도 추가
    private var previousLat: Double? = null
    private var previousLong: Double? = null

    // LiveData 선언
    private val _pace = MutableLiveData<String>()
    val pace: LiveData<String> = _pace

    private val _currentDistance = MutableLiveData<Double>()
    val currentDistance: LiveData<Double> = _currentDistance

    private val _totalDistance = MutableLiveData<Double>()
    val totalDistance: LiveData<Double> = _totalDistance

    private val _recordId = MutableLiveData<String>()
    val recordId: LiveData<String> = _recordId

    init {
        viewModelScope.launch(Dispatchers.Main) {
            _pace.value = "00'00''"
            _totalDistance.value = 0.0
        }
    }

    //---------------

    // WebSocket 연결 시작
    fun startWebSocket(memberId: String, recordId: String, context: Context) {
        stompClient = StompWebSocketClient("wss://k11c207.p.ssafy.io/maon/route/ws/location")

        // WebSocket 연결
        CoroutineScope(Dispatchers.IO).launch {
            stompClient.connect()
        }

        // 1초마다 데이터 전송
        webSocketJob = viewModelScope.launch(Dispatchers.IO) {
            while (isActive) {
                val data = createRunningData(memberId, recordId)
                sendRunningData(data, recordId)
                delay(1000L) // 1초 대기
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

    //달리기 끝나는 신호 구독 -> end 받기도 하고 주기도하고
    fun subscribeToRunningEndTopic(recordId : String, context: Context){
        stompClient.subscribeToTopic("/sub/running/$recordId/end","sub-running-end"){ payload ->
            try{
                // JSON 데이터를 AuthInfo 객체로 변환
                val jsonBody = extractJsonFromStompMessage(payload)
                Log.d(TAG, "추출된 JSON: $jsonBody")

                // Gson을 사용해 JSON을 StartInfo 객체로 변환
                val runResult = Gson().fromJson(jsonBody, RunResult::class.java)
                Log.d(TAG, "데이터에 넣은 데이터 : $runResult ")

                _recordId.value = recordId

                // Intent 생성
                val intent = Intent(context, RecordActivity::class.java).apply {
                    putExtra("runResult", runResult)
                }
                context.startActivity(intent)

                stopWebSocket()

            }catch (e : Exception){
                Log.d(TAG, e.toString())
            }
        }
    }

    fun stopRunning(recordId : String){
        stompClient.sendMessageString("/pub/running/$recordId/end","") //완료 보내기
    }


    // WebSocket 연결 종료
    fun stopWebSocket() {
        webSocketJob?.cancel()
        webSocketJob = null
        stompClient.disconnect()
    }


    // RunningData 생성
    private fun createRunningData(memberId: String, recordId: String): RunInfo {

        val heartRateValue = heartRate.value ?: 0
        val totalDistanceValue = totalDistance.value ?: 0.0
        val paceValue = pace.value ?: "00'00''"
        val timerTextValue = timerText.value ?: "00:00"

        return RunInfo(
            memberId = memberId,
            recordId = recordId,
            latitude = previousLat ?: 0.0,
            longitude = previousLong ?: 0.0,
            heartRate = heartRateValue,
            pace = paceValue,
            time = timerTextValue,
            runningDistance = formatDistance(totalDistanceValue)
        )
    }

    // STOMP를 사용해 데이터 전송
    private fun sendRunningData(data: RunInfo, recordId: String) {
        val jsonData = Gson().toJson(data)
        stompClient.sendMessageJson("/pub/running/$recordId", jsonData)
        Log.d("WebSocket", "Data sent: $jsonData")
    }


    //---------------
    // 타이머 관련
    private var timerJob: Job? = null
    private var timeInSeconds = 0
    private val _timerText = MutableLiveData("00:00")
    val timerText: LiveData<String> = _timerText

    // 달린 거리 관련
    private val _distance = MutableLiveData(0.0)
    val distance: LiveData<Double> = _distance

    // 심박수 관련
    private val _heartRate = MutableLiveData(0)
    val heartRate: LiveData<Int> = _heartRate

    // 운동 상태
    private val _isRunning = MutableLiveData(false)
    val isRunning: LiveData<Boolean> = _isRunning

    // 트래킹 상태
    private val _isTracking = MutableLiveData(false)
    val isTracking: LiveData<Boolean> = _isTracking

    // 트래킹 일시정지 상태 (내부용으로만 변경 가능)
    private val _isPaused = MutableLiveData(false)
    val isPaused: LiveData<Boolean> = _isPaused

    // 일시정지 상태 설정 메서드
    fun setPausedState(isPaused: Boolean) {
        _isPaused.value = isPaused
    }

    // 타이머 시작
    fun startTimer() {
        if (timerJob == null) {
            _isRunning.value = true
            setPausedState(false)
            timerJob = viewModelScope.launch {
                while (isActive) {
                    delay(1000)
                    timeInSeconds++
                    updateTimerText()
                }
            }
        }
    }

    // 타이머 일시정지
    fun pauseTimer() {
        _isRunning.value = false
        setPausedState(true)
        timerJob?.cancel()
        timerJob = null
    }

    // 타이머 재개
    fun resumeTimer() {
        if (_isPaused.value == true) {
            startTimer()
        }
    }

    // 타이머 정지 (리셋)
    fun stopTimer() {
        pauseTimer()
        timeInSeconds = 0
        _distance.value = 0.0
        _pace.value = "00'00''"
        _heartRate.value = 0
        updateTimerText()
        setPausedState(false)
    }

    // 트래킹 시작
    fun startTracking() {
        _isTracking.value = true
        setPausedState(false)
    }

    // 트래킹 일시정지
    fun pauseTracking() {
        _isPaused.value = true
        setPausedState(true)
    }

    // 트래킹 재개
    fun resumeTracking() {
        _isPaused.value = false
        setPausedState(false)
    }

    // 트래킹 중지
    fun stopTracking() {
        tt=0
        _isTracking.value = false
        setPausedState(false)
    }

    // 타이머 텍스트 업데이트
    private fun updateTimerText() {
        val hours = timeInSeconds / 3600
        val minutes = (timeInSeconds % 3600) / 60
        val seconds = timeInSeconds % 60

        _timerText.value = if (hours > 0) {
            String.format(" %02d:%02d:%02d ", hours, minutes, seconds)
        } else {
            String.format(" %02d:%02d ", minutes, seconds)
        }
    }

    private fun calculatePace(distance: Double, tt: Int) {
        viewModelScope.launch(Dispatchers.Main) {
            if (distance > 0) {
                val paceInSeconds = (tt / distance).toInt()
                val paceMinutes = paceInSeconds / 60
                val paceSeconds = paceInSeconds % 60
                val paceString = String.format("%02d'%02d''", paceMinutes, paceSeconds)

                Log.d("Pace", "Calculating pace - Time: $tt, Distance: $distance")
                Log.d("Pace", "New pace value: $paceString")

                _pace.value = paceString
                Log.d("Pace", "Pace updated in LiveData: ${_pace.value}")
            }
        }
    }

    // 심박수 업데이트
    fun updateHeartRate(heartRate: Int) {
        _heartRate.value = heartRate
    }

    fun updateDistance(newLat: Double, newLong: Double) {
        viewModelScope.launch(Dispatchers.Main) {
            if (previousLat != null && previousLong != null) {
                val distance = calculateDistance(previousLat!!, previousLong!!, newLat, newLong)
                total += distance

                Log.d("Distance", "Current: $distance, Total: $total")

                _currentDistance.value = distance
                _totalDistance.value = total

                Log.d("거리 LiveData", "Total Distance Updated: ${_totalDistance.value}")

                tt++
                calculatePace(total, tt)
            }
            previousLat = newLat
            previousLong = newLong
        }
    }


    // Haversine 공식을 사용한 두 지점 간의 거리 계산 (km 단위)
    private fun calculateDistance(lat1: Double, lon1: Double, lat2: Double, lon2: Double): Double {
        val R = 6371.0 // 지구의 반경 (km)

        val lat1Rad = Math.toRadians(lat1)
        val lat2Rad = Math.toRadians(lat2)
        val latDiff = Math.toRadians(lat2 - lat1)
        val lonDiff = Math.toRadians(lon2 - lon1)

        val a = Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
                Math.cos(lat1Rad) * Math.cos(lat2Rad) *
                Math.sin(lonDiff / 2) * Math.sin(lonDiff / 2)

        val c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

        return R * c // km 단위로 반환
    }

    // 거리를 소수점 2자리까지 표시하는 헬퍼 함수
    fun formatDistance(distance: Double): String {
        return String.format("%.2f", distance)
    }




}
