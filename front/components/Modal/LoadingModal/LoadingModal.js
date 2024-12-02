import React from "react";
import { SafeAreaView, View, Text, Button } from "react-native";
import {
  ModalContainer,
  ModalContent,
  ModalText,
  ModalButton,
  ButtonText,
  ButtonView,
  ModalSubText,
} from "../DefaultModal/DefaultModalStyles";
import { useFontsLoaded } from "../../../utils/fontContext";
const LoadingModal = ({ isVisible, content }) => {
  if (!isVisible) return null;
  const fontsLoaded = useFontsLoaded();

  if (!fontsLoaded) {
    return null; // 폰트 로드 전까지 렌더링 방지
  }
  return (
    <ModalContainer>
      <ModalContent>
        <View style={{ flex: 1 }}>
          <Text>위치정보를 가져오는 중입니다.</Text>
        </View>
      </ModalContent>
    </ModalContainer>
  );
};

export default LoadingModal;
