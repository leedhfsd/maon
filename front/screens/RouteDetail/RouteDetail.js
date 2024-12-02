import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
} from "react-native";
import { useFontsLoaded } from "../../utils/fontContext";
import { useEffect, useState } from "react";
import {
  Bottom,
  Top,
  Wrapper,
  Info,
  Row,
  Rank,
  RunBtn,
  styles,
  RankTitle,
  RankList,
  UserInfo,
} from "./RouteDetailStyle";
import BookmarkBtn from "../../components/Button/BookmarkBtn/BookmarkBtn";
import { BookmarkBtnArea } from "../MarathonInfoDetail/MarathonInfoDetailScreenStyles";
import { getPracticeRoomIdWithRoute } from "../../utils/getRoomId";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCalendarDays,
  faRankingStar,
  faRoute,
} from "@fortawesome/pro-duotone-svg-icons";
import color from "../../styles/colors";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { apiClient } from "../../customAxios";
import MapView, { Polyline } from "react-native-maps";

const RouteDetail = ({ navigation, route }) => {
  const { routeId, searchType, mode, info } = route.params;

  const [marathonInfo, setMarathonInfo] = useState({});
  const [latLongArray, setLatLongArray] = useState([]);
  const [runRankList, setRunRankList] = useState([]);
  const [myRankInfo, setMyRankInfo] = useState({});

  const fontsLoaded = useFontsLoaded();

  if (!fontsLoaded) {
    return null; // 폰트 로드 전까지 렌더링 방지
  }

  // 초기 데이터 로드
  useEffect(() => {
    const fetchRunRanking = async () => {
      try {
        if (routeId) {
          const response = await apiClient.get(`/route/ranking/${routeId}`, {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${user.accessToken}`, // Authorization 헤더에 Bearer 토큰 추가
            },
          });
          setRunRankList(response.data.data.rankingInfo);
        }
      } catch (error) {
        console.log("fetchRunRanking: ", error);
      }
    };
    const fetchMyRanking = async () => {
      try {
        if (routeId) {
          const response = await apiClient.get(`/route/ranking/${routeId}/my`, {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${user.accessToken}`, // Authorization 헤더에 Bearer 토큰 추가
            },
          });
          setMyRankInfo(response.data.data);
        }
      } catch (error) {
        console.log("fetchRunRanking: ", error);
      }
    };

    const getDetailInfo = async () => {
      setMarathonInfo(info);
    };
    getDetailInfo();
    fetchRunRanking();
  }, []);

  // latLongArray 설정
  useEffect(() => {
    if (marathonInfo.track && Array.isArray(marathonInfo.track.coordinates)) {
      const routeArray = marathonInfo.track.coordinates.map((point) => ({
        latitude: point.x,
        longitude: point.y,
      }));
      setLatLongArray(routeArray); // latLongArray 업데이트
    }
  }, [marathonInfo]);

  // 초기 렌더링 방지 (latLongArray가 비어있으면 렌더링 중단)
  if (!latLongArray.length) {
    return <Text>Loading map...</Text>;
  }

  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      <Wrapper>
        <Top>
          <MapView
            provider={MapView.PROVIDER_GOOGLE}
            style={{
              height: 350,
              flex: 1,
              alignSelf: "stretch",
              // borderRadius: 20,
            }}
            showsUserLocation={false}
            initialRegion={{
              latitude: latLongArray[0].latitude,
              longitude: latLongArray[0].longitude,
              latitudeDelta: 0.005, // 줌 레벨 설정 (작을수록 줌 인)
              longitudeDelta: 0.005,
            }}>
            <Polyline
              coordinates={latLongArray}
              strokeColor={color.light_orange}
              strokeWidth={6}
            />
          </MapView>
          <BookmarkBtnArea>{/* Bookmark 버튼 */}</BookmarkBtnArea>
        </Top>
        <Bottom>
          <Info>
            <Text style={[styles.boldFont, { fontSize: 28 }]}>
              {marathonInfo.routeName}
            </Text>
            <Row style={{ marginTop: 24 }}>
              <FontAwesomeIcon
                size={20}
                icon={faCalendarDays}
                color={color.grape_fruit}
                secondaryColor={color.light_mandarin}
                swapOpacity={true}
              />
              <Text style={[styles.mediumFont, styles.infoText]}>
                등록일:
                {new Date(marathonInfo.createdAt)
                  .toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })
                  .replace(/\s/g, "")
                  .replace(/\.$/, "")}
              </Text>
            </Row>
            <Row>
              <FontAwesomeIcon
                size={20}
                color={color.grape_fruit}
                icon={faPenToSquare}
              />
              <Text style={[styles.mediumFont, styles.infoText]}>
                등록인: {marathonInfo.writerName}
              </Text>
            </Row>
            <Row>
              <FontAwesomeIcon
                size={20}
                icon={faRoute}
                color={color.light_orange}
              />
              <Text style={[styles.mediumFont, styles.infoText]}>
                코스길이: {marathonInfo.distance}km
              </Text>
            </Row>
          </Info>
          <View style={{ alignItems: "flex-end" }}>
            <RunBtn
              onPress={() => {
                navigation.navigate("RunningWithRoute", {
                  routeId,
                  searchType,
                  mode,
                  marathonInfo,
                  latLongArray,
                });
              }}>
              <Text style={[styles.mediumFont, { color: "white" }]}>
                달리기
              </Text>
            </RunBtn>
          </View>
          <Rank>
            <RankTitle>
              <FontAwesomeIcon
                icon={faRankingStar}
                size={35}
                color={color.light_orange}
              />
              <Text
                style={[
                  styles.boldFont,
                  { fontSize: 20, marginLeft: 10, color: color.light_orange },
                ]}>
                랭킹
              </Text>
            </RankTitle>
            {runRankList.length > 0 &&
              (!myRankInfo.memberNickname ? (
                <Text style={[styles.boldFont, { fontSize: 16 }]}>
                  {`해당 경로에 대한 기록이 없습니다.`}
                </Text>
              ) : (
                <UserInfo>
                  <View
                    style={{
                      width: 60,
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                    <Text style={styles.rankNumber}>{myRankInfo.ranking}</Text>
                  </View>
                  <View>
                    <Image
                      style={styles.userProflie}
                      source={myRankInfo.memberProfileUrl}
                    />
                  </View>
                  <View
                    style={{
                      flex: 4,
                      marginLeft: 20,
                      alignSelf: "flex-start",
                    }}>
                    <Text
                      style={[
                        styles.boldFont,
                        { fontSize: 18, marginTop: 6, marginBottom: 8 },
                      ]}>
                      {myRankInfo.memberNickname}
                    </Text>
                    <Text style={[styles.mediumFont, { fontSize: 16 }]}>
                      {myRankInfo.runningTime}
                    </Text>
                  </View>
                </UserInfo>
              ))}

            <RankList>
              {runRankList.length > 0 ? (
                runRankList.map((user, index) => (
                  <UserInfo key={index}>
                    <View
                      style={{
                        width: 60,
                        justifyContent: "center",
                        alignItems: "center",
                      }}>
                      <Text style={styles.rankNumber}>{user.ranking}</Text>
                    </View>
                    <View>
                      <Image
                        style={styles.userProflie}
                        source={user.memberProfileUrl}
                      />
                    </View>
                    <View
                      style={{
                        flex: 4,
                        marginLeft: 20,
                        alignSelf: "flex-start",
                      }}>
                      <Text
                        style={[
                          styles.boldFont,
                          { fontSize: 18, marginTop: 6, marginBottom: 8 },
                        ]}>
                        {user.memberNickname}
                      </Text>
                      <Text style={[styles.mediumFont, { fontSize: 16 }]}>
                        {user.runningTime}
                      </Text>
                    </View>
                  </UserInfo>
                ))
              ) : (
                <Text style={[styles.boldFont, { fontSize: 16 }]}>
                  {`해당 경로에 대한 랭킹이 존재하지않습니다.`}
                </Text>
              )}
            </RankList>
          </Rank>
        </Bottom>
      </Wrapper>
    </ScrollView>
  );
};
export default RouteDetail;
