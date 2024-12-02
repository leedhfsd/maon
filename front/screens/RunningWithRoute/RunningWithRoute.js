import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  Button,
  TouchableOpacity,
} from "react-native";
import { useFontsLoaded } from "../../utils/fontContext";
import {
  Bottom,
  RunInfo,
  RunInfoCol,
  StopBtn,
  Top,
  Wrapper,
} from "../RunningAlone/RunningAloneStyle";
import { useContext, useEffect, useRef, useState } from "react";
import Map from "../../components/Map/Map";
import RunStartModal from "../../components/Modal/RunStartModal/RunStartModal";
import Timer from "../../components/Timer/Timer";
import DefaultModal from "../../components/Modal/DefaultModal/DefaultModal";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import GoalDonutChart from "../../components/DonutChart/GoalDonutChart";
import Pace from "../../components/Pace/Pace";
import HeartBeat from "../../components/HeartBeat/HeartBeat";
import { locationDtoPrint } from "../../utils/console";
import useAuthStore from "../../store/AuthStore";
import { getPracticeRoomId } from "../../utils/getRoomId";
import RunAlarm from "../../components/RunAlarm/RunAlarm";
import * as Location from "expo-location";
import { LocationContext } from "../../utils/LocationProvider";

const RunningWithRoute = ({ navigation, route }) => {
  const location = useContext(LocationContext);

  const { routeId, searchType, mode, marathonInfo, latLongArray } =
    route.params;
  const fontsLoaded = useFontsLoaded();
  if (!fontsLoaded) {
    return null; // 폰트 로드 전까지 렌더링 방지
  }

  // 마라톤 시작점 좌표 추출
  const startPoint = {
    latitude: marathonInfo.track.coordinates[0].coordinates[0],
    longitude: marathonInfo.track.coordinates[0].coordinates[1],
  };

  const { user } = useAuthStore();

  const [showAlarm, setShowAlarm] = useState(true);
  const [showStartModal, setShowStartModal] = useState(false); // 시작 모달
  const [runStart, setRunStart] = useState(false); // 달리기 시작 / 멈춤
  const [showStopModal, setShowStopModal] = useState(false); // 종료 모달
  const [running, setRunning] = useState(false); // 달리기 진행 여부
  const [runningDistance, setRunningDistance] = useState(0); // 달린 거리
  const [elapsedTime, setElapsedTime] = useState("00:00:00"); // 경과 시간
  const [pace, setPace] = useState("00'00''"); // 페이스
  const [connectedWatch, setConnectedWatch] = useState(false); // 워치 연결 여부
  const [recordId, setRecordId] = useState();
  const [ment, setMent] = useState(`시작을 위해 \n시작점으로 이동하세요`);

  const kafkaStompClientRef = useRef(null); // 스톰프
  const elapsedTimeRef = useRef(elapsedTime); // 달린 시간
  const paceRef = useRef(pace); //페이스 값
  const runningDistanceRef = useRef(runningDistance); //달린 거리
  const recordIdRef = useRef(null); // 기록아이디
  const locationInterval = useRef(null);
  const routeIndexRef = useRef(0); // 루트 인덱스
  const [runRoute, setRunRoute] = useState([]); // 달리기 경로

  const [currentLocation, setCurrentLocation] = useState(null); // 현재 위치

  const currentTrackingLocationRef = useRef(location); // 현재 위치 값

  const [locationPermissionGranted, setLocationPermissionGranted] =
    useState(false);
  const [inStartPoint, setInStartPoint] = useState(false); //시작점
  const [checkingRoute, setCheckingRoute] = useState({}); // 경로 이탈 응답 데이타

  const totalIndex = useRef(latLongArray.length); //총 거리 인덱스
  const currentIndex = useRef(0); //현재 거리 인덱스
  const matchingDistance = useRef(0); // 총거리 값 / ( 총거리 인덱스 / 현재 거리 인덱스 )

  const [resultData, setResultData] = useState({
    id: "",
    routeId: "",
    paceList: [],
    recordedTrack: "",
    runningTime: "",
    averagePace: "",
    averageHeartRate: 0,
    distance: 0,
    createdAt: "",
    routeDistance: 0,
    distanceList: [],
  });

  //종료 버튼
  const StopModalContent = {
    text: "종료하시겠습니까?",
    subText: "",
    buttons: [
      {
        title: "취소",
        onPress: () => {
          setShowStopModal(false);
          setRunStart(true);
        },
      },
      {
        title: "종료",
        onPress: () => {
          console.log("종료버튼 누름");
          setRunStart(false);
          setRunning(false);
          const sendEndSession = (recordId) => {
            console.log("End session request for recordId:", recordId);

            const sendFrame =
              `SEND\n` +
              `destination:/pub/running/${recordId}/end\n` +
              `content-type:application/json\n\n\0`;

            if (
              kafkaStompClientRef.current &&
              kafkaStompClientRef.current.readyState === WebSocket.OPEN
            ) {
              kafkaStompClientRef.current.send(sendFrame);
              console.log(`End session message sent for recordId: ${recordId}`);
            } else {
              console.error("WebSocket connection is not open.");
            }
          };

          sendEndSession(recordIdRef.current); // 종료 요청 전송
        },
      },
    ],
  };

  useEffect(() => {
    console.log(ment);
  }, [ment]);

  // 위치가 변경될 때마다 서버로 위치와 페이스 정보 전송
  const handleUserLocationChange = (location) => {
    if (!connectedWatch) {
      console.log("recordId: ", recordIdRef.current);
      const locationDto = {
        recordId: recordIdRef.current,
        time: elapsedTimeRef.current,
        memberId: user.id,
        routeId: routeId,
        latitude: location.latitude,
        longitude: location.longitude,
        heartRate: 0,
        routeIndex: routeIndexRef.current,
        pace: paceRef.current == undefined ? 0 : paceRef.current, // 최신 페이스
        runningDistance: runningDistanceRef.current.toFixed(2),
      };
      // locationDtoPrint(locationDto);
      // console.log("here");
      if (
        kafkaStompClientRef.current &&
        kafkaStompClientRef.current.readyState === WebSocket.OPEN
      ) {
        const sendFrame =
          `SEND\n` +
          `destination:/pub/running/route/${recordIdRef.current}\n` + // 변경된 주소
          `content-type:application/json\n\n` +
          `${JSON.stringify(locationDto)}\0`;

        kafkaStompClientRef.current.send(sendFrame);
        console.log("보내는 러닝 데이터", sendFrame);
      }
    }
  };

  //바뀐 값에 따라 현재 위치 변경
  useEffect(() => {
    currentTrackingLocationRef.current = location;
    // console.log(
    //   "변경된 currentTrackingLocationRef: ",
    //   currentTrackingLocationRef.current
    // );
  }, [location]);

  //달리기 시작을 눌렀을 경우
  useEffect(() => {
    if (running) {
      const getRoomId = async () => {
        try {
          const responseRecordId = await getPracticeRoomId(
            user.id,
            user.accessToken
          );
          console.log("get recordId 함수 실행 결과", responseRecordId);
          recordIdRef.current = responseRecordId; // 최신 값 저장
          setRecordId(responseRecordId);
        } catch (error) {
          console.error("Error fetching room ID:", error);
        }
      };

      getRoomId(); // 비동기 함수 호출
    }
  }, [running]);

  useEffect(() => {
    if (recordId) {
      // recordId가 설정된 이후에만 구독 요청을 시도합니다.
      const subscribeCheckRouteFrame = `SUBSCRIBE\nid:sub-check-route\ndestination:/sub/running/route/${recordId}\n\n\0`;
      const subscribeEndFrame = `SUBSCRIBE\nid:sub-1\ndestination:/sub/running/${recordId}/end\n\n\0`;

      if (
        kafkaStompClientRef.current &&
        kafkaStompClientRef.current.readyState === WebSocket.OPEN
      ) {
        kafkaStompClientRef.current.send(subscribeCheckRouteFrame);
        console.log("경로 이탈 판단 구독 완료");
        kafkaStompClientRef.current.send(subscribeEndFrame);
        console.log("끝 체킹 구독 완료", subscribeEndFrame);
      } else {
        console.error("WebSocket이 끊겼습니다...");
      }
    }
  }, [recordId]);

  //결과 데이터가 변경이 되면 종료를 의미하기에 종료페이지로 이동
  useEffect(() => {
    if (resultData.id) {
      navigation.navigate("RunResult", {
        resultData: resultData,
        mode: mode,
        recordId: recordIdRef.current,
      });
    }
  }, [resultData]);

  useEffect(() => {
    const kafkaWs = new WebSocket(
      "wss://k11c207.p.ssafy.io/maon/route/ws/location"
    );

    kafkaWs.onopen = () => {
      console.log("WebSocket 연결 성공!");

      // STOMP CONNECT frame을 보냅니다.
      const connectFrame =
        "CONNECT\naccept-version:1.2,1.1,1.0\nhost:k11c207.p.ssafy.io\n\n\0";
      kafkaWs.send(connectFrame);
    };

    kafkaWs.onmessage = async (message) => {
      if (message.data.startsWith("CONNECTED")) {
        console.log("STOMP 연결 성공!");

        // STOMP SUBSCRIBE frame을 보냅니다.
        const subscribeStartFrame = `SUBSCRIBE\nid:sub-find-start-point\ndestination:/sub/running/${user.id}/find-start-point\n\n\0`;
        kafkaWs.send(subscribeStartFrame);
        console.log("시작점 체킹 구독 완료", subscribeStartFrame);

        // 사용자의 위치를 트래킹하고 주기적으로 서버로 보냅니다.
        locationInterval.current = setInterval(async () => {
          try {
            const { latitude, longitude } = currentTrackingLocationRef.current;
            console.log("쓸 데이터 : ", latitude, " ", longitude);
            setCurrentLocation({
              latitude: latitude,
              longitude: longitude,
            });
            const payload = JSON.stringify({
              startLatitude: marathonInfo.track.coordinates[0].coordinates[0],
              startLongitude: marathonInfo.track.coordinates[0].coordinates[1],
              endLatitude: latitude, // 필요시 다른 값으로 변경
              endLongitude: longitude, // 필요시 다른 값으로 변경
            });

            const sendFrame = `SEND\ndestination:/pub/running/${user.id}/find-start-point\ncontent-type:application/json\n\n${payload}\0`;
            kafkaWs.send(sendFrame);
            // console.log("보낼 데이터: ", sendFrame);
          } catch (error) {
            console.error("위치 정보를 가져오는데 실패했습니다:", error);
          }
        }, 1000); // 1초마다 위치 정보를 전송합니다.
      } else {
        try {
          // 메시지의 본문을 추출합니다 (본문은 헤더와 본문 사이에 위치).
          const bodyMatch = message.data.match(/\n\n(.*)\0/);
          if (bodyMatch && bodyMatch[1]) {
            const bodyContent = bodyMatch[1].trim(); // 본문에서 공백 제거

            // 메시지의 destination을 추출합니다.
            const destinationMatch = message.data.match(/destination:(.*)\n/);
            if (destinationMatch && destinationMatch[1]) {
              const destination = destinationMatch[1].trim();

              // 시작점 판단에 대한 응답 처리
              if (destination.endsWith("/find-start-point")) {
                if (bodyContent === "true") {
                  setInStartPoint(true);
                  setShowStartModal(true);
                  setShowAlarm(false);
                  clearInterval(locationInterval.current);
                } else if (bodyContent === "false") {
                  console.log("Here!!!!!!!!!");
                  setShowAlarm(true);
                  setMent(`시작을 위해 \n시작점으로 이동하세요`);
                }
              }
              // 경로 체크에 대한 응답 처리
              else if (destination.includes("/route/")) {
                console.log("경로 체크 응답: ");
                const parsedObject = JSON.parse(bodyContent);
                console.log(parsedObject);
                //데이터 변경
                setCheckingRoute(parsedObject);
                //종료
                if (parsedObject.endPoint) {
                  setRunStart(false);
                  setRunning(false);
                  setShowAlarm(false);
                  const sendEndSession = (recordId) => {
                    console.log("End session request for recordId:", recordId);

                    const sendFrame =
                      `SEND\n` +
                      `destination:/pub/running/${recordId}/end\n` +
                      `content-type:application/json\n\n\0`;

                    if (
                      kafkaStompClientRef.current &&
                      kafkaStompClientRef.current.readyState === WebSocket.OPEN
                    ) {
                      kafkaStompClientRef.current.send(sendFrame);
                      console.log(
                        `End session message sent for recordId:`,
                        sendFrame
                      );
                    } else {
                      console.error("WebSocket connection is not open.");
                    }
                  };

                  sendEndSession(recordIdRef.current); // 종료 요청 전송
                }
              } else if (destination.endsWith("/end")) {
                console.log("끝 체킹 응답: ", bodyContent);
                const parsedData = JSON.parse(bodyContent);
                setResultData({
                  id: parsedData.record.id,
                  routeId: parsedData.record.routeId,
                  paceList: parsedData.record.paceList,
                  recordedTrack:
                    parsedData.record.recordedTrack.coordinates || [],
                  runningTime: parsedData.record.runningTime,
                  averagePace: parsedData.record.averagePace,
                  averageHeartRate: parsedData.record.averageHeartRate,
                  distance: parsedData.record.distance,
                  createdAt: parsedData.record.createdAt,
                  routeDistance: parsedData.routeDistance || 0,
                  distanceList: parsedData.record.distanceList,
                });
              } else {
                console.warn("Unknown destination received:", destination);
              }
            }
          }
        } catch (error) {
          console.error("메시지를 파싱하는데 실패했습니다:", error);
        }
      }
    };

    kafkaWs.onclose = (event) => {
      console.log(
        `WebSocket 연결 종료. 코드: ${event.code}, 이유: ${event.reason}`
      );
      console.log("WebSocket 연결이 종료되었습니다.");
    };

    kafkaWs.onerror = (error) => {
      console.error("WebSocket 오류:", error);
    };

    kafkaStompClientRef.current = kafkaWs;

    console.log("array:", latLongArray);

    return () => {
      clearInterval(locationInterval.current);
      kafkaWs.close();
    };
  }, []);

  //바뀐 측정값 바로 적용시켜주기
  useEffect(() => {
    elapsedTimeRef.current = elapsedTime;
    paceRef.current = pace;
    runningDistanceRef.current = runningDistance;
  }, [elapsedTime, pace, runningDistance]);

  useEffect(() => {
    console.log(
      "응답인덱스 : ",
      checkingRoute.nextRouteIndex,
      "응답 경로 이탈 판정 : ",
      checkingRoute.onRoute
    );
    routeIndexRef.current = checkingRoute.nextRouteIndex;
    if (!checkingRoute.onRoute) {
      setShowAlarm(true);
      setMent(`경로를 이탈했습니다. \n정상 경로로 이동하세요`);
    } else {
      setShowAlarm(false);
      //현재 인덱스 값 바꿔주기
      currentIndex.current =
        checkingRoute.nextRouteIndex - 1 < 0
          ? 0
          : checkingRoute.nextRouteIndex - 1;
      //거리 값 바꿔주기
      matchingDistance.current = parseFloat(
        (
          marathonInfo.distance /
          (totalIndex.current / currentIndex.current)
        ).toFixed(2)
      );
      console.log(
        "알맞은 경로로 진행 중 , 현재 인덱스 값 ",
        currentIndex.current
      );
      console.log("변경된 거리 ", matchingDistance.current);

      //러닝 인덱스 바꿔주기
      // runRoute에 latLongArray 0번부터 checkingRoute.nextRouteIndex - 1까지 넣기

      //러닝 인덱스 바꿔주기
      setRunRoute(latLongArray.slice(0, checkingRoute.nextRouteIndex - 1));

      if (isNaN(matchingDistance.current)) {
        matchingDistance.current = 0;
      }
    }
  }, [checkingRoute]);

  return (
    <View style={{ flex: 1 }}>
      {running && (
        <Top>
          <StopBtn
            onPress={() => {
              if (!showStopModal) {
                setShowStopModal(true);
                setRunStart(false);
              }
            }}>
            {!showStopModal && (
              <FontAwesomeIcon icon={faPause} color="white" size={25} />
            )}
            {showStopModal && (
              <FontAwesomeIcon icon={faPlay} color="white" size={25} />
            )}
          </StopBtn>
          <Timer
            elapsedTime={elapsedTime}
            connectedWatch={connectedWatch}
            showStopModal={showStopModal}
            runStart={runStart}
            onTimeUpdate={setElapsedTime}
          />
        </Top>
      )}
      <Map
        runRoute={runRoute}
        selectedRoute={latLongArray}
        startPoint={startPoint} // 시작점 전달
        currentLocation={currentLocation}
        connectedWatch={connectedWatch}
        showStartModal={showStartModal}
        setShowStartModal={setShowStartModal}
        navigation={navigation}
        runStart={runStart}
        setRunningDistance={setRunningDistance}
        mode={mode}
        onLocationChange={handleUserLocationChange}
        recordId={recordId}
      />
      {running && (
        <Bottom>
          <RunInfo>
            <RunInfoCol style={{ flex: 1 }}>
              <GoalDonutChart
                connectedWatch={connectedWatch}
                currentDistance={parseFloat(matchingDistance.current)}
                goalDistance={marathonInfo.distance}
                mode={mode}
              />
            </RunInfoCol>
            <RunInfoCol style={{ flex: 2, paddingLeft: 21 }}>
              <Pace
                connectedWatch={connectedWatch}
                mode={mode}
                elapsedTime={elapsedTime}
                currentDistance={runningDistanceRef}
                setPace={setPace}
                pace={pace}
              />
              <HeartBeat mode={mode} heartRate={"--"} />
            </RunInfoCol>
          </RunInfo>
        </Bottom>
      )}
      {showStartModal && (
        <RunStartModal
          showStartModal={showStartModal}
          setShowStartModal={setShowStartModal}
          setRunStart={setRunStart}
          setRunning={setRunning}
        />
      )}
      {showStopModal && (
        <DefaultModal isVisible={showStopModal} content={StopModalContent} />
      )}

      {showAlarm && <RunAlarm isVisible={showAlarm} ment={ment} />}
    </View>
  );
};

export default RunningWithRoute;
