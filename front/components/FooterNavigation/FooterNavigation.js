import { LinearGradient } from "expo-linear-gradient";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import color from "../../styles/colors";
import fonts from "../../styles/fonts";

const FooterNavigation = ({ currentRoute }) => {
  const navigation = useNavigation();
  const activeColor = color.nav_orange; // 활성화된 아이콘과 텍스트 색상 설정

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        style={styles.footerNav}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        colors={[color.nav_orange, color.dark_mandarind]}
      >
        <View style={styles.container}>
          {/* 홈 버튼 */}
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate("Home")}
          >
            <View
              style={[
                styles.navButtonBack,
                currentRoute === "Home" && { backgroundColor: color.white },
              ]}
            >
              <Svg
                width={35}
                height={35}
                fill={currentRoute === "Home" ? activeColor : color.white}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
              >
                <Path d="M543.8 287.6c17 0 32-14 32-32.1c1-9-3-17-11-24L512 185l0-121c0-17.7-14.3-32-32-32l-32 0c-17.7 0-32 14.3-32 32l0 36.7L309.5 7c-6-5-14-7-21-7s-15 1-22 8L10 231.5c-7 7-10 15-10 24c0 18 14 32.1 32 32.1l32 0 0 69.7c-.1 .9-.1 1.8-.1 2.8l0 112c0 22.1 17.9 40 40 40l16 0c1.2 0 2.4-.1 3.6-.2c1.5 .1 3 .2 4.5 .2l31.9 0 24 0c22.1 0 40-17.9 40-40l0-24 0-64c0-17.7 14.3-32 32-32l64 0c17.7 0 32 14.3 32 32l0 64 0 24c0 22.1 17.9 40 40 40l24 0 32.5 0c1.4 0 2.8 0 4.2-.1c1.1 .1 2.2 .1 3.3 .1l16 0c22.1 0 40-17.9 40-40l0-16.2c.3-2.6 .5-5.3 .5-8.1l-.7-160.2 32 0z" />
              </Svg>
              <Text
                style={[
                  styles.label,
                  currentRoute === "Home" && { color: activeColor },
                ]}
              >
                홈
              </Text>
            </View>
          </TouchableOpacity>

          {/* 마라톤 버튼 */}
          <TouchableOpacity
            style={styles.navButton}
            onPress={() =>
              navigation.navigate("MarathonInfo", { mode: "searchInfo" })
            }
          >
            <View
              style={[
                styles.navButtonBack,
                currentRoute === "Marathon" && { backgroundColor: color.white },
              ]}
            >
              <Svg
                width={35}
                height={35}
                fill={currentRoute === "Marathon" ? activeColor : color.white}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <Path d="M320 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM125.7 175.5c9.9-9.9 23.4-15.5 37.5-15.5c1.9 0 3.8 .1 5.6 .3L137.6 254c-9.3 28 1.7 58.8 26.8 74.5l86.2 53.9-25.4 88.8c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l28.7-100.4c5.9-20.6-2.6-42.6-20.7-53.9L238 299l30.9-82.4 5.1 12.3C289 264.7 323.9 288 362.7 288l21.3 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-21.3 0c-12.9 0-24.6-7.8-29.5-19.7l-6.3-15c-14.6-35.1-44.1-61.9-80.5-73.1l-48.7-15c-11.1-3.4-22.7-5.2-34.4-5.2c-31 0-60.8 12.3-82.7 34.3L57.4 153.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l23.1-23.1zM91.2 352L32 352c-17.7 0-32 14.3-32 32s14.3 32 32 32l69.6 0c19 0 36.2-11.2 43.9-28.5L157 361.6l-9.5-6c-17.5-10.9-30.5-26.8-37.9-44.9L91.2 352z" />
              </Svg>
              <Text
                style={[
                  styles.label,
                  currentRoute === "Marathon" && { color: activeColor },
                ]}
              >
                마라톤
              </Text>
            </View>
          </TouchableOpacity>

          {/* 기록 버튼 */}
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate("Record")}
          >
            <View
              style={[
                styles.navButtonBack,
                currentRoute === "Record" && { backgroundColor: color.white },
              ]}
            >
              <Svg
                width={35}
                height={35}
                fill={currentRoute === "Record" ? activeColor : color.white}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <Path d="M160 80c0-26.5 21.5-48 48-48l32 0c26.5 0 48 21.5 48 48l0 352c0 26.5-21.5 48-48 48l-32 0c-26.5 0-48-21.5-48-48l0-352zM0 272c0-26.5 21.5-48 48-48l32 0c26.5 0 48 21.5 48 48l0 160c0 26.5-21.5 48-48 48l-32 0c-26.5 0-48-21.5-48-48L0 272zM368 96l32 0c26.5 0 48 21.5 48 48l0 288c0 26.5-21.5 48-48 48l-32 0c-26.5 0-48-21.5-48-48l0-288c0-26.5 21.5-48 48-48z" />
              </Svg>
              <Text
                style={[
                  styles.label,
                  currentRoute === "Record" && { color: activeColor },
                ]}
              >
                기록
              </Text>
            </View>
          </TouchableOpacity>

          {/* 내 정보 버튼 */}
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate("MyPage")}
          >
            <View
              style={[
                styles.navButtonBack,
                currentRoute === "Challenge" && {
                  backgroundColor: color.white,
                },
              ]}
            >
              <Svg 
                width={35}
                height={35}
                fill={currentRoute === "MyPage" ? activeColor : color.white}
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 448 512">
                <Path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"/>
              </Svg>
              {/* <Svg
                width={35}
                height={35}
                fill={currentRoute === "MyPage" ? activeColor : color.white}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                // onPress={() => navigation.navigate("MyPage")}
                >
                <Path
                  class="fa-secondary"
                  opacity=".4"
                  d="M96 128a128 128 0 1 0 256 0A128 128 0 1 0 96 128z"
                />
                <Path
                  class="fa-primary"
                  d="M0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z"
                />
              </Svg> */}
              {/* <Svg
                width={35}
                height={35}
                fill={currentRoute === "Challenge" ? activeColor : color.white}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
              >
                <Path d="M400 0L176 0c-26.5 0-48.1 21.8-47.1 48.2c.2 5.3 .4 10.6 .7 15.8L24 64C10.7 64 0 74.7 0 88c0 92.6 33.5 157 78.5 200.7c44.3 43.1 98.3 64.8 138.1 75.8c23.4 6.5 39.4 26 39.4 45.6c0 20.9-17 37.9-37.9 37.9L192 448c-17.7 0-32 14.3-32 32s14.3 32 32 32l192 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-26.1 0C337 448 320 431 320 410.1c0-19.6 15.9-39.2 39.4-45.6c39.9-11 93.9-32.7 138.2-75.8C542.5 245 576 180.6 576 88c0-13.3-10.7-24-24-24L446.4 64c.3-5.2 .5-10.4 .7-15.8C448.1 21.8 426.5 0 400 0zM48.9 112l84.4 0c9.1 90.1 29.2 150.3 51.9 190.6c-24.9-11-50.8-26.5-73.2-48.3c-32-31.1-58-76-63-142.3zM464.1 254.3c-22.4 21.8-48.3 37.3-73.2 48.3c22.7-40.3 42.8-100.5 51.9-190.6l84.4 0c-5.1 66.3-31.1 111.2-63 142.3z" />
              </Svg> */}
              <Text
                style={[
                  styles.label,
                  currentRoute === "MyPage" && { color: activeColor },
                ]}
              >
                내 정보
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    aspectRatio: Platform.OS === "ios" ? 4.3 : 5,
  },
  footerNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: Platform.OS === "ios" ? 20 : 0,
    aspectRatio: Platform.OS === "ios" ? 4 : 5,
    width: "100%", // 전체 너비 채우기
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  navButton: {
    alignItems: "center",
  },
  navButtonBack: {
    alignItems: "center",
    // flex: 1,
    aspectRatio: 1.1,
    borderRadius: 17,
    padding: 3,
    // paddingHorizontal: 17,
  },
  label: {
    color: color.white,
    fontSize: 14,
    paddingTop: 3,
    fontFamily: fonts.gMarketMedium,
  },
});

export default FooterNavigation;
