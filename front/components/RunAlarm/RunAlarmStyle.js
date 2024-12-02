import styled from "styled-components/native";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import { Text, TouchableOpacity, SafeAreaView } from "react-native";
export const ModalContainer = styled.SafeAreaView`
  flex: 1;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  align-items: center;
  position: absolute;
  z-index: 20;
`;
export const ModalContent = styled.View`
  background-color: ${colors.white};
  width: 90%;
  align-items: center;
  flex-direction: row;
  border-radius: 21px;
  height: 15%;
  padding: 3% 10%;
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
