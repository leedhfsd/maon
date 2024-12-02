import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  Button,
  TouchableOpacity,
} from "react-native";
import { useFontsLoaded } from "../../utils/fontContext";
import { ButtonList, Wrapper } from "./SelectRunTypeStyle";
import GradientButton from "../../components/Button/GradientsBtn/GradientsButton";
import {
  getPracticeRoomId,
  getPracticeRoomIdWithRoute,
} from "../../utils/getRoomId";
import useAuthStore from "../../store/AuthStore";
import { useEffect } from "react";

const SelectRunType = ({ navigation }) => {
  const fontsLoaded = useFontsLoaded();
  const { user } = useAuthStore();
  if (!fontsLoaded) {
    return null; // 폰트 로드 전까지 렌더링 방지
  }
  const buttons = [
    {
      onPress: () => {
        navigation.navigate("SelectRunRoute", {
          mode: "selectedRoute",
          searchType: "run",
        });
      },
      title: `지정코스로\n달리기`,
      gradientType: "orange_gradient",
      mode: "selectedRoute",
    },
    {
      onPress: async () => {
        navigation.navigate("RunningAlone", { mode: "notSelectedRoute" });
      },
      title: `지정코스없이\n달리기`,
      gradientType: "mandarin_gradient",
      mode: "notSelectedRoute",
    },
    {
      onPress: async () => {
        const roomId = await getPracticeRoomIdWithRoute();
        navigation.navigate("SelectRunRoute");
      },
      title: `고스트\n모드`,
      gradientType: "grape_fruit_gradient",
      mode: "ghost",
    },
  ];

  return (
    <Wrapper>
      <ButtonList>
        {buttons.map((button) => (
          <GradientButton
            key={button.text} // 각 컴포넌트에 고유한 key 추가
            onPress={button.onPress}
            title={button.title}
            gradientType={button.gradientType}
            mode={button.mode}
          />
        ))}
      </ButtonList>
    </Wrapper>
  );
};
export default SelectRunType;
