import styled from "styled-components";
import { SafeAreaView, View, Text } from "react-native";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import { Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export const Wrapper = styled.SafeAreaView`
  flex: 1;
`;
export const BackColor = styled(LinearGradient).attrs({
  colors: ["#5E4F56", "#ED28FF"],
  start: { x: 0.5, y: 0 },
  end: { x: 0.5, y: 1 },
})`
  flex: 1;
`;

export const WhitePathView = styled.View`
  position: absolute;
  bottom: 0;
  z-index: 100;
`;

export const MountainView = styled.View`
  position: absolute;
  bottom: 0;
`;

export const FooterArea = styled.View`
  z-index: 10000;
  position: absolute;
  bottom: 0;
  background-color: ${colors.white};
  height: 160px;
  width: ${screenWidth}px;
  /* border-top-left-radius: 33px;
  border-top-right-radius: 33px; */
  flex-direction: row;
  justify-content: space-between;
  padding-left: 10px;
  padding-bottom: 10px;
`;

export const ChallengeArea = styled.View`
  padding: 20px 10px;
  padding-right: 0;
  width: ${screenWidth * 0.6}px;
  gap: 10px;
`;

export const ChallengeLevelText = styled.Text`
  font-family: ${fonts.gMarketBold};
  font-size: 25px;
  color: ${colors.grape_fruit};
  text-align: center;
`;

export const ChallengeNextLevelText = styled.Text`
  font-family: ${fonts.gMarketMedium};
  font-size: 15px;
  color: ${colors.nav_orange};
`;

export const ChallengeText = styled.Text`
  font-family: ${fonts.gMarketMedium};
  font-size: 22px;
`;

export const FooterIconArea = styled.View`
  height: 100%;
  aspect-ratio: 1;
`;
