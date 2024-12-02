import {
  SafeAreaView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import fonts from "../../styles/fonts";
import colors from "../../styles/colors";
import styled from "styled-components";
export const Wrapper = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.light_begie};
`;
export const ButtonList = styled.View`
  width: 100%;
  flex: 1;
  padding: 10% 0%;
  justify-content: center;
  align-items: center;
`;
