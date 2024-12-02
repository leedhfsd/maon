package com.easter.watch.presentation.view.adapter

import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentActivity
import androidx.viewpager2.adapter.FragmentStateAdapter
import com.easter.watch.presentation.view.run.RunFragment1
import com.easter.watch.presentation.view.run.RunFragment2
import com.easter.watch.presentation.view.run.RunFragment3

class ScreenSlidePagerAdapter(activity : FragmentActivity) : FragmentStateAdapter(activity) {
    override fun getItemCount(): Int = 3 //fragment 3개

    override fun createFragment(position: Int): Fragment {
        return when (position) {
            0 -> RunFragment1() // 왼쪽 Fragment
            1 -> RunFragment2() // 가운데 Fragment (메인)
            2 -> RunFragment3() // 오른쪽 Fragment
            else -> RunFragment2() // 기본 값으로 가운데 Fragment 설정
        }
    }

}