import styled from "styled-components";
import { SafeAreaView, View, Text } from "react-native";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;


export const Wrapper = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.white};
`

export const Container = styled.View`
padding: 0 ${screenWidth*0.07}px;
padding-top: ${screenHeight*0.05}px;
`

export const TitleArea = styled.View`
  padding: 22px 0;
`

export const TitleText = styled.Text`
  font-family: ${fonts.gMarketMedium};
  font-size: 17px;
`

export const ContentArea = styled.View`
  gap: 10px;
`


export const BtnArea = styled.View`
  margin-top: 2%;
`