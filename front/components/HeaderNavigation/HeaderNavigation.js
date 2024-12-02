import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Svg, { Path } from "react-native-svg";
import color from "../../styles/colors";
import { useState, useEffect } from "react";
import { apiClient } from "../../customAxios";
import useAuthStore from "./../../store/AuthStore";

const HeaderNavigation = () => {
  const navigation = useNavigation(); // useNavigation으로 navigation 객체 가져오기
  const { user } = useAuthStore();
  const [hasNotification, setHasNotification] = useState(false);
  const [requestorList, setRequestorList] = useState([]);

  useEffect(() => {
    getInviteList();
  }, []);

  const getInviteList = async () => {
    try {
      const response = await apiClient.get(`/tournament/team/invite/list`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${user.accessToken}`, // Authorization 헤더에 Bearer 토큰 추가
        },
      });
      if (response.status === 200) {
        // console.log('홈 화면에서 초대 요청 목록 조회 성공: ', response.data.data)
        const invitationList = response.data.data.invitationList;
        if (invitationList.length > 0) {
          setHasNotification(true);
        } else {
          setHasNotification(false);
        }
      }
    } catch (error) {
      console.error("초대 요청 목록 조회 에러 발생: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.row}>
          <View style={styles.test}>
            {/* SVG Icon */}
            <Svg
              onPress={() =>
                navigation.navigate("Notification", {
                  reloadInviteList: getInviteList,
                })
              }
              width={35}
              height={35}
              fill={color.grape_fruit} // Replace with your color
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512">
              <Path
                className="fa-secondary"
                opacity=".4"
                d="M0 384c0 4.4 .9 8.9 2.8 13.1C8 408.6 19.4 416 32 416l384 0c12.6 0 24-7.4 29.2-18.9c1.9-4.2 2.8-8.7 2.8-13.1c0-7.7-2.8-15.3-8.1-21.3l-7.4-8.3C401.3 319.2 384 273.9 384 226.8l0-18.8c0-77.4-55-142-128-156.8L256 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 19.2C119 66 64 130.6 64 208l0 18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3C2.8 368.7 0 376.3 0 384z"
              />
              <Path
                className="fa-primary"
                d="M288 448c0 17-6.7 33.3-18.7 45.3s-28.3 18.7-45.3 18.7s-33.3-6.7-45.3-18.7s-18.7-28.3-18.7-45.3l64 0h64z"
              />
            </Svg>

            {/* Notification Dot */}
            {hasNotification && <View style={styles.notificationDot} />}
          </View>
          {/* <Svg
            width={35}
            height={35}
            fill={color.grape_fruit}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            onPress={() => navigation.navigate("Notification")}
          >
            <Path
              className="fa-secondary"
              opacity=".4"
              d="M0 384c0 4.4 .9 8.9 2.8 13.1C8 408.6 19.4 416 32 416l384 0c12.6 0 24-7.4 29.2-18.9c1.9-4.2 2.8-8.7 2.8-13.1c0-7.7-2.8-15.3-8.1-21.3l-7.4-8.3C401.3 319.2 384 273.9 384 226.8l0-18.8c0-77.4-55-142-128-156.8L256 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 19.2C119 66 64 130.6 64 208l0 18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3C2.8 368.7 0 376.3 0 384z"
            />
            <Path
              className="fa-primary"
              d="M288 448c0 17-6.7 33.3-18.7 45.3s-28.3 18.7-45.3 18.7s-33.3-6.7-45.3-18.7s-18.7-28.3-18.7-45.3l64 0h64z"
            />
          </Svg> */}

          {/* <Svg
            width={35}
            height={35}
            fill={color.grape_fruit}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            onPress={() => navigation.navigate("MyPage")}>
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
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: "row",
  },
  innerContainer: {
    flex: 1,
    alignItems: "flex-end",
    aspectRatio: 8,
    backgroundColor: color.white,
    paddingHorizontal: 10,
    // justifyContent: 'center'
    // flexDirection: 'row',
  },
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    // aspectRatio: 4,
  },
  // headerSvg: {
  //   flex: 1,
  //   // flexDirection: 'row',

  // }
  test: {
    position: "relative",
    width: 35,
    height: 35,
  },
  notificationDot: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 10,
    height: 10,
    backgroundColor: `${color.grape_fruit}`,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "white",
  },
});

export default HeaderNavigation;
