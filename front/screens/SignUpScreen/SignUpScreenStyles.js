import styled from "styled-components";
import { ScrollView, View, Text, SafeAreaView } from "react-native";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export const Wrapper = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.white};
  `

export const Content = styled.View`
  padding: 5% 10% 5%;
`

export const Title = styled.View`
  padding: 5% 0;
`

export const TitleContent = styled.Text`
  font-size: 20px;
  padding-vertical: 3px;
  font-family: ${fonts.gMarketLight};
`

export const Main = styled.View`
  gap: 30px;
  margin: 9% 0;
  align-items: center;
`

export const ProfileChangeIcon = styled.View`
  align-items: center;
  margin-top: 30%;
  margin-bottom: 30px;
`

export const ProfileView = styled.View`
  width: 60%;
  aspect-ratio: 1;
  border: 3px solid ${colors.grape_fruit};
  border-radius: 35px;
  overflow: hidden;
`

export const PlusIcon = styled.View`
  position: absolute;
  top: -20px;
  right: 20%;
`

export const UserInfo = styled.View`
  gap: 10px;
`

export const UserBodyInfo = styled.View`
  width: 50%;
  ${({ isRightAligned }) => (isRightAligned ? 'margin-left: auto;' : 'margin-right: auto;')}
`

export const BoldText = styled.Text`
  font-size: 20px;
  color: ${colors.light_orange};
  font-family: ${fonts.gMarketMedium};
`
export const BtnArea = styled.View`
  margin-top: 10%;
`