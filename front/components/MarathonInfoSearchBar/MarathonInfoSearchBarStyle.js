import {
  SafeAreaView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Platform,
} from "react-native";
import fonts from "../../styles/fonts";
import colors from "../../styles/colors";
import styled from "styled-components";
export const Wrapper = styled.View`
  padding: 26px 25px;
  background-color: white;
  border-radius: 21px;
`;
export const Top = styled.View``;
export const OptionTitle = styled.Text`
  font-size: 16px;
  font-family: ${fonts.gMarketBold};
`;
export const Middle = styled.View`
  padding: 10px 0px;
`;
export const Bottom = styled.View`
  flex-direction: row;
`;
export const SearchButton = styled.TouchableOpacity``;
export const SelectView = styled.View`
  flex-direction: row;
  width: 100%;
`;

export const styles = StyleSheet.create({
  shadow: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 15,
    },
    android: {
      elevation: 5,
    },
  }),
  slider: {
    width: "100%",
    height: 10, // 슬라이더 두께 조정
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // 버튼 간격을 자동으로 조정
    flexWrap: "wrap", // 줄바꿈 가능하도록 설정 (옵션)
  },
  input: {
    textAlign: "center",
    flex: 4,
    borderBottomWidth: 2, // 아래쪽 border 두께
    borderBottomColor: colors.light_orange, // 아래쪽 border 색상
  },
  gradient: {
    marginLeft: 19,
    flex: 1,
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
  },
  boldText: {
    fontFamily: fonts.gMarketBold,
  },
  radioBoxText: {
    fontFamily: fonts.gMarketMedium,
    color: "#A1A1A1",
    fontSize: 12,
  },
  pickerContainer: {
    flex: 1,
    alignItems: "center", // 수평 가운데 정렬
    justifyContent: "center", // 수직 가운데 정렬
    borderBottomWidth: 2, // 아래쪽 border 두께
    borderBottomColor: colors.light_orange, // 아래쪽 border 색상
  },
});
export const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 12,
    paddingVertical: 12,
    color: "#A1A1A1",
    paddingRight: 30, // 아이콘 표시할 공간 확보
    textAlign: "center",
    width: "100%", // iOS에서 중앙 정렬 강제
    zIndex: 10, // iOS에서 터치 우선순위를 높이기 위해 추가
  },
  inputAndroid: {
    fontSize: 12,
    paddingVertical: 12,
    paddingHorizontal: 30,
    color: "#A1A1A1",
    paddingRight: 30, // 아이콘 표시할 공간 확보
    textAlign: "center",
    width: "100%", // iOS에서 중앙 정렬 강제
  },
});
