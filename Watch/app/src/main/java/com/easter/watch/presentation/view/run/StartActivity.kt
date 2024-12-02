package com.easter.watch.presentation.view.run

import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.util.Log
import android.view.animation.AnimationUtils
import android.view.animation.ScaleAnimation
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.easter.watch.R
import com.easter.watch.databinding.ActivityStartBinding
import com.easter.watch.presentation.WebSocketManager
import com.easter.watch.presentation.dataModel.MemberInfo
import com.easter.watch.presentation.service.SensorPermissionService
import com.google.firebase.messaging.FirebaseMessaging

class StartActivity : AppCompatActivity() {

    private lateinit var binding: ActivityStartBinding
    private val webSocketManager = WebSocketManager.getInstance()
    private var memberId: String? = null
    private val viewModel: RunViewModel by viewModels()
    private lateinit var permissionService: SensorPermissionService


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityStartBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // SensorPermissionService 초기화
        permissionService = SensorPermissionService()
        // 권한 확인 및 요청
        permissionService.checkAndRequestPermissions(this)

        binding.runStartBtn.setOnClickListener {
            val intent = Intent(this, RunActivity::class.java)

            startActivity(intent)
            finish()
        }

    }

    // 권한 요청 결과 확인
    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)

        if (requestCode == SensorPermissionService.PERMISSION_REQUEST_CODE) {
            // 권한이 모두 허용되었는지 확인
            if (grantResults.isNotEmpty() && grantResults.all { it == PackageManager.PERMISSION_GRANTED }) {

            } else {
                // 권한이 하나라도 허용되지 않은 경우 사용자에게 안내
                Toast.makeText(this, "권한이 필요합니다.", Toast.LENGTH_SHORT).show()
                startActivity(Intent(this,StartActivity::class.java))
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        webSocketManager.disconnect()
    }

}