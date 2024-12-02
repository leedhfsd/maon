import React from "react";
import { StyleSheet, Text } from "react-native";
import { ModalContainer, ModalContent } from "./RunAlarmStyle";
import fonts from "../../styles/fonts";

const RunAlarm = ({ ment, isVisible }) => {
  if (!isVisible) return null;

  const highlightWords = ["시작점", "경로", "이탈"];

  // 강조 단어 스타일링 처리
  const renderHighlightedText = (text, words) => {
    const parts = text.split(" ");
    return parts.map((part, index) => {
      const isHighlighted = words.some((word) => part.includes(word));
      return (
        <Text
          key={index}
          style={isHighlighted ? styles.highlight : styles.normal}>
          {part}{" "}
        </Text>
      );
    });
  };

  return (
    <ModalContainer style={styles.container}>
      <ModalContent style={styles.textBox}>
        <Text style={styles.text}>
          {renderHighlightedText(ment, highlightWords)}
        </Text>
      </ModalContent>
    </ModalContainer>
  );
};

const styles = StyleSheet.create({
  textBox: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: fonts.gMarketBold,
    fontSize: 20,
  },
  normal: {
    color: "black",
  },
  highlight: {
    color: "red",
    fontWeight: "bold",
  },
});

export default RunAlarm;
