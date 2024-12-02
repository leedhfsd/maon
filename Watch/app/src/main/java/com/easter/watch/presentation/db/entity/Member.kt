package com.easter.watch.presentation.db.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "member")
data class Member(
    @PrimaryKey val memberId: String,
    val memberNickname : String
)