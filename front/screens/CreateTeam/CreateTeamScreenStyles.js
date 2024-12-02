import styled from "styled-components";
import { SafeAreaView, View, Text, Image } from "react-native";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import React from "react";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;


export const Wapper = styled.SafeAreaView`
  flex:1;
  background-color: ${colors.white};
`

export const Container = styled.View`
  flex:1;
  padding-top: ${screenHeight*0.05}px;
  padding-horizontal: ${screenWidth*0.07}px;
`
export const ListContainer = styled.View`
  flex:4;
`

export const TitleArea = styled.View`
  {/* padding-vertical: 22px; */}
  flex:1;
  justify-content: flex-end;
  padding-bottom: 10px;

  `

export const TitleText = styled.Text`
  font-family: ${fonts.gMarketMedium};
  font-size: 30px;
`

export const SearchBarArea = styled.View`
  flex:1;
`

export const ListView = styled.View`
  padding-top: 5px;
`

export const UserInfoBoxView = styled.View`
  padding-top: 25px;
`
