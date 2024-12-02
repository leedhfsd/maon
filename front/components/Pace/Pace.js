import React, { useEffect } from "react";
import { View, Text } from "react-native";
import fonts from "../../styles/fonts";

const Pace = ({
  currentDistance,
  elapsedTime,
  setPace,
  mode,
  pace,
  connectedWatch,
}) => {
  useEffect(() => {
    // 시간 문자열을 초 단위로 변환하는 함수
    const timeStringToSeconds = (timeString) => {
      const [hours, minutes, seconds] = timeString.split(":").map(Number);
      return hours * 3600 + minutes * 60 + seconds;
    };

    // 거리와 시간으로 페이스 계산
    const calculatePace = () => {
      const timeInSeconds = timeStringToSeconds(elapsedTime);
      if (currentDistance.current > 0) {
        const timeInMinutes = timeInSeconds / 60;
        const paceInMinutes = timeInMinutes / currentDistance.current;

        // 분과 초로 변환
        const minutes = Math.floor(paceInMinutes);
        const seconds = Math.round((paceInMinutes - minutes) * 60);
        const formattedPace = `${String(minutes).padStart(2, "0")}'${String(
          seconds
        ).padStart(2, "0")}''`;

        setPace(formattedPace);
      } else {
        setPace("00'00''"); // 초기 값 또는 거리가 0일 때
      }
    };
    if (!connectedWatch) {
      calculatePace();
    }
  }, [currentDistance.current, elapsedTime]);
  useEffect(() => {
    // console.log(currentDistance.current, "  =  ", elapsedTime);
  });

  return (
    <View>
      {mode === "notSelectedRoute" && (
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontSize: 32, fontFamily: fonts.gMarketBold }}>
            {pace}
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontFamily: fonts.gMarketBold,
              paddingTop: 12,
            }}>
            /km
          </Text>
        </View>
      )}
      {mode !== "notSelectedRoute" && (
        <Text style={{ fontSize: 20, fontFamily: fonts.gMarketBold }}>
          {pace}
        </Text>
      )}
    </View>
  );
};

export default Pace;
