package com.easter.watch.presentation.view.notification

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.widget.TextView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.easter.watch.R
import com.easter.watch.databinding.ActivityConnectSuccessBinding
import com.easter.watch.presentation.view.RecordActivity
import com.easter.watch.presentation.view.run.StartActivity

class ConnectSuccessActivity : AppCompatActivity() {

    private lateinit var binding: ActivityConnectSuccessBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // DataBinding 객체 초기화
        binding = ActivityConnectSuccessBinding.inflate(layoutInflater)
        setContentView(binding.root)
        enableEdgeToEdge()
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        // Intent에서 memberNickname 값을 수신하여 DataBinding 변수에 설정
        val memberNickname = intent.getStringExtra("memberNickname") ?: "알수없음"
        binding.nickNameText.text = memberNickname +" 님" // XML에 바로 적용

        Handler().postDelayed(Runnable { // 타이머가 끝나면 내부 실행
            intent = Intent(this@ConnectSuccessActivity, RecordActivity::class.java)
            startActivity(intent)
            finish()
        }, 2000) // 2초
    }

}
