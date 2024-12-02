package com.easter.watch.presentation.view.run

import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.animation.AnimationUtils
import android.widget.ImageView
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import com.easter.watch.R
import com.easter.watch.databinding.FragmentRun2Binding


// RunFragment2.kt
class RunFragment2 : Fragment() {
    private var _binding: FragmentRun2Binding? = null
    private val binding get() = _binding!!
    private val viewModel: RunViewModel by activityViewModels()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentRun2Binding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        setupObservers()
    }

    private fun setupObservers() {
        viewModel.totalDistance.observe(viewLifecycleOwner) { totalDistance ->
            Log.d("제발 거리좀 알려줘라", totalDistance.toString())
            binding.distanceText.text = viewModel.formatDistance(totalDistance)
        }

        viewModel.pace.observe(viewLifecycleOwner) { pace ->
            Log.d("제발 페이스좀 알려줘라", pace.toString())
            binding.paceText.text = pace
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}