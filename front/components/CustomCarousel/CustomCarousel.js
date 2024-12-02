import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, Image } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { Col, Row, RunBtn, Wrapper, styles } from "./CustomCarouselStyle";
import color from "../../styles/colors";
import {
  faLocationDot,
  faMapLocationDot,
  faPersonRunning,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCalendarDays } from "@fortawesome/pro-duotone-svg-icons";
import fonts from "../../styles/fonts";
import { apiClient } from "../../customAxios";
import MapView, { Marker } from "react-native-maps";
import MapStyle from "../../components/Map/MapStyle";
import useAuthStore from "./../../store/AuthStore";
const { width } = Dimensions.get("window");

const CustomCarousel = ({ navigation }) => {
  const [myMarathonList, setMyMarathoneList] = useState([]);
  const { user } = useAuthStore();
  useEffect(() => {
    const getMyMarathonList = async () => {
      // console.log("getMyMarathonList");
      try {
        const response = await apiClient.get(`/tournament/tournament/my`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${user.accessToken}`, // Authorization 헤더에 Bearer 토큰 추가
          },
        });
        // console.log(response.data.data);
        setMyMarathoneList(response.data.data.tournamentList);
      } catch (e) {
        console.log(e);
      }
    };
    getMyMarathonList();
  }, []);

  useEffect(() => {
    // console.log(myMarathonList);
  }, [myMarathonList]);
  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  }
  function calculateDaysLeft(targetDate) {
    // 현재 날짜와 시간을 로컬 시간으로 강제 설정
    const today = new Date();
    const localToday = new Date(
      today.getTime() - today.getTimezoneOffset() * 60000
    );

    // targetDate를 "YYYY-MM-DDTHH:MM:SS" 형식으로 파싱하여 로컬 시간으로 변환
    const [datePart, timePart] = targetDate.split("T");
    const [year, month, day] = datePart.split("-");
    const [hours, minutes, seconds] = timePart.split(":");

    // 로컬 시간대에서의 목표 날짜 및 시간을 생성
    const target = new Date(
      parseInt(year), // 연도
      parseInt(month) - 1, // 월 (0부터 시작)
      parseInt(day), // 일
      parseInt(hours), // 시
      parseInt(minutes), // 분
      parseInt(seconds) // 초
    );
    // console.log(localToday);
    // console.log(target);

    // 두 날짜 간의 차이를 계산 (밀리초 단위)
    const difference = target - localToday;
    const daysLeft = Math.ceil(difference / (1000 * 60 * 60 * 24));

    // 남은 일수 또는 "D-Day" 반환
    return daysLeft > 0 ? `D-${daysLeft}` : "D-Day";
  }

  return myMarathonList.length > 0 ? (
    <Carousel
      width={width}
      data={myMarathonList}
      renderItem={({ item }) => (
        <Wrapper
          style={styles.wrapper}
          onPress={() => {
            navigation.navigate("MarathonInfoDetail", {
              uuid: item.id,
              paramsLatitude: item.latitude,
              paramsLongitude: item.longitude,
            });
          }}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {item.title}
          </Text>
          <View style={{ flexDirection: "row", marginTop: 5, flex: 1 }}>
            <Col>
              <Row>
                <FontAwesomeIcon
                  size={20}
                  icon={faCalendarDays}
                  color={color.grape_fruit}
                  secondaryColor={color.light_mandarin}
                  swapOpacity={true}
                />
                <Text style={styles.subText}>
                  {formatDate(item.tournamentDayStart)}
                </Text>
              </Row>
              <Row>
                <FontAwesomeIcon
                  icon={faPersonRunning}
                  size={20}
                  color={color.grape_fruit}
                />
                <Text style={[styles.subText]}>{item.tournamentCategory}</Text>
              </Row>
              <Row>
                <FontAwesomeIcon
                  icon={faLocationDot}
                  size={20}
                  color={color.grape_fruit}
                />
                <Text
                  style={[styles.subText, { width: 130 }]}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {item.location}
                </Text>
              </Row>
              <Row
                style={{
                  flex: 1,
                  justifyContent: "flex-end",
                  marginTop: 0,
                  marginBottom: 0,
                }}>
                <RunBtn>
                  <Text
                    style={{ color: "white", fontFamily: fonts.gMarketBold }}>
                    {calculateDaysLeft(item.tournamentDayStart)}
                  </Text>
                </RunBtn>
              </Row>
            </Col>
            <Col style={{ marginLeft: 20 }}>
              <MapView
                provider={MapView.PROVIDER_GOOGLE}
                customMapStyle={MapStyle}
                style={{
                  flex: 1,
                  alignSelf: "stretch",
                  borderRadius: 20,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
                showsUserLocation={false}
                initialRegion={{
                  latitude: item.latitude,
                  longitude: item.longitude,
                  latitudeDelta: 0.003,
                  longitudeDelta: 0.003,
                }}>
                <Marker
                  coordinate={{
                    latitude: item.latitude,
                    longitude: item.longitude,
                  }}>
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    size={34}
                    color={color.light_orange}
                  />
                </Marker>
              </MapView>
            </Col>
          </View>
        </Wrapper>
      )}
      style={{ flex: 1 }}
    />
  ) : (
    <Text
      style={{
        fontFamily: fonts.gMarketBold,
        fontSize: 16,
        color: color.black,
      }}>
      참가한 마라톤이 존재하지 않아요.
    </Text>
  );
};

export default CustomCarousel;
