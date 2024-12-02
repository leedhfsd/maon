import styled from "styled-components/native";
import colors from "../../../styles/colors";
import fonts from "../../../styles/fonts";
import { Text, TouchableOpacity, SafeAreaView } from "react-native";

export const ModalContainer = styled.SafeAreaView`
  flex: 1;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  justify-content: center;
  align-items: center;
  background-color: ${colors.modal_background};
  position: absolute;
  z-index: 20;
`;
export const ModalContent = styled.View`
  background-color: ${colors.white};
  width: 70%;
  align-items: center;
  flex-direction: row;
  border-radius: 21px;
  height: 25%;
  padding: 10% 0%;
`;
export const ModalText = styled(Text)`
  color: ${colors.black};
  font-size: 20px;
  line-height: 30px;
  font-family: ${fonts.gMarketMedium};
  text-align: center;
  justify-content: center;
  margin-bottom: ${({ subText }) => {
    return subText ? "3%" : "8%";
  }};
`;

export const ModalSubText = styled(Text)`
  font-size: 15px;
  font-family: ${fonts.gMarketMedium};
  margin-bottom: 10%;
  color: #b1b1b1;
  display: ${({ subText }) => {
    return subText ? "flex" : "none";
  }};
`;

export const ButtonView = styled.View`
  flex-direction: row;
  justify-content: center;
`;
export const ModalButton = styled.TouchableOpacity`
  width: 35%;
  background-color: ${({ index }) =>
    index === 0 ? `${colors.light_begie}` : `${colors.dark_mandarind}`};
  border-radius: 28px;
  justify-content: center;
  align-items: center;
  margin-left: ${({ index }) => (index === 1 ? `5%` : `0px`)};
`;
export const ButtonText = styled(Text)`
  color: ${({ index }) =>
    index === 0 ? `${colors.black}` : `${colors.white}`};
  font-size: 16px;
  padding: 15px 20px;
  font-family: ${fonts.gMarketMedium};
`;
