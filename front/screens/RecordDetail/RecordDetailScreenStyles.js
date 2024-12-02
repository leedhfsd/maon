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
import color from "../../styles/colors";
export const Wrapper = styled.View`
  flex: 1;
  padding: 0px 30px;
`;

export const Col = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  margin: 33px 0px;
`;
export const AddRouteBtn = styled.TouchableOpacity``;

export const ViewTypeChangeBtn = styled.TouchableOpacity``;

export const styles = StyleSheet.create({
  boldFont: {
    fontFamily: fonts.gMarketBold,
    fontSize: 17,
  },
  routeAddView: {
    paddingVertical: 20,
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  infoList: {
    flexDirection: "row",
  },
  infoTitle: {
    marginVertical: 10,
  },
  bar: {
    width: 2,
    height: 17,
    backgroundColor: color.black,
    marginHorizontal: 10,
  },
  tab: {
    flexDirection: "row",
    marginBottom: 20,
  },
});
