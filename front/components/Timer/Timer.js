import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import fonts from "../../styles/fonts";

const Timer = ({
  showStopModal,
  runStart,
  elapsedTime,
  setElapsedTime,
  connectedWatch,
}) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval;

    // 타이머 시작 조건: runStart가 true이고 showStopModal이 false일 때만 타이머 동작
    if (runStart && !showStopModal & !connectedWatch) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    // runStart 또는 showStopModal이 변경될 때 interval을 정리
    return () => clearInterval(interval);
  }, [runStart, showStopModal]);

  // 초 단위 타이머 업데이트를 setElapsedTime로 전달
  useEffect(() => {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");

    // 타이머 포맷을 업데이트
    setElapsedTime(`${hours}:${minutes}:${secs}`);
  }, [seconds]); // seconds 변경 시마다 호출

  return (
    <View style={{ marginTop: 10 }}>
      <Text style={{ fontSize: 48, fontFamily: fonts.gMarketBold }}>
        {elapsedTime}
      </Text>
    </View>
  );
};

export default Timer;
