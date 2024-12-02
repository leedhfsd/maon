import React from "react";
import { SafeAreaView, View, Text, Button, TextInput } from "react-native";
import {
  ModalContainer,
  ModalText,
  ModalButton,
  ButtonText,
  ButtonView,
  ModalSubText,
} from "../DefaultModal/DefaultModalStyles";

import { ModalContent } from "./InputModalStyle";
import { useFontsLoaded } from "../../../utils/fontContext";
const InputModal = ({ isVisible, content, textValue, setTextValue }) => {
  if (!isVisible) return null;
  const fontsLoaded = useFontsLoaded();

  if (!fontsLoaded) {
    return null; // 폰트 로드 전까지 렌더링 방지
  }
  return (
    <ModalContainer>
      <ModalContent>
        <ModalText
          subText={content.subText.length > 1}
          style={{ marginBottom: 0 }}
        >
          {content.text}
        </ModalText>
        <TextInput
          style={{
            width: 200,
            height: 40,
            paddingLeft: 10,
            borderColor: "gray",
            borderWidth: 1,
            borderRadius: 10,
            marginVertical: 15,
          }}
          placeholder="경로 이름을 입력해주세요"
          value={textValue}
          onChangeText={(text) => setTextValue(text)}
        />
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
      </ModalContent>
    </ModalContainer>
  );
};

export default InputModal;
