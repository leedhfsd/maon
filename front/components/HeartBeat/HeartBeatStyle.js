import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import fonts from "../../styles/fonts";

const HeartBeat = ({ mode }) => {
  return (
    <View>
      <Text style={{ fontSize: 32, fontFamily: fonts.gMarketBold }}></Text>
      <Text style={{ fontSize: 20, fontFamily: fonts.gMarketBold }}></Text>
    </View>
  );
};

export default HeartBeat;
