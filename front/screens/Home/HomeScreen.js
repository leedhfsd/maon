import { StyleSheet, View, Text, Dimensions, Image } from "react-native";
import { useFontsLoaded } from "../../utils/fontContext";
import {
  AloneRunBtn,
  ButtonList,
  CarouselView,
  FriendList,
  MaraThonInfoArea,
  TogetherRunBtn,
  Wrapper,
} from "./HomeScreenStyle";
import HeaderNavigation from "../../components/HeaderNavigation/HeaderNavigation";
import fonts from "../../styles/fonts";
import GradientButton from "../../components/Button/GradientsBtn/GradientsButton";
import CustomCarousel from "../../components/CustomCarousel/CustomCarousel";
import useAuthStore from "./../../store/AuthStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import color from "../../styles/colors";
import { useContext, useEffect, useState } from "react";
import { apiClient } from "../../customAxios";

const { width } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const { user } = useAuthStore();
  const [userInfo, setUserInfo] = useState({
    nickname: "",
    height: "",
    weight: "",
    name: "",
    phoneNumber: "",
    email: "",
    address: "",
    birthDate: "",
    gender: "",
    imageUrl: "",
  });

  const fontsLoaded = useFontsLoaded();

  if (!fontsLoaded) {
    return null; // 폰트 로드 전까지 렌더링 방지
  }

  // useEffect(() => {
  //   getMyProfile()
  // }, [])

  useEffect(() => {
    const checkNickname = async () => {
      const checkStorageNickname = await AsyncStorage.getItem("nickname");
      // if (!checkStorageNickname) {
        getMyProfile()
      // }
      console.log("!!!!!!닉네임 확인용: ", checkStorageNickname);
    };
    checkNickname();
  }, []);

  // 홈 화면에 들어왔을 시 async storage에 마이페이지 데이터를 저장하기 위함
  const getMyProfile = async () => {
    try {
      const response = await apiClient.get(`/member/mypage/info`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      if (response.status === 200) {
        // console.log("마이페이지 조회 성공: ", response.data.data);
        const getUserInfo = response.data.data;
        setUserInfo({ ...getUserInfo });

        const checkStorageNickname = await AsyncStorage.getItem("nickname");

        // async storage에 마이페이지 값이 비워져 있을 때만 저장하도록
        if (!checkStorageNickname || checkStorageNickname !== getUserInfo.nickname) {
          
          await AsyncStorage.setItem("email", getUserInfo.email);
          // console.log(6);

          await AsyncStorage.setItem("name", getUserInfo.name);
          // console.log(7);
          await AsyncStorage.setItem("nickname", getUserInfo.nickname);
          // console.log(8);

          // 상세 정보까지 저장
          await AsyncStorage.setItem("height", String(getUserInfo.height));
          // console.log(9);

          await AsyncStorage.setItem("weight", String(getUserInfo.weight));
          // console.log(10);
          await AsyncStorage.setItem("birthDate", getUserInfo.birthDate);
          // console.log(11);
          await AsyncStorage.setItem("address", getUserInfo.address);
          // console.log(12);
          await AsyncStorage.setItem("gender", getUserInfo.gender);
          // console.log(13);
          await AsyncStorage.setItem("imageUrl", getUserInfo.imageUrl);
          // console.log(14);
          await AsyncStorage.setItem("phoneNumber", getUserInfo.phoneNumber);
        }
      }
    } catch (error) {
      console.error("마이페이지 조회 에러 발생: ", error);
    }
  };

  return (
    <Wrapper>
      <HeaderNavigation />
      <ButtonList>
        <View style={{ flexDirection: "row", flex: 1 }}>
          <GradientButton
            onPress={() => {
              navigation.navigate("SelectRunType");
            }}
            title={`혼자\n달리기\n모드`}
            gradientType="orange_gradient"
            direction="diagonalTopLeftToBottomRight"
            mode="alone"
          />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <GradientButton
              onPress={() => {
                navigation.navigate("SelectRunType");
              }}
              title={`함께\n달리기`}
              gradientType="grape_fruit_gradient"
              direction="diagonalTopLeftToBottomRight"
              mode="together"
            />
            <GradientButton
              onPress={() => {
                navigation.navigate("PairingWatch");
                // navigation.navigate("Modal");
              }}
              title={`워치연동`}
              gradientType="balck_gradient"
              mode="watch"
            />
          </View>
        </View>
      </ButtonList>
      <MaraThonInfoArea>
        <View>
          <Image source={require("../../assets/images/homeLine.png")} />
          <Text style={[styles.font, styles.previewTitle]}>다가오는 일정</Text>
        </View>
        <View style={styles.shadowContainer}>
          <CarouselView>
            <CustomCarousel navigation={navigation} />
          </CarouselView>
        </View>
      </MaraThonInfoArea>
    </Wrapper>
  );
};
const styles = StyleSheet.create({
  font: {
    fontFamily: fonts.gMarketBold,
  },
  shadowContainer: {
    flex: 1,
    marginVertical: 10,
  },
  previewTitle: {
    fontSize: 18,
    color: "white",
    position: "absolute",
    top: 18,
    left: width * 0.05,
  },
});
export default HomeScreen;
