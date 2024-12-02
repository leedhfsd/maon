package com.easter.route.global.utils;

import java.time.Duration;
import java.util.List;

public class PaceCalculator {

    public static String calculateAveragePace(List<String> paces) {
        Duration totalDuration = Duration.ZERO;

        // 각 페이스를 분과 초로 변환하여 전체 시간을 계산
        for (String pace : paces) {
            String[] parts = pace.split("'|\""); // '와 " 기준으로 분리
            int minutes = Integer.parseInt(parts[0]);
            int seconds = Integer.parseInt(parts[1]);

            // 분과 초를 합산하여 Duration으로 변환 후 누적
            totalDuration = totalDuration.plusMinutes(minutes).plusSeconds(seconds);
        }

        // 총 시간에서 평균 페이스 시간 계산
        long averageSeconds = totalDuration.getSeconds() / paces.size();
        long averageMinutes = averageSeconds / 60;
        long remainingSeconds = averageSeconds % 60;

        // 00'00" 형식으로 반환
        return String.format("%02d'%02d\"", averageMinutes, remainingSeconds);
    }
}