import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import fonts from "../../../styles/fonts";
import colors from "../../../styles/colors";
import styled from "styled-components";
export const ButtonContainer = styled(TouchableOpacity)`
  width: ${({ mode }) =>
    mode == "ghost" || mode === "selectedRoute" || mode === "notSelectedRoute"
      ? "85%"
      : "100%"};
  flex: ${({ mode }) => (mode == "together" ? 1.5 : 1)};
`;
export const GradientBtn = styled(LinearGradient)`
  flex: 1;
  padding: 15px;
  border-radius: 14px;
  margin-bottom: ${({ mode }) =>
    mode == "together"
      ? "15px"
      : mode === "selectedRoute" || mode === "notSelectedRoute"
      ? "20px"
      : "0px"};
  flex-direction: ${({ mode }) =>
    mode === "selectedRoute" || mode === "notSelectedRoute" || mode === "ghost"
      ? "row"
      : "column"};
  justify-content: ${({ mode }) =>
    mode == "notSelectedRoute" ? "flex-end" : ""};
`;
export const ButtonText = styled.Text`
  font-family: ${fonts.gMarketBold};
  color: ${colors.white};
  text-align: ${({ mode }) =>
    mode == "together" || mode == "notSelectedRoute" ? "right" : "start"};
`;
