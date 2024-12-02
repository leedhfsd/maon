package com.easter.watch.presentation.service

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Intent
import android.os.IBinder
import android.os.Looper
import android.util.Log
import androidx.core.app.NotificationCompat
import androidx.lifecycle.ViewModelProvider
import com.easter.watch.R
import com.easter.watch.presentation.view.run.RunActivity
import com.easter.watch.presentation.view.run.RunFragment2
import com.easter.watch.presentation.view.run.RunViewModel
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationCallback
import com.google.android.gms.location.LocationRequest
import com.google.android.gms.location.LocationResult
import com.google.android.gms.location.LocationServices
import com.google.android.gms.maps.model.LatLng

class LocationTrackingService : Service() {
    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private val locationList = mutableListOf<LatLng>()
    private var isTracking = false
    private var isPaused = false // PAUSE 상태를 추적

    private var long : Double? = null
    private  var lat : Double? = null

    companion object {
        const val CHANNEL_ID = "LocationTrackingChannel"
        const val NOTIFICATION_ID = 1
        const val ACTION_START_TRACKING = "START_TRACKING"
        const val ACTION_STOP_TRACKING = "STOP_TRACKING"
        const val ACTION_PAUSE_TRACKING = "PAUSE_TRACKING"
        const val ACTION_UPDATE_LOCATION = "UPDATE_LOCATION"
    }

    // LiveData를 관찰할 수 있도록 ViewModel 인스턴스 생성
    private val runViewModel: RunViewModel by lazy {
        ViewModelProvider.AndroidViewModelFactory.getInstance(application)
            .create(RunViewModel::class.java)
    }

    private val locationRequest = LocationRequest.create().apply {
        priority = LocationRequest.PRIORITY_HIGH_ACCURACY
        interval = 1000  // 1초
        fastestInterval = 500   // 0.5초
        smallestDisplacement = 3f  // 3미터
    }

    private val locationCallback = object : LocationCallback() {
        override fun onLocationResult(locationResult: LocationResult) {
            for (location in locationResult.locations) {
                val currentLatLng = LatLng(location.latitude, location.longitude)
                lat = location.latitude
                long = location.longitude

                // ViewModel로 위치 데이터 전달
                //runViewModel.updateDistance(lat!!, long!!)

                Log.d("현재위치",currentLatLng.toString())

                if (isTracking) {
                    locationList.add(currentLatLng)
                    // 위치 업데이트를 브로드캐스트로 전송
                    sendLocationUpdateBroadcast(currentLatLng)
                }
            }
        }
    }

    override fun onCreate() {
        super.onCreate()
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)
        createNotificationChannel()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_START_TRACKING -> {
                startForegroundService()
                startTracking() // Tracking 시작
            }
            ACTION_STOP_TRACKING -> {
                stopTracking() // Tracking 중지 및 Foreground 종료
            }
            ACTION_PAUSE_TRACKING -> { // 추가
                pauseTracking() // Tracking 중지하지만 Foreground 유지
            }
        }
        return START_STICKY
    }

    private fun startTracking() {
        isTracking = true
        isPaused = false
        locationList.clear()
        startForegroundService()
        startLocationUpdates()
    }

    private fun stopTracking() {
        isTracking = false
        isPaused = false
        stopLocationUpdates()
        stopForeground(true)
        stopSelf()
    }

    private fun pauseTracking() { // 추가
        isTracking = false
        isPaused = true // PAUSE 상태 설정
        stopLocationUpdates() // 위치 업데이트 중지
    }

    private fun createNotificationChannel() {
        val channel = NotificationChannel(
            CHANNEL_ID,
            "Location Tracking Channel",
            NotificationManager.IMPORTANCE_DEFAULT
        )
        val notificationManager = getSystemService(NotificationManager::class.java)
        notificationManager.createNotificationChannel(channel)
    }

    private fun startForegroundService() {

        val notificationIntent = Intent(this, RunActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_SINGLE_TOP or
                    Intent.FLAG_ACTIVITY_CLEAR_TOP or
                    Intent.FLAG_ACTIVITY_REORDER_TO_FRONT
        }

        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            notificationIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("달리기 추적 중")
            .setContentText("달리기를 기록하고 있습니다")
            .setSmallIcon(R.drawable.ic_calory)
            .setContentIntent(pendingIntent)
            .setForegroundServiceBehavior(NotificationCompat.FOREGROUND_SERVICE_IMMEDIATE)
            .build()

        startForeground(NOTIFICATION_ID, notification)
    }

    private fun startLocationUpdates() {
        try {
            fusedLocationClient.requestLocationUpdates(
                locationRequest,
                locationCallback,
                Looper.getMainLooper()
            )
        } catch (e: SecurityException) {
            // 권한 없음 처리
        }
    }

    private fun stopLocationUpdates() {
        fusedLocationClient.removeLocationUpdates(locationCallback)
    }

    private fun sendLocationUpdateBroadcast(location: LatLng) {
        Intent(ACTION_UPDATE_LOCATION).apply {
            // 명시적 인텐트로 변경
            setPackage(packageName)
            putExtra("latitude", location.latitude)
            putExtra("longitude", location.longitude)
            sendBroadcast(this)
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null
}