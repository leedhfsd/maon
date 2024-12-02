import styled from "styled-components/native";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
export const Wrapper = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.white};
`;

export const ButtonList = styled.View`
  flex: 1;
  padding: 5% 5% 10% 5%;
`;
export const AloneRunBtn = styled(TouchableOpacity)`
  flex: 1;
  background: ${colors.orange_gradient};
`;
export const TogetherRunBtn = styled(TouchableOpacity)`
  flex: 1;
  background: ${colors.grape_fruit_gradient};
`;
export const FriendList = styled(TouchableOpacity)`
  flex: 1;
  background: ${colors.black};
`;
export const MaraThonInfoArea = styled.View`
  flex: 1;
`;

export const CarouselView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
