import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import PieChart from "react-native-pie-chart";
import fonts from "../../styles/fonts";
import color from "../../styles/colors";

const ResultDonutChart = ({ routeDistance, distance }) => {
  const chartSize = 184;
  const progress = (distance / routeDistance) * 100; // 목표 대비 현재 진행률 계산
  const series = [progress, 100 - progress]; // 채운 비율과 남은 비율
  const sliceColor = [color.light_orange, "#D9D9D9"]; // 채워진 부분과 남은 부분 색상

  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <PieChart
        widthAndHeight={chartSize}
        series={series}
        sliceColor={sliceColor}
        coverRadius={0.9} // 도넛 형태 설정
        coverFill={"#FFF"}
      />
      <View style={{ position: "absolute", alignItems: "center" }}>
        <Text style={[styles.percent]}>{progress}%</Text>
        <View style={[styles.bar]}></View>
        <Text style={[styles.runningDistance]}>{distance}km</Text>
      </View>
      {/* 예제 버튼으로 거리 증가 */}
    </View>
  );
};

const styles = StyleSheet.create({
  percent: {
    fontSize: 40,
    fontFamily: fonts.gMarketBold,
    color: color.light_orange,
    transform: [{ skewX: "-20deg" }], // x축 기준으로 텍스트를 20도 기울임
  },
  bar: {
    marginVertical: 10,
    height: 1,
    backgroundColor: color.black,
    width: 125,
  },
  runningDistance: {
    fontSize: 18,
    fontFamily: fonts.gMarketBold,
  },
});
export default ResultDonutChart;
