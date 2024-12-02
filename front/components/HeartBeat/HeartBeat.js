import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import fonts from "../../styles/fonts";
import color from "../../styles/colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const Pace = ({ currentDistance, elapsedTime, setPace, mode, heartRate }) => {
  return (
    <View style={{ marginTop: 10, flexDirection: "row", alignItems: "center" }}>
      <FontAwesomeIcon icon={faHeart} color={color.light_orange} size={25} />
      <Text style={{ flexDirection: "row", fontSize: 20, marginLeft: 10 }}>
        {heartRate}
      </Text>
    </View>
  );
};

export default Pace;
