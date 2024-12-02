package com.easter.watch.presentation.service

import android.Manifest
import android.app.Activity
import android.app.Service
import android.content.Intent
import android.content.pm.PackageManager
import android.os.IBinder
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat

class SensorPermissionService : Service() {

    override fun onBind(intent: Intent?): IBinder? = null

    fun checkAndRequestPermissions(activity: Activity) {
        val permissionsNeeded = mutableListOf<String>()
        if (ContextCompat.checkSelfPermission(activity, Manifest.permission.BODY_SENSORS) != PackageManager.PERMISSION_GRANTED) {
            permissionsNeeded.add(Manifest.permission.BODY_SENSORS)
        }
        if (ContextCompat.checkSelfPermission(activity, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            permissionsNeeded.add(Manifest.permission.ACCESS_FINE_LOCATION)
        }
        if (permissionsNeeded.isNotEmpty()) {
            ActivityCompat.requestPermissions(activity, permissionsNeeded.toTypedArray(), PERMISSION_REQUEST_CODE)
        }
    }

    companion object {
        const val PERMISSION_REQUEST_CODE = 100
    }
}
