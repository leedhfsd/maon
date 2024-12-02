import styled from "styled-components";
import { SafeAreaView, View, Text } from "react-native";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;


export const Wrapper = styled.View`
  flex: 1;
  background-color: ${colors.white};
      padding: 5% 5% 0px 5%;

`

export const Bottom = styled.View`
  margin-top: 27px;
  flex: 1;
`;

export const List = styled.View`
  flex: 1;
`;

export const EmptyRequest = styled.View`
  align-items: center;
  justify-content: center;
  height: ${screenHeight * 0.75}px;
`;

export const EmptyRequestText = styled.Text`
  font-family: ${fonts.gMarketLight};
  font-size: 19px;
`;
