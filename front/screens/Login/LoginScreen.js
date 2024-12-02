import React, { useEffect, useState } from "react";
import { View, Text, Image, Dimensions } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import * as Linking from "expo-linking";
import { Container, Logo, Wrap } from "./LoginScreenStyles";
import backImg from "./../../assets/images/Login_Back_cut2.jpg";
import RoundBtn from "../../components/Button/RoundBtn/RoundBtn";
import { useFontsLoaded } from "../../utils/fontContext";
import useAuthStore from "../../store/AuthStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiClient } from "../../customAxios";
import { useNavigation } from "@react-navigation/native";

WebBrowser.maybeCompleteAuthSession();

// const LoginScreen = ({ navigation }) => {
const LoginScreen = () => {
  const navigation = useNavigation(); // useNavigation으로 navigation 객체 가져오기
  const { setUser } = useAuthStore();
  const [userInfo, setUserInfo] = useState(null);
  const fontsLoaded = useFontsLoaded();
  const screenHeight = Dimensions.get("window").height;

  useEffect(() => {
    // AsyncStorage.clear();
    // 앱 실행 시 AsyncStorage에서 토큰 확인
    const checkLoginStatus = async () => {
      const storedToken = await AsyncStorage.getItem("accessToken");
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      const id = await AsyncStorage.getItem("id");
      const email = await AsyncStorage.getItem("email");

      const name = await AsyncStorage.getItem("name");
      const nickname = await AsyncStorage.getItem("nickName");

      // 상세 정보까지 저장
      const height = await AsyncStorage.getItem("height");
      const weight = await AsyncStorage.getItem("weight");
      const birthDate = await AsyncStorage.getItem("birthDate");
      const address = await AsyncStorage.getItem("address");
      const gender = await AsyncStorage.getItem("gender");
      const imageUrl = await AsyncStorage.getItem("imageUrl");
      const phoneNumber = await AsyncStorage.getItem("phoneNumber");

      if (storedToken) {
        // 자동 로그인 진행
        // console.log("토큰 확인용", storedToken);
        setUser({
          accessToken: storedToken,
          id: id,
          refreshToken: refreshToken,
          email: email,
          name: name,
          nickname: nickname,
          height: height,
          weight: weight,
          birthDate: birthDate,
          address: address,
          gender: gender,
          imageUrl: imageUrl,
          phoneNumber: phoneNumber,
        });

        navigation.reset({
          index: 0,
          routes: [{ name: "MainTabs" }],
        });
        // login(storedToken);
      }
    };
    checkLoginStatus();
  }, []);

  // 로그인 버튼 클릭 시 웹 로그인 페이지로 이동
  const handleLogin = async () => {
    // 로컬 IP 주소로 변경
    const redirectUri = Linking.createURL("redirect");
    // const redirectUri = `https://auth.expo.io/@maon/maon`;
    // const authUrl = `https://k11c207.p.ssafy.io/web?redirect_uri=${redirectUri}`; // 또는 ngrok 주소로 변경
    const authUrl = `https://maon--login.web.app/?redirect_uri=${redirectUri}`;// 또는 ngrok 주소로 변경(firebase)

    // 웹 브라우저에서 로그인 페이지 열기
    const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);
    if (result.type === "success" && result.url) {
      const { token, name, email } = Linking.parse(result.url).queryParams;
      setUserInfo({ token, name, email });
      // console.log("토큰 확인용: ", token);

      // 가입한 적이 있는 회원이면 어떻게 처리할지 생각해보기(회원가입 과정 안 거치고 바로 홈으로 넘어가야 함)
      login(token);
      // navigation.navigate("SignUp", {paramsName: name, paramsEmail: email})
      // navigation.navigate("SignUp", {paramsName: name, paramsEmail: email})
    }
  };

  // const requestBody = {
  //   memberId: memberId,
  //   maxMember: maxMember,
  //   orderId: orderId,
  //   merchantId: merchantId,
  //   merchantName: merchantName,
  //   categoryId: categoryId,
  //   totalPrice: totalPrice,
  // };

  //  로그인 요청_ 만약 가입한적 있는 유저일 경우엔 response.data.data.registered값이 true가 됨
  const login = async (accessToken) => {
    try {
      const response = await apiClient.post(
        `/member/member/login`,
        {
          token: accessToken, // query parameter로 token 추가
        },
        {
          withCredentials: true,
          // headers: {
          //   Authorization: `Bearer ${accessToken}`, // Authorization 헤더에 Bearer 토큰 추가
          // },
        }
      );
      // console.log(response.status)
      // console.log("로그인 성공_if문 밖")
      if (response.status === 200) {
        // console.log("로그인 성공");
        // console.log(response.data.data);
        const responseUserInfo = response.data.data;
        // 만약 가입한적 있는 회원이면 불러온 정보를 AuthStore에 저장하고 home으로 이동
        if (responseUserInfo.registered) {
          // console.log("이미 회원입니다.");
          // AuthStore에 응답값 저장
          setUser({
            id: responseUserInfo.id,
            name: responseUserInfo.name,
            email: responseUserInfo.email,
            accessToken: responseUserInfo.accessToken,
            refreshToken: responseUserInfo.refreshToken,
            imageUrl: responseUserInfo.imageUrl,
          });

          // 토큰을 AsyncStorage에 저장하여 자동 로그인 활성화
          await AsyncStorage.setItem(
            "accessToken",
            responseUserInfo.accessToken
          );
          await AsyncStorage.setItem(
            "refreshToken",
            responseUserInfo.refreshToken
          );
          await AsyncStorage.setItem("id", responseUserInfo.id);
          
          // navigation.navigate("MainTabs", { screen: "Home" });

          navigation.reset({
            index: 0,
            routes: [{ name: "MainTabs" }],
          });
        } else {
          // 가입한 적이 없는 회원일 경우에는 회원가입으로 이동 후, 회원가입 완료했을 시 AuthStore에 정보를 저장하고 home으로 이동
          // console.log("비회원이므로 회원가입 페이지로 이동합니다.");
          navigation.navigate("SignUp", {
            paramsName: responseUserInfo.name,
            paramsEmail: responseUserInfo.email,
            paramsImg: responseUserInfo.imageUrl,
            paramsAccessToken: responseUserInfo.accessToken,
          });
        }
      }
    } catch (error) {
      console.error("로그인 에러 발생: ", error);
      // await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.clear();
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Container>
      <View
        style={{
          width: "100%",
          height: screenHeight,
          zIndex: 2,
          position: "absolute",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        }}
      />
      <Image
        source={backImg}
        style={{ position: "absolute", height: screenHeight }}
      />
      <Wrap>
        <Logo>MA:ON</Logo>
        <RoundBtn text={"Google로 로그인"} onPress={handleLogin} />
        {/* {userInfo && (
          <View>
            <Text style={{ color: "white" }}>Welcome, {userInfo.name}</Text>
            <Text style={{ color: "white" }}>Email: {userInfo.email}</Text>
            <Text style={{ color: "white" }}>Token: {userInfo.token}</Text>
          </View>
        )} */}
      </Wrap>
    </Container>
  );
};

export default LoginScreen;
