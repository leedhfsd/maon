import {
  Wrapper,
  AddRouteBtn,
  Col,
  FinishBtn,
  ViewTypeChangeBtn,
  styles,
} from './RecordDetailScreenStyles'
import useAuthStore from "./../../store/AuthStore"
import { useState, useEffect, useRef } from 'react';
import { SafeAreaView, TouchableOpacity, View, Text, Button, BackHandler, Alert, } from "react-native";
import { useFontsLoaded } from "../../utils/fontContext";
import { apiClient } from '../../customAxios';
import ResultDonutChart from "../../components/DonutChart/ResultDonutChart";
import { baseGps } from "../../text_gpx_data";
import color from "../../styles/colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faHeart,
  faStopwatch,
  faShoePrints,
} from "@fortawesome/free-solid-svg-icons";
import fonts from "../../styles/fonts";
import MapView, { Polyline } from "react-native-maps";
import MapStyle from "../../components/Map/MapStyle";
import SquareBtn from "../../components/Button/SquareBtn/SquareBtn";
import PaceChart from "../../components/PaceChart/PaceChart";
import InputModal from "../../components/Modal/InputModal/InputModal";
import DefaultModal from "../../components/Modal/DefaultModal/DefaultModal";


const RecordDetailScreen = ({ navigation, route }) => {
  const { user } = useAuthStore()

  const { mode, resultData, recordId } = route.params || {};

  console.log("resultData 확인용: ", resultData)
  const fontsLoaded = useFontsLoaded();

  if (!fontsLoaded) {
    return null; // 폰트 로드 전까지 렌더링 방지
  }


  const [seePaceChart, setSeePaceChart] = useState(false);
  const routeList = resultData.recordedTrack?.coordinates || []; // null이면 빈 배열로 초기화
  // console.log("routeList 확인용:" , routeList)
  console.log("routeList 확인용:" , routeList.coordinates)
  const [coordinates, setCoordinates] = useState([]);
  const chartDataRef = useRef({ xData: [], yData: [], yLabel: [] });

  const [polyLineLoading, setPolyLineLoading] = useState(true);

  const [addModal, setAddModal] = useState(false);
  const [addEndModal, setAddEndModal] = useState(false);
  const [addRouteName, setAddRouteName] = useState("");

  useEffect(() => {
    const backAction = () => {
      // 뒤로 가기 버튼이 눌렸을 때 실행할 동작
      Alert.alert("경고", "뒤로 가기 버튼이 비활성화되었습니다.");
      return true; // 기본 뒤로 가기 동작을 막음
    };

    // 뒤로 가기 이벤트 리스너 등록
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    // 컴포넌트가 언마운트될 때 이벤트 리스너를 제거
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (!routeList || !Array.isArray(routeList)) {
      console.warn("routeList is invalid or not an array:", routeList);
      setCoordinates([]); // 빈 배열로 설정하여 에러 방지
      return;
    }

    // 유효한 routeList가 있을 경우 좌표 변환
    const transformedCoordinates = routeList.map((point) => ({
      latitude: point.x, // 위도
      longitude: point.y, // 경도
    }));

    setCoordinates(transformedCoordinates); // 변환된 좌표 설정

    const resultX = [0.0];
    const resultY = [0];
    const resultLabel = ["0'0\""];
    for (let i = 1; i < resultData.distanceList.length; i++) {
      const pace = resultData.paceList[i];
      if (resultData.distanceList[i] !== resultData.distanceList[i - 1] && pace) {
        const parsedPace = parsePaceToSeconds(pace);
        resultX.push(resultData.distanceList[i]);
        resultY.push(parsedPace); // 초 단위로 변환된 yData 추가
        resultLabel.push(pace);
      }
    }
  //   // useRef로 xData와 yData를 업데이트
  //   chartDataRef.current = {
  //     xData: resultX,
  //     yData: resultY,
  //     yLabel: resultLabel,
  //   };
  //   console.log("Updated chartData:", chartDataRef.current);

  //   // yData 검증
  // if (chartDataRef.current.yData.some((value) => value <= 0 || !isFinite(value))) {
  //   console.error("Invalid yData detected:", chartDataRef.current.yData);
  //   chartDataRef.current.yData = chartDataRef.current.yData.map((value) =>
  //     value <= 0 || !isFinite(value) ? 0 : value
  //   );
  // }
  }, [resultData]);

  useEffect(() => {
    setPolyLineLoading(false); // 로딩 완료
  }, [coordinates]);

  if (!fontsLoaded) {
    return null; // 폰트 로드 전까지 렌더링 방지
  }

  function parsePaceToSeconds(pace) {
    const [minutes, seconds] = pace
      .split("'")
      .map((part) => parseInt(part, 10));
    return minutes * 60 + seconds;
  }

  const addRoute = async () => {
    try {
      const response = await apiClient.post(
        `/route/course/create`,
        {
          memberId: user.id,
          memberName: user.name,
          routeName: addRouteName,
          recordId: recordId,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${user.accessToken}`, // Authorization 헤더에 Bearer 토큰 추가
          },
        }
      );
      if (response.status == 201) {
        setAddModal(false);
        setAddEndModal(true);
      }
    } catch (e) {
      console.log("Add Route Error: " + e);
    }
  };

  return (
    // <Wrapper>
    //     <Text>기록 디테일 화면</Text>
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Wrapper>
        <View style={[styles.routeAddView]}>
          {/* <AddRouteBtn
            onPress={() => {
              setAddModal(true);
            }}
          >
            <Text style={[styles.boldFont]}>경로 추가하기</Text>
          </AddRouteBtn> */}
        </View>
        <View>
          <ResultDonutChart
            mode={mode}
            routeDistance={resultData.routeDistance || resultData.distance || 1}
            distance={resultData.distance || 0}
          />
        </View>
        <View style={styles.infoList}>
          <Col>
            <FontAwesomeIcon
              icon={faHeart}
              color={color.light_orange}
              size={25}
            />
            <Text style={[styles.boldFont, styles.infoTitle]}>평균 심박수</Text>
            <Text style={[styles.boldFont]}>{resultData.averageHeartRate}</Text>
          </Col>
          <Col>
            <FontAwesomeIcon
              icon={faStopwatch}
              size={25}
              color={color.light_orange}
            />
            <Text style={[styles.boldFont, styles.infoTitle]}>총 시간</Text>
            <Text style={[styles.boldFont]}>{resultData.runningTime}</Text>
          </Col>
          <Col>
            <FontAwesomeIcon
              style={{ transform: [{ rotate: "270deg" }] }} // 270도 회전
              icon={faShoePrints}
              size={25}
              color={color.light_orange}
            />
            <Text style={[styles.boldFont, styles.infoTitle]}>평균 페이스</Text>
            <Text style={[styles.boldFont]}>{resultData.averagePace}</Text>
          </Col>
        </View>
        <View>
          <View style={[styles.tab]}>
            <ViewTypeChangeBtn
              onPress={() => {
                setSeePaceChart(false);
              }}
            >
              {/* <Text
                style={[
                  styles.boldFont,
                  { color: !seePaceChart ? color.light_orange : "black" },
                ]}
              >
                달리기 경로
              </Text> */}
            </ViewTypeChangeBtn>
            {/* <View style={[styles.bar]}></View>
            <ViewTypeChangeBtn
              onPress={() => {
                setSeePaceChart(true);
              }}
            >
              <Text
                style={[
                  styles.boldFont,
                  { color: seePaceChart ? color.light_orange : "black" },
                ]}
              >
                페이스 그래프
              </Text>
            </ViewTypeChangeBtn> */}
          </View>
        </View>
        <View style={{ marginBottom: 20, flex: 1 }}>
          {seePaceChart ? (
            <>
              {/* <PaceChart
                xData={chartDataRef.current.xData}
                yData={chartDataRef.current.yData}
                yLabel={chartDataRef.current.yLabel}
              /> */}
            </>
          ) : (
            <View style={{ flex: 1 }}>
              <MapView
                provider={MapView.PROVIDER_GOOGLE}
                customMapStyle={MapStyle}
                style={{
                  flex: 1,
                  alignSelf: "stretch",
                  borderRadius: 20,
                }}
                showsUserLocation={false}
                initialRegion={{
                  latitude: routeList[0]?.x || 35.205409, // 위도 설정
                  longitude: routeList[0]?.y || 126.811489,
                  latitudeDelta: 0.005, // 줌 레벨 설정 (작을수록 줌 인)
                  longitudeDelta: 0.005,
                }}
              >
                {polyLineLoading ? (
                  <></>
                ) : (
                  <Polyline
                    coordinates={coordinates} // 변환된 좌표 배열 전달
                    strokeColor="#FF5733" // 원하는 색상 (예: 주황색)
                    strokeWidth={4} // 선 두께 설정
                  />
                )}
              </MapView>
            </View>
          )}
        </View>
        <SquareBtn
          text="뒤로가기"
          onPress={() => {
            navigation.navigate("Record");
          }}
        />
      </Wrapper>
    </SafeAreaView>
    // </Wrapper>
  );
};
export default RecordDetailScreen;