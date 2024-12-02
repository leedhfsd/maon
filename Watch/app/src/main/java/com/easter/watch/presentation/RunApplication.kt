package com.easter.watch.presentation

import android.app.Application
import com.easter.watch.presentation.view.run.RunViewModel

class RunApplication : Application() {
    lateinit var runViewModel: RunViewModel
        private set

    override fun onCreate() {
        super.onCreate()
        runViewModel = RunViewModel()
    }
}