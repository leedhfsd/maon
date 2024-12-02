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
export const Wrapper = styled.TouchableOpacity`
  flex: 1;
  width: 100%;
  flex-direction: row;
  margin-bottom: 27px;
`;
export const Col = styled.View`
  flex: 1;
`;
export const Row = styled.View`
  flex-direction: row;
  width: 100%;
  margin-bottom: 9px;
  align-items: center;
`;
export const styles = StyleSheet.create({
  secondCol: { marginLeft: 12.5, flex: 1 },
  SmallText: { fontFamily: fonts.gMarketMedium, fontSize: 14, marginLeft: 5 },
  LargeText: {
    fontFamily: fonts.gMarketBold,
    fontSize: 18,
  },
});
