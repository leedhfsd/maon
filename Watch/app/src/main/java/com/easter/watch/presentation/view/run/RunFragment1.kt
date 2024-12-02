package com.easter.watch.presentation.view.run

import android.content.Intent
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.animation.AnimationUtils
import android.widget.Toast
import androidx.core.view.isGone
import androidx.core.view.isInvisible
import androidx.fragment.app.activityViewModels
import com.easter.watch.R
import com.easter.watch.databinding.ActivityAuthBinding
import com.easter.watch.databinding.FragmentRun1Binding
import com.easter.watch.databinding.FragmentRun2Binding
import com.easter.watch.presentation.service.RunService

class RunFragment1 : Fragment() {
    private var _binding: FragmentRun1Binding? = null
    private val binding get() = _binding!!
    private val viewModel: RunViewModel by activityViewModels()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentRun1Binding.inflate(inflater, container, false)
        return binding.root
    }


    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.pauseBtn.isGone = false
        binding.stopBtn.isGone = false

        setupButtons()
        setButtons()
        setupObservers()
    }

    private fun setButtons() {

        binding.stopBtn.setOnClickListener {
            val activity = requireActivity() as RunActivity
            val recordId = activity.recordId

            viewModel.stopTimer()
            viewModel.stopTracking()
            viewModel.subscribeToRunningEndTopic(recordId,requireContext())
            viewModel.stopRunning(recordId)
            val intent = Intent(requireContext(), ResultActivity::class.java)
            startActivity(intent)
        }

        binding.pauseBtn.setOnClickListener {
            viewModel.pauseTimer()
            viewModel.stopTracking()
            binding.playBtn.isGone = false
            binding.pauseBtn.isGone = true
        }

        binding.playBtn.setOnClickListener {
            viewModel.startTimer()
            viewModel.startTracking()
            binding.playBtn.isGone = true
            binding.pauseBtn.isGone = false
        }
    }

    private fun setupButtons() {
        binding.stopBtn.setOnClickListener {
            requireContext().startService(Intent(requireContext(), RunService::class.java).apply {
                action = RunService.ACTION_STOP
            })
            val intent = Intent(requireContext(), ResultActivity::class.java)
            startActivity(intent)
        }

        binding.pauseBtn.setOnClickListener {
            requireContext().startService(Intent(requireContext(), RunService::class.java).apply {
                action = RunService.ACTION_PAUSE
            })
        }

        binding.playBtn.setOnClickListener {
            requireContext().startService(Intent(requireContext(), RunService::class.java).apply {
                action = RunService.ACTION_START
            })
        }
    }

    private fun setupObservers() {
        viewModel.isRunning.observe(viewLifecycleOwner) { isRunning ->
            binding.playBtn.isGone = isRunning
            binding.pauseBtn.isGone = !isRunning
        }
    }
}