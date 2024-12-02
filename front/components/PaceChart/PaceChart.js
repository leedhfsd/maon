import React, { useState } from "react";
import { View, Dimensions } from "react-native";
import Svg, {
  Path,
  Text as SvgText,
  G,
  Circle,
  Rect,
  Defs,
  LinearGradient,
  Stop,
  Line,
} from "react-native-svg";
import * as d3 from "d3-shape";

const PaceChart = ({ xData = [], yData = [], yLabel }) => {
  const screenWidth = Dimensions.get("window").width - 60;
  const chartWidth = screenWidth - 70;
  const [chartHeight, setChartHeight] = useState(200);
  const [selectedIndex, setSelectedIndex] = useState(null); // 선택한 점의 인덱스 저장
  const maxDataValue = Math.max(...yData);
  const minDataValue = Math.min(...yData);
  // 페이스 값을 분과 초로 포맷팅
  const formatPace = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}'${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}"`;
  };

  // 곡선을 만드는 함수
  const lineGenerator = d3
    .line()
    .x((_, i) => (i / (yData.length - 1)) * chartWidth + 20)
    .y(
      (y) =>
        chartHeight -
        ((y - minDataValue) / (maxDataValue - minDataValue)) * chartHeight +
        20
    )
    .curve(d3.curveCatmullRom);

  const linePath = lineGenerator(yData);

  const handleLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setChartHeight(height - 50);
  };

  return (
    <View style={{ flex: 1 }} onLayout={handleLayout}>
      <Svg height={chartHeight + 60} width={screenWidth}>
        <Defs>
          <LinearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#ff9a00" stopOpacity="1" />
            <Stop offset="100%" stopColor="#ff6100" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#gradient)" rx="10" />

        {/* x축 레이블 */}
        <G>
          {xData.map((label, index) => {
            const x = (index / (xData.length - 1)) * chartWidth + 20;
            // 정수이거나 마지막 인덱스일 때만 레이블 표시
            return Number.isInteger(label) || index === xData.length - 1 ? (
              <SvgText
                key={`x-label-${index}`}
                x={x}
                y={chartHeight + 40}
                fontSize="12"
                fill="white"
                alignmentBaseline="middle"
                textAnchor="middle"
              >
                {label.toFixed(2)} km
              </SvgText>
            ) : null;
          })}
        </G>

        {/* x축 선 */}
        <Line
          x1="20"
          y1={chartHeight + 20}
          x2={screenWidth - 20}
          y2={chartHeight + 20}
          stroke="white"
          strokeWidth="2"
        />

        {/* y축 선 */}

        {/* 곡선 라인 */}
        <Path d={linePath} fill="none" stroke="white" strokeWidth="3" />

        {/* 데이터 포인트 및 클릭 시 표시되는 레이블 */}
        <G>
          {yData.map((y, index) => {
            const x = (index / (yData.length - 1)) * chartWidth + 20;
            const yPos =
              chartHeight -
              ((y - minDataValue) / (maxDataValue - minDataValue)) *
                chartHeight +
              20;

            return (
              <G key={`data-point-group-${index}`}>
                <Circle
                  cx={x}
                  cy={yPos}
                  r="5"
                  fill="white"
                  stroke="orange"
                  strokeWidth="2"
                  onPress={() => setSelectedIndex(index)} // 클릭 시 인덱스 저장
                />
                {/* 선택된 점의 위에 거리 및 페이스 정보 표시 */}
                {selectedIndex === index && (
                  <G>
                    <SvgText
                      x={x}
                      y={yPos - 20} // 위로 위치를 조정
                      fontSize="12"
                      fill="black"
                      alignmentBaseline="middle"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      {`거리: ${xData[index].toFixed(2)} km`}
                    </SvgText>
                    <SvgText
                      x={x}
                      y={yPos - 10} // 위로 위치를 조정
                      fontSize="12"
                      fill="black"
                      alignmentBaseline="middle"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      {`페이스: ${formatPace(y)}`}
                    </SvgText>
                  </G>
                )}
              </G>
            );
          })}
        </G>
      </Svg>
    </View>
  );
};

export default PaceChart;

// console.log("YLabel: " + yLabel);
// const sortedYLabel = [yLabel[0]]; // 첫 번째 값 고정
// const sortedYData = [...yData].sort((a, b) => a - b); // yData 정렬
// const largeYData = sortedYData[sortedYData.length - 1]; // 가장 큰 값
// const step = Math.floor((sortedYData.length - 1) / 3); // 나머지 3개의 구간 설정

// // 정렬된 yData에서 일정 간격으로 yLabel 추가
// for (let i = step; i < sortedYData.length - 1; i += step) {
//   const originalIndex = yData.indexOf(sortedYData[i]);
//   sortedYLabel.push(yLabel[originalIndex]);
// }
// sortedYLabel.push(formatPace(largeYData)); // 마지막 값 고정

// console.log("sortedYLabel:", sortedYLabel); // 확인용 로그
