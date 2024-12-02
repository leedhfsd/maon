// LoginScreenStyles.js
import styled from 'styled-components/native';
import fonts from "../../styles/fonts";
import { Dimensions } from "react-native";
import colors from '../../styles/colors';

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export const Container = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const Wrap = styled.View`
  display: flex;
  z-index: 1000;
  gap: 50px;
`

export const Logo = styled.Text`
  font-family: ${fonts.gMarketBold};
  font-size: 75px;
  text-align: center;
  color: ${colors.nav_orange};
`;
