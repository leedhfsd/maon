package com.easter.watch.presentation.view.run

import android.os.Bundle
import android.util.Log
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.easter.watch.R
import com.easter.watch.presentation.dataModel.RunResult

class ResultActivity : AppCompatActivity() {

    private lateinit var runResult: RunResult
    
    val TAG = "달리기 결과"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_result)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        // Intent에서 RunResult 가져오기
        runResult = intent.getParcelableExtra("runResult") ?: throw IllegalArgumentException("RunResult is missing!")

        Log.d(TAG, runResult.toString())
    
    }
}