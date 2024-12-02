package com.easter.watch.presentation.view.run

import StompWebSocketClient
import android.Manifest
import android.app.Activity
import android.content.Intent
import android.content.pm.PackageManager
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.view.MotionEvent
import android.view.WindowManager
import android.view.animation.AnimationUtils
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContentProviderCompat.requireContext
import androidx.core.content.ContextCompat
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.isInvisible
import androidx.databinding.DataBindingUtil.setContentView
import androidx.viewpager2.widget.ViewPager2
import androidx.wear.ambient.AmbientModeSupport
import androidx.wear.widget.SwipeDismissFrameLayout
import androidx.wear.widget.drawer.WearableDrawerLayout
import com.easter.watch.R
import com.easter.watch.databinding.ActivityAuthBinding
import com.easter.watch.databinding.ActivityRestartBinding
import com.easter.watch.databinding.ActivityRunBinding
import com.easter.watch.presentation.db.MemberDatabase
import com.easter.watch.presentation.db.dao.MemberDao
import com.easter.watch.presentation.service.SensorPermissionService
import com.easter.watch.presentation.view.adapter.ScreenSlidePagerAdapter
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.checkerframework.checker.units.qual.min
import java.text.SimpleDateFormat
import java.util.TimeZone
import java.util.Timer
import java.util.TimerTask
import kotlin.concurrent.timer

class RunActivity : AppCompatActivity(), SensorEventListener {

    private lateinit var stompClient: StompWebSocketClient


    val TAG : String = "RunActivity"
    private  var time =0
    private var timerTask : Timer? = null

    private lateinit var binding : ActivityRunBinding
    private lateinit var sensorManager: SensorManager
    private lateinit var heartSensor: Sensor
    private val viewModel: RunViewModel by viewModels()
    private var isInitialized = false

    private lateinit var memberDao: MemberDao
    private lateinit var memberId: String

    var recordId : String = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        if (!isInitialized) {
            binding = ActivityRunBinding.inflate(layoutInflater)
            setContentView(binding.root)

            // Room Database 초기화
            val db = MemberDatabase.getDatabase(this)
            memberDao = db.memberDao()

            //recordId 가져오기
            recordId = intent.getStringExtra("recordId") ?: ""

            // memberId 가져오기
            CoroutineScope(Dispatchers.IO).launch {
                memberId = memberDao.getMemberId()

                withContext(Dispatchers.Main) {
                    // WebSocket 연결 시작
                    viewModel.startWebSocket(memberId = memberId, recordId = recordId, context = this@RunActivity)
                }
            }

            showClock()
            checkPermissions()
            setupSensors()
            setupViewPager()
            setupObservers()
            viewModel.startTimer()
            viewModel.startTracking()

            isInitialized = true
        }
    }

    private fun checkPermissions() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) !=
                PackageManager.PERMISSION_GRANTED) {
                requestPermissions(arrayOf(Manifest.permission.POST_NOTIFICATIONS), 1)
            }
        }
    }

    private fun setupViewPager(){
        // ViewPager2와 어댑터 설정
        val viewPager: ViewPager2 = findViewById(R.id.viewPager)

        // 먼저 ViewPager 캐싱 설정
        viewPager.apply {
            offscreenPageLimit = 2
        }

        // 어댑터 설정
        val pagerAdapter = ScreenSlidePagerAdapter(this@RunActivity)
        viewPager.adapter = pagerAdapter

        // 어댑터 설정 후 초기 페이지 설정
        viewPager.setCurrentItem(1, false)  // 또는 viewPager.currentItem = 1

//        // 페이지 캐싱 설정 - 맵 fragment의 상태 유지를 위해
//        viewPager.offscreenPageLimit = 2
//
//        // 기본 페이지를 가운데 Fragment(1번 인덱스)로 설정
        //viewPager.currentItem = 1

        //하트 뛰는 애니메이션
        val pulseAnimation = AnimationUtils.loadAnimation(this@RunActivity, R.anim.pulse_animation)
        binding.heartImg.startAnimation(pulseAnimation)


        // 페이지 변경 시 색상 업데이트
        viewPager.registerOnPageChangeCallback(object : ViewPager2.OnPageChangeCallback() {
            override fun onPageSelected(position: Int) {
                super.onPageSelected(position)

                if(position == 0){
                    binding.runtimeText.isInvisible = false
                    binding.runTime.isInvisible = false
                    binding.clockText.setTextColor(ContextCompat.getColor(this@RunActivity,R.color.light_beige))
                    binding.page1.setImageDrawable(ContextCompat.getDrawable(this@RunActivity,R.drawable.round_selected_page))
                    binding.page2.setImageDrawable(ContextCompat.getDrawable(this@RunActivity,R.drawable.round_not_selected_page))
                    binding.page3.setImageDrawable(ContextCompat.getDrawable(this@RunActivity,R.drawable.round_not_selected_page))
                    binding.heartText.setTextColor(ContextCompat.getColor(this@RunActivity,R.color.white))

                }else if(position ==1){
                    binding.runtimeText.isInvisible = false
                    binding.runTime.isInvisible = false
                    binding.clockText.setTextColor(ContextCompat.getColor(this@RunActivity,R.color.light_beige))
                    binding.page1.setImageDrawable(ContextCompat.getDrawable(this@RunActivity,R.drawable.round_not_selected_page))
                    binding.page2.setImageDrawable(ContextCompat.getDrawable(this@RunActivity,R.drawable.round_selected_page))
                    binding.page3.setImageDrawable(ContextCompat.getDrawable(this@RunActivity,R.drawable.round_not_selected_page))
                    binding.heartText.setTextColor(ContextCompat.getColor(this@RunActivity,R.color.white))

                }else{
                    binding.runtimeText.isInvisible = true
                    binding.runTime.isInvisible = true
                    binding.clockText.setTextColor(ContextCompat.getColor(this@RunActivity,R.color.real_black))
                    binding.page1.setImageDrawable(ContextCompat.getDrawable(this@RunActivity,R.drawable.round_not_selected_page))
                    binding.page2.setImageDrawable(ContextCompat.getDrawable(this@RunActivity,R.drawable.round_not_selected_page))
                    binding.page3.setImageDrawable(ContextCompat.getDrawable(this@RunActivity,R.drawable.round_selected_page))
                    binding.heartText.setTextColor(ContextCompat.getColor(this@RunActivity,R.color.real_black))
                }
            }
        })
    }

    private fun setupSensors() {
        sensorManager = getSystemService(SENSOR_SERVICE) as SensorManager
        heartSensor = sensorManager.getDefaultSensor(Sensor.TYPE_HEART_RATE)!!
        sensorManager.registerListener(this, heartSensor, SensorManager.SENSOR_DELAY_NORMAL)
    }

    override fun onSensorChanged(event: SensorEvent?) {
        if (event?.sensor?.type == Sensor.TYPE_HEART_RATE) {
            viewModel.updateHeartRate(event.values[0].toInt())
        }
    }

    override fun onAccuracyChanged(p0: Sensor?, p1: Int) {

    }


    fun showClock(){
        // 대한민국 시간대로 설정
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Seoul"))

        // 실시간 시간 업데이트를 위한 타이머 설정
        val timer = Timer()
        timer.scheduleAtFixedRate(object : TimerTask() {
            override fun run() {
                runOnUiThread {
                    val currentTime = System.currentTimeMillis()
                    binding.clockText.text = SimpleDateFormat("HH:mm").format(currentTime)
                }
            }
        }, 0, 1000) // 0ms 후 시작, 1000ms (1초) 간격으로 실행

    }

    private fun setupObservers() {
        viewModel.heartRate.observe(this) { heartRate ->
            binding.heartText.text = heartRate.toString()
        }

//        viewModel.isRunning.observe(this) { isRunning ->
//            val pulseAnimation = AnimationUtils.loadAnimation(this, R.anim.pulse_animation)
//            if (isRunning) {
//                binding.heartImg.startAnimation(pulseAnimation)
//            } else {
//                binding.heartImg.clearAnimation()
//            }
//        }

        viewModel.timerText.observe(this) { time ->
            binding.runTime.text = time
        }
    }






}