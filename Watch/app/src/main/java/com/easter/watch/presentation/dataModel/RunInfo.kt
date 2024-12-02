package com.easter.watch.presentation.dataModel

data class RunInfo (
    val memberId : String,
    val recordId : String,
    val latitude: Double, //경도
    val longitude : Double, //위도
    val heartRate : Int, //심박수
    val pace : String, //페이스
    val time : String, // 해당 위치에서 경과 시간
    val runningDistance : String, // 뛴거리
)