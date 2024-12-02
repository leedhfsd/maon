import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Dimensions,
  Image,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faLink, faPersonRunning } from "@fortawesome/free-solid-svg-icons";
import { faRoute } from "@fortawesome/pro-duotone-svg-icons";

import { ButtonContainer, ButtonText, GradientBtn } from "./GradientBtnStyle";

const screenWidth = Dimensions.get("window").width;
// 그라데이션 스타일별 색상 배열
const gradients = {
  orange_gradient: ["rgba(255, 116, 14, 0.88)", "rgba(255, 166, 70, 0.88)"],
  grape_fruit_gradient: ["#FE7A58", "#FA9987"],
  mandarin_gradient: ["#FFB727", "#FDD048"],
  balck_gradient: ["#5E584F", "#5E584F"],
};

// 방향별 시작과 끝 좌표 설정
const directions = {
  topToBottom: { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
  leftToRight: { start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },
  diagonalTopLeftToBottomRight: { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  diagonalTopRightToBottomLeft: { start: { x: 1, y: 0 }, end: { x: 0, y: 1 } },
};

const fontStyle = {
  alone: { fontSize: 40, lineHeight: 50 },
  together: { fontSize: 32, lineHeight: 42 },
  watch: { fontSize: 20, lineHeight: 30 },
  selectedRoute: { fontSize: 40, lineHeight: 50 },
  notSelectedRoute: { fontSize: 40, lineHeight: 50 },
  ghost: { fontSize: 40, lineHeight: 50 },
};
const GradientButton = ({
  onPress,
  title,
  gradientType,
  direction = "topToBottom",
  mode,
}) => {
  const { start, end } = directions[direction];

  return (
    <ButtonContainer mode={mode} onPress={onPress}>
      <GradientBtn
        mode={mode}
        colors={gradients[gradientType] || gradients.orange_gradient}
        start={start}
        end={end}
      >
        <ButtonText mode={mode} style={[fontStyle[mode]]}>
          {title}
        </ButtonText>
        {mode == "alone" ? (
          <View
            style={{
              flex: 1,
              alignItems: "flex-end",
              justifyContent: "flex-end",
            }}
          >
            <FontAwesomeIcon
              size={screenWidth * 0.2} // 화면 너비의 10% 크기 설정
              style={{ color: "white" }}
              icon={faPersonRunning}
            />
          </View>
        ) : null}
        {mode == "watch" ? (
          <View
            style={{
              fontSize: 14,
              flex: 1,
              justifyContent: "flex-end",
            }}
          >
            <FontAwesomeIcon
              icon={faLink}
              size={screenWidth * 0.14}
              style={{ color: "white" }}
            />
          </View>
        ) : null}
        {mode == "selectedRoute" ? (
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          >
            <FontAwesomeIcon
              icon={faRoute}
              size={screenWidth * 0.14}
              color="#FFF"
            />
          </View>
        ) : null}
        {mode == "ghost" ? (
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          >
            <Image
              style={[
                { width: screenWidth * 0.25, height: screenWidth * 0.25 },
              ]} // 너비와 높이를 화면 너비의 25%로 설정
              source={require("../../../assets/images/ghost.png")} // 로컬 이미지 경로
            />
          </View>
        ) : null}
      </GradientBtn>
    </ButtonContainer>
  );
};
export default GradientButton;
