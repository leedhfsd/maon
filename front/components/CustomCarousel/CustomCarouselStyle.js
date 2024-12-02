import styled from "styled-components/native";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from "react-native";
export const Wrapper = styled.TouchableOpacity`
  padding: 20px 20px;
  flex: 1;
  width: 90%;
  margin: 10px 5%;
  /* border-radius: 20px; */
  /* background-color: #f0f0f0; */
`;

export const Col = styled.View`
  flex: 1;
  width: 100%;
`;
export const Row = styled.View`
  flex-direction: row;
  margin-bottom: 10;
  align-items: flex-end;
  width: 100%;
`;

export const RunBtn = styled.TouchableOpacity`
  background-color: ${colors.grape_fruit};
  padding: 10px 30px;
  border-radius: 30px;
`;

export const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.gMarketBold,
    fontSize: 20,
    marginBottom: 12,
  },
  subText: {
    fontFamily: fonts.gMarketMedium,
    fontSize: 16,
    marginLeft: 10,
  },
  wrapper: {
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: "#fff", // 그림자를 보기 위한 배경색
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4.65,
    elevation: 5, // Android 전용 그림자
  },
});
