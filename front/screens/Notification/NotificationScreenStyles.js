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
`;

export const Container = styled.View`
  padding-top: ${screenHeight * 0.05}px;
  padding-horizontal: ${screenWidth * 0.05}px;
`;

export const Title = styled.View`
  flex-direction: row;
  justify-content: flex-end;
`;

export const Line = styled.View`
  border: 1px solid ${colors.grape_fruit};
`;

export const TitleText = styled.Text`
  color: ${colors.grape_fruit};
  font-size: 20px;
  font-family: ${fonts.gMarketMedium};
  padding-bottom: ${screenHeight * 0.015}px;
`;

export const RequestBox = styled.View`
  border-bottom-width: 2px;
  border-bottom-color: #e5e5e5;
  flex-direction: row;
  gap: 10px;
  padding: 10px 15px;  
`

export const UserImgView = styled.View`
  flex: 1.2;
  aspect-ratio: 1;
  border-radius: 17px;
  overflow: hidden;
`;

export const RequestContent = styled.View`
  flex: 5;
`;

export const RequestTextArea = styled.View`
  gap: 5px;
`;

export const RequestText = styled.Text`
  font-family: ${fonts.gMarketLight};
`;

export const BoldText = styled.Text`
  font-family: ${fonts.gMarketMedium};
`;

export const RequestBtnArea = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 15px;
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
