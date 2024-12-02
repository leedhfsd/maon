package com.easter.watch.presentation.service

import android.annotation.SuppressLint
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context.SENSOR_SERVICE
import android.content.Intent
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import androidx.core.app.ServiceCompat.startForeground
import androidx.core.app.ServiceCompat.stopForeground
import androidx.core.content.ContextCompat.getSystemService
import com.easter.watch.R
import com.easter.watch.presentation.RunApplication
import com.easter.watch.presentation.view.run.RunActivity
import com.easter.watch.presentation.view.run.RunViewModel

class RunService : Service() {
    private var isRunning = false
    private lateinit var runViewModel: RunViewModel
    private lateinit var sensorManager: SensorManager
    private lateinit var heartRateSensor: Sensor

    companion object {
        const val ACTION_START = "ACTION_START"
        const val ACTION_PAUSE = "ACTION_PAUSE"
        const val ACTION_STOP = "ACTION_STOP"
        const val NOTIFICATION_ID = 1
        const val CHANNEL_ID = "run_channel"
    }

    private val sensorEventListener = object : SensorEventListener {
        override fun onSensorChanged(event: SensorEvent?) {
            if (event?.sensor?.type == Sensor.TYPE_HEART_RATE) {
                runViewModel.updateHeartRate(event.values[0].toInt())
            }
        }

        override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}
    }

    override fun onCreate() {
        super.onCreate()
        // Application에서 ViewModel 가져오기
        runViewModel = (application as RunApplication).runViewModel
        setupSensors()
        createNotificationChannel()
    }

    private fun setupSensors() {
        sensorManager = getSystemService(SENSOR_SERVICE) as SensorManager
        heartRateSensor = sensorManager.getDefaultSensor(Sensor.TYPE_HEART_RATE)!!
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_START -> start()
            ACTION_PAUSE -> pause()
            ACTION_STOP -> stop()
        }
        return START_STICKY
    }

    @SuppressLint("ForegroundServiceType")
    private fun start() {
        isRunning = true
        runViewModel.startTimer()
        sensorManager.registerListener(
            sensorEventListener,
            heartRateSensor,
            SensorManager.SENSOR_DELAY_NORMAL
        )
        startForeground(NOTIFICATION_ID, createNotification())
    }

    @SuppressLint("ForegroundServiceType")
    private fun pause() {
        isRunning = false
        runViewModel.pauseTimer()
        sensorManager.unregisterListener(sensorEventListener)
        startForeground(NOTIFICATION_ID, createNotification())
    }

    private fun stop() {
        isRunning = false
        runViewModel.stopTimer()
        sensorManager.unregisterListener(sensorEventListener)
        stopForeground(true)
        stopSelf()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Run Tracking",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Run tracking service notification"
            }
            val notificationManager = getSystemService(NotificationManager::class.java)
            notificationManager.createNotificationChannel(channel)
        }
    }

    private fun createNotification(): Notification {
        val notificationIntent = Intent(this, RunActivity::class.java)
        val pendingIntent = PendingIntent.getActivity(
            this, 0, notificationIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val stopIntent = Intent(this, RunService::class.java).apply {
            action = ACTION_STOP
        }
        val stopPendingIntent = PendingIntent.getService(
            this, 1, stopIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val pauseResumeIntent = Intent(this, RunService::class.java).apply {
            action = if (isRunning) ACTION_PAUSE else ACTION_START
        }
        val pauseResumePendingIntent = PendingIntent.getService(
            this, 2, pauseResumeIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Run Tracking")
            .setContentText(if (isRunning) "Tracking in progress..." else "Tracking paused")
            .setSmallIcon(R.drawable.ic_calory)
            .setContentIntent(pendingIntent)
            .addAction(
                R.drawable.circle_stop_red,
                "Stop",
                stopPendingIntent
            )
            .addAction(
                if (isRunning) R.drawable.circle_pause_solid_light else R.drawable.circle_play_green,
                if (isRunning) "Pause" else "Resume",
                pauseResumePendingIntent
            )
            .setOngoing(true)
            .build()
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        super.onDestroy()
        sensorManager.unregisterListener(sensorEventListener)
    }
}