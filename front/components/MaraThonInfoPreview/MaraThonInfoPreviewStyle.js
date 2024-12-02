import {
  SafeAreaView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from "react-native";
import fonts from "../../styles/fonts";
import colors from "../../styles/colors";
import styled from "styled-components";

export const status = StyleSheet.create({
  status: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    top: 15,
    left: 9,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  end: { fontSize: 14, fontFamily: fonts.gMarketBold, color: "#2635BA" },
  ing: { fontSize: 14, fontFamily: fonts.gMarketBold, color: "#F00" },
});
