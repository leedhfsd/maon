package com.easter.watch.presentation.dataModel

import com.easter.watch.presentation.dataModel.Enum.Connect
import com.google.gson.annotations.SerializedName
import java.time.LocalDateTime

data class AuthInfo(
    val type: Connect,
    val memberId: String?,  // null 가능하도록 수정
    val memberNickname: String?,  // null 가능하도록 수정
)
