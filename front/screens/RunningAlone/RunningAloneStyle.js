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
export const Wrapper = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.light_begie};
`;

export const StopBtn = styled.TouchableOpacity`
  width: 43px;
  height: 43px;
  background-color: ${colors.light_orange};
  border-radius: 9999px;
  justify-content: center;
  align-items: center;
`;

export const Top = styled.View`
  position: absolute;
  z-index: 20;
  top: 7%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;
export const Bottom = styled.View`
  position: absolute;
  z-index: 20;
  bottom: 5%;
  width: 100%;
  justify-content: center;
  align-items: center;
  height: 125px;
`;
export const RunInfo = styled.View`
  flex-direction: row;
  height: 100%;
  width: 90%;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.9);
  align-items: center;
  padding: 0px 20px;
`;
export const RunInfoCol = styled.View``;
