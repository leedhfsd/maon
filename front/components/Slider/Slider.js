import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import Slider from "@react-native-community/slider";

const CustomSlider = () => {
  const [value, setValue] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.valueText}>{value}</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={100}
        step={1}
        value={value}
        onValueChange={(newValue) => setValue(newValue)}
        minimumTrackTintColor="#FF6347" // 선택된 트랙 색상
        maximumTrackTintColor="#E0E0E0" // 선택되지 않은 트랙 색상
        thumbTintColor="transparent" // thumb 색상 투명으로 설정
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  slider: {
    width: 300,
    height: 8, // 슬라이더 두께 조정
  },
  valueText: {
    fontSize: 20,
    marginBottom: 10,
  },
});

export default CustomSlider;
