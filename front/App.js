import { useState, useEffect, createContext, useContext } from "react";
import * as Font from "expo-font";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { BackHandler } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Alert, StyleSheet, Text, View, sta } from "react-native";
import ChallengeScreen from "./screens/Challenge/ChallengeScreen.js";
import MarathonInfo from "./screens/MarathonInfo/MarathonInfoScreen.js";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { LocationProvider } from "./utils/LocationProvider"; // LocationProvider 추가
import FooterNavigation from "./components/FooterNavigation/FooterNavigation.js";
import HomeScreen from "./screens/Home/HomeScreen.js";
import MarathonInfoScreen from "./screens/MarathonInfo/MarathonInfoScreen.js";
import RecordScreen from "./screens/Record/RecordScreen.js";
import LoginScreen from "./screens/Login/LoginScreen.js";
import SignUpScreen from "./screens/SignUpScreen/SignUpScreen.js";
import ModalTestScreen from "./screens/ModalTest/ModalTestScreen.js";
import MyPageScreen from "./screens/MyPage/MyPageScreen.js";
import CreateTeamScreen from "./screens/CreateTeam/CreateTeamScreen.js";
import NotificationScreen from "./screens/Notification/NotificationScreen.js";
import MarathonEntryFormScreen from "./screens/MarathonEntryForm/MarathonEntryFormScreen.js";
import MarathonInfoDetailScreen from "./screens/MarathonInfoDetail/MarathonInfoDetailScreen.js";
import RecordDetailScreen from "./screens/RecordDetail/RecordDetailScreen.js";
import { FontContext } from "./utils/fontContext.js";
import SelectRunType from "./screens/SelectRunType/SelectRunType.js";
import SelectRunRoute from "./screens/SelectRunRoute/SelectRunRoute.js";
import RunningAlone from "./screens/RunningAlone/RunningAlone.js";
import RunResult from "./screens/RunResult/RunResult.js";
import RouteDetail from "./screens/RouteDetail/RouteDetail.js";
import RunningWithRoute from "./screens/RunningWithRoute/RunningWithRoute.js";
import PairingWatch from "./screens/PairingWatch/PairingWatch.js";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        gMarketBold: require("./assets/fonts/GmarketSansTTFBold.ttf"),
        gMarketLight: require("./assets/fonts/GmarketSansTTFLight.ttf"),
        gMarketMedium: require("./assets/fonts/GmarketSansTTFMedium.ttf"),
      });
      setFontsLoaded(true);
    }

    loadFonts();

    const checkLoginStatus = async () => {
      // 로그인 상태 확인 로직
      const token = null; // 실제 로그인 상태 확인 로직으로 교체
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
  }, []);

  if (!fontsLoaded) {
    return null; // 폰트 로딩 중 렌더링 방지
  }

  return (
    <FontContext.Provider value={fontsLoaded}>
      <LocationProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName={isLoggedIn ? "MainTabs" : "Login"}>
            {/* 로그인 여부에 따른 화면 설정 */}
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="MainTabs" component={MainTabs} />

            {/* FooterNavigation이 포함되지 않은 화면 */}
            <Stack.Screen name="Modal" component={ModalTestScreen} />
            <Stack.Screen name="SelectRunType" component={SelectRunType} />
            <Stack.Screen name="SelectRunRoute" component={SelectRunRoute} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="MyPage" component={MyPageScreen} />
            <Stack.Screen name="Notification" component={NotificationScreen} />
            <Stack.Screen name="CreateTeam" component={CreateTeamScreen} />
            <Stack.Screen name="MarathonInfo" component={MarathonInfo} />
            <Stack.Screen name="RecordDetail" component={RecordDetailScreen} />
            <Stack.Screen name="Challenge" component={ChallengeScreen} />
            <Stack.Screen
              name="MarathonEntryForm"
              component={MarathonEntryFormScreen}
            />
            <Stack.Screen
              name="MarathonInfoDetail"
              component={MarathonInfoDetailScreen}
            />
            <Stack.Screen name="RunningAlone" component={RunningAlone} />
            <Stack.Screen name="RunResult" component={RunResult} />
            <Stack.Screen name="RouteDetail" component={RouteDetail} />
            <Stack.Screen
              name="RunningWithRoute"
              component={RunningWithRoute}
            />
            <Stack.Screen name="PairingWatch" component={PairingWatch} />
          </Stack.Navigator>
        </NavigationContainer>
      </LocationProvider>
    </FontContext.Provider>
  );
}

// FooterNavigation이 포함된 하단 탭 네비게이션 설정
const MainTabs = () => {
  return (
    <Tab.Navigator
      tabBar={({ state }) => (
        <FooterNavigation currentRoute={state.routes[state.index].name} />
      )}
      screenOptions={{
        headerShown: false,
        animationEnabled: false,
      }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="MarathonInfo" component={MarathonInfoScreen} />
      <Tab.Screen name="Record" component={RecordScreen} />
    </Tab.Navigator>
  );
};
