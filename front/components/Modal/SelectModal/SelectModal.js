import React, { useEffect, useReducer } from "react";
import RNPickerSelect from "react-native-picker-select";
import { ModalText, pickerSelectStyles } from "./SelectModalStyles";
import {
  ModalContainer,
  ModalContent,
  ModalButton,
  ButtonText,
  ButtonView,
} from "../DefaultModal/DefaultModalStyles";
import { useFontsLoaded } from "../../../utils/fontContext";
import { TouchableOpacity } from "react-native";
const SelectModal = ({ isVisible, content, setRunType }) => {
  useEffect(() => {
    // console.log("모달쪽 콘솔_content: ", content, "setRunType: ", setRunType);
  }, []);

  if (!isVisible) return null;
  const fontsLoaded = useFontsLoaded();

  if (!fontsLoaded) {
    return null; // 폰트 로드 전까지 렌더링 방지
  }
  return (
    <ModalContainer>
      <ModalContent>
        <ModalText>{content.text}</ModalText>

        {/* 셀렉트 넣기 */}
        <RNPickerSelect
          onValueChange={(value) => setRunType(value)}
          items={content.item}
          placeholder={{ label: "종목을 선택해주세요", value: null }}
          style={pickerSelectStyles} // 스타일 객체 전달
        ></RNPickerSelect>
        <ButtonView>
          {content.buttons.map((button, index) => (
            <ModalButton
              title=""
              key={index}
              index={index}
              onPress={button.onPress}>
              <ButtonText index={index}>{button.title}</ButtonText>
            </ModalButton>
          ))}
        </ButtonView>
      </ModalContent>
    </ModalContainer>
  );
};

export default SelectModal;
