package com.easter.watch.presentation.dataModel

import android.os.Parcelable
import androidx.versionedparcelable.VersionedParcelize
import kotlinx.android.parcel.Parcelize
import java.time.LocalDateTime

@Parcelize
data class RunResult(
    val record: RecordDto,
    val routeDistance: Double,
    val status: String
): Parcelable
