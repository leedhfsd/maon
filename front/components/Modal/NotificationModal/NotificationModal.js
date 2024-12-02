import React from "react";
import { SafeAreaView, View, Text, Button } from "react-native";
import {
  ModalContainer,
  ModalContent,
  ModalTextArea,
  ModalText,
  ModalButton,
  ButtonText,
  ButtonView,
  ModalSubText,
} from "./NotificationModalStyles";
import { useFontsLoaded } from "../../../utils/fontContext";
const NotificationModal = ({ isVisible, content }) => {
  if (!isVisible) return null;
  const fontsLoaded = useFontsLoaded();

  if (!fontsLoaded) {
    return null; // 폰트 로드 전까지 렌더링 방지
  }
  return (
    <ModalContainer>
      <ModalContent>
        <View style={{flex: 1}}>
          <ModalTextArea>
          <ModalText subText={content.subText.length > 1}>
            {content.text}
          </ModalText>
          <ModalSubText subText={content.subText.length > 1}>
            {content.subText}
          </ModalSubText>
          </ModalTextArea>
          <ButtonView>
            {content.buttons.map((button, index) => (
              <ModalButton
                title=""
                key={index}
                index={index}
                onPress={button.onPress}
              >
                <ButtonText index={index}>{button.title}</ButtonText>
              </ModalButton>
            ))}
          </ButtonView>
        </View>
      </ModalContent>
    </ModalContainer>
  );
};

export default NotificationModal;
