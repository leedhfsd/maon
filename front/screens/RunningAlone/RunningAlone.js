import { Alert, View } from "react-native";
import { useFontsLoaded } from "../../utils/fontContext";
import { Bottom, RunInfo, RunInfoCol, StopBtn, Top } from "./RunningAloneStyle";
import { useContext, useEffect, useRef, useState } from "react";
import Map from "../../components/Map/Map";
import RunStartModal from "../../components/Modal/RunStartModal/RunStartModal";
import Timer from "../../components/Timer/Timer";
import DefaultModal from "../../components/Modal/DefaultModal/DefaultModal";
import GoalDonutChart from "../../components/DonutChart/GoalDonutChart";
import Pace from "../../components/Pace/Pace";
import HeartBeat from "../../components/HeartBeat/HeartBeat";
import LoadingModal from "../../components/Modal/LoadingModal/LoadingModal";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { getPracticeRoomId } from "../../utils/getRoomId";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAuthStore from "../../store/AuthStore";
import { LocationContext } from "../../utils/LocationProvider";
import { locationDtoPrint } from "../../utils/console";

const RunningAlone = ({ navigation, route }) => {
  const { location, permissionGranted, getData } = useContext(LocationContext);

  const fontsLoaded = useFontsLoaded();
  if (!fontsLoaded) {
    return null; // 폰트 로드 전까지 렌더링 방지
  }

  const { user } = useAuthStore(); //유저 정보
  const { mode } = route.params; //달리기 모드

  //모달
  const [showStartModal, setShowStartModal] = useState(false); // 시작 모달
  const [runStart, setRunStart] = useState(false); // 달리기 시작 / 멈춤
  const [showStopModal, setShowStopModal] = useState(false); // 종료 모달
  const [showLoading, setShowLoading] = useState(true); // 워치데이터 가져올 수 있는지 판단

  //달리기 관련 useState
  const [running, setRunning] = useState(false); // 달리기 진행 여부
  const [runningDistance, setRunningDistance] = useState(0); // 달린 거리
  const [elapsedTime, setElapsedTime] = useState("00:00:00"); // 경과 시간
  const [pace, setPace] = useState("00'00''"); // 페이스
  const [heartRate, setHeartRate] = useState(0); // 심박수
  const [connectedWatch, setConnectedWatch] = useState(false); // 워치 연결 여부
  const [recordId, setRecordId] = useState(); // 레코드 Id
  const [currentLocation, setCurrentLocation] = useState({});

  //ref
  const kafkaStompClientRef = useRef(null); // stomp ref
  const runningData = useRef({
    recordId: "",
    time: "00:00:00",
    memberId: user.id,
    latitude: 0,
    longitude: 0,
    heartRate: 0,
    pace: "00'00''",
    runningDistance: 0,
  });

  //결과값 담을 변수
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

          sendEndSession(runningData.current.recordId); // 종료 요청 전송
        },
      },
    ],
  };

  // 위치가 변경될 때마다 서버로 위치와 페이스 정보 전송
  const handleUserLocationChange = (location) => {
    //워치가 없을때만 가능하다는거임
    if (!connectedWatch) {
      console.log("서버에 보낼 데이터 ", runningData.current);
      const locationDto = {
        recordId: runningData.current.recordId,
        time: runningData.current.time,
        memberId: user.id,
        latitude: location.latitude,
        longitude: location.longitude,
        heartRate: runningData.current.heartRate,
        pace: runningData.current.pace,
        runningDistance: runningData.current.runningDistance.toFixed(2),
      };
      // locationDtoPrint(locationDto);
      if (
        kafkaStompClientRef.current &&
        kafkaStompClientRef.current.readyState === WebSocket.OPEN
      ) {
        // STOMP 프레임을 구성하여 데이터 전송
        const sendFrame =
          `SEND\n` +
          `destination:/pub/running/${runningData.current.recordId}\n` +
          `content-type:application/json\n\n` +
          `${JSON.stringify(locationDto)}\0`;

        kafkaStompClientRef.current.send(sendFrame);
        // console.log("보낸 데이터 ", sendFrame);
      }
    }
    //워치가 있을 때
    else if (connectedWatch) {
      console.log("recordId: ", runningData.current.recordId);
      const locationDto = {
        recordId: runningData.current.recordId,
        time: runningData.current.time,
        memberId: user.id,
        latitude: location.latitude,
        longitude: location.longitude,
        heartRate: runningData.current.heartRate,
        pace: runningData.current.pace,
        // pace: "10'10\"", // 최신 페이스
        runningDistance: runningData.current.runningDistance.toFixed(2),
      };
      // locationDtoPrint(locationDto);
      if (
        kafkaStompClientRef.current &&
        kafkaStompClientRef.current.readyState === WebSocket.OPEN
      ) {
        // 서버로 데이터 전송 STOMP 프레임을 구성하여 데이터 전송
        const sendFrame =
          `SEND\n` +
          `destination:/pub/running/${runningData.current.recordId}\n` +
          `content-type:application/json\n\n` +
          `${JSON.stringify(locationDto)}\0`;

        kafkaStompClientRef.current.send(sendFrame);
        console.log("서버로 전달하는 데이터 ", sendFrame);

        const paceData = {
          pace: paceRef.current == undefined ? 0 : paceRef.current,
          distance: runningData.current.runningDistance.toFixed(2),
        };

        // STOMP 프로토콜에 맞춘 메시지 작성
        const sendWatchFrame =
          `SEND\n` +
          `destination:/pub/pace/${recordId}\n` +
          `content-type:application/json\n\n` +
          `${JSON.stringify(paceData)}\0`;
        kafkaStompClientRef.current.send(sendWatchFrame);
        console.log("워치로 전달하는 데이터 ", sendWatchFrame);
      }
    }
  };

  //위치 허용 여부 봐서 허용이 안된 경우 해달라고 하기 / 워치 여부
  const getPairedWatchStatus = async () => {
    try {
      const storedPairedWatch = await AsyncStorage.getItem("pairedWatch");
      setConnectedWatch(storedPairedWatch === "true");
    } catch (error) {
      console.error("Error fetching paired watch:", error);
    }
  };

  useEffect(() => {
    if (permissionGranted) {
      getPairedWatchStatus();
    } else {
      Alert.alert(
        "달리기 불가",
        "설정 > MA:ON 에서 위치정보 사용 허가를 해주세요",
        [
          {
            text: "확인",
            onPress: () => navigation.navigate("Home"), // 페이지 이동
          },
        ]
      );
    }
  }, []); // 컴포넌트가 마운트될 때 한 번 실행

  //위치정보를 가져오고있다면 달리기 버튼 보여주기
  useEffect(() => {
    if (getData) {
      setShowLoading(false);
      setShowStartModal(true);
    }
  }, [getData]);

  const getRoomId = async () => {
    try {
      const responseRecordId = await getPracticeRoomId(
        user.id,
        user.accessToken
      );
      console.log("get recordId 함수 실행 결과", responseRecordId);
      runningData.current.recordId = responseRecordId; // 최신 값 저장
      setRecordId(responseRecordId);
    } catch (error) {
      console.error("Error fetching room ID:", error);
    }
  };

  //2. 달리기 시작을 늘렀을 경우
  useEffect(() => {
    //달리기를 시작했을 경우
    if (running) {
      getRoomId(); // 비동기 함수 호출
    }
  }, [running]);

  //3. 레코드 아이디 받아왔을때
  useEffect(() => {
    if (runningData.current.recordId.length !== 0) {
      console.log("가져온 recordId: ", runningData.current.recordId, recordId);

      //웹소켓 연결
      const kafkaWs = new WebSocket(
        "wss://k11c207.p.ssafy.io/maon/route/ws/location"
      );

      kafkaWs.onopen = () => {
        console.log("WebSocket 연결 성공!");

        // 웹소켓이 열렸을 때 STOMP CONNECT 프레임 직접 전송
        const connectFrame =
          "CONNECT\naccept-version:1.2,1.1,1.0\nhost:k11c207.p.ssafy.io\n\n";
        kafkaWs.send(connectFrame);
      };

      //워치가 연동되었을 때
      if (connectedWatch) {
        console.log("워치 연동된 상태로 달리기");

        kafkaWs.onmessage = (message) => {
          console.log("서버로부터 메시지 수신:", message.data);

          //연결 응답이 올 경우 console.log에 찍기
          if (message.data.startsWith("CONNECTED")) {
            console.log("STOMP 연결 성공!");
            console.log(message.data);
            console.log("===========================================");
            //워치와 연결된 웹 소켓으로 recordId, mode, routeID를 전달

            const payload = {
              routeId: "",
              mode: mode,
              recordId: recordId,
            };

            // STOMP SEND 프레임 작성
            const sendFrame =
              `SEND\n` +
              `destination:/pub/start/${user.id}\n` + // pub으로 수정
              `content-type:application/json\n\n` +
              `${JSON.stringify(payload)}\0`;

            // WebSocket으로 전송
            kafkaWs.send(sendFrame);

            //stomp에 연결된 경우 데이터를 받을 sub을 구독하고있기
            // const getDataSubscribeFrame = `SUBSCRIBE\nid:sub-running-${runningData.current.recordId}\ndestination:/sub/running/${runningData.current.recordId}\n\n\0`;
            // kafkaWs.send(getDataSubscribeFrame);
            // console.log("데이터 받을 곳 구독하기", getDataSubscribeFrame);

            //심박수 받을 곳
            const getDataSubscribeFrame = `SUBSCRIBE\nid:sub-heartrate-${runningData.current.recordId}\ndestination:/sub/heartRate/${runningData.current.recordId}\n\n\0`;
            kafkaWs.send(getDataSubscribeFrame);
            console.log("데이터 받을 곳 구독하기", getDataSubscribeFrame);

            //stomp에 연결된 경우 종료 sub 구독하고 있기
            const endSubscribeFrame = `SUBSCRIBE\nid:sub-end-${runningData.current.recordId}\ndestination:/sub/running/${runningData.current.recordId}/end\n\n\0`;
            kafkaWs.send(endSubscribeFrame);
            console.log("종료 데이터 받을 곳 구독하기", endSubscribeFrame);
          }
          //연결 종료에 대한 응답값
          else {
            try {
              const parsedMessage = message.data.trim(); // 메시지 데이터를 정리
              console.log("Received message:", parsedMessage);

              // 메시지에서 destination을 추출 (메시지 포맷에 맞게 처리)
              const destinationMatch =
                parsedMessage.match(/destination:(.*)\n/);
              if (!destinationMatch) {
                console.warn("No destination found in the message");
                return;
              }

              const destination = destinationMatch[1]; // destination 값 추출
              console.log("Destination:", destination);

              // destination 값에 따라 다른 로직 실행
              if (destination.endsWith("/end")) {
                console.log("Handling /end destination logic");
                try {
                  // JSON 형식만 추출하기
                  const jsonStartIndex = message.data.indexOf("{");
                  const jsonEndIndex = message.data.lastIndexOf("}");
                  if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
                    const jsonString = message.data.substring(
                      jsonStartIndex,
                      jsonEndIndex + 1
                    );
                    const parsedData = JSON.parse(jsonString); // JSON 부분만 파싱

                    if (parsedData.status === "end") {
                      console.log(
                        "종료 응답 수신:",
                        JSON.stringify(parsedData)
                      );

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
                    }
                  } else {
                    console.error("유효한 JSON 형식이 포함되지 않음.");
                  }
                } catch (error) {
                  console.error("메시지 파싱 오류:", error);
                }
              }
              //러닝 데이터 받음
              else {
                console.log("handle runningData");
                // JSON 형식만 추출하기
                const jsonStartIndex = message.data.indexOf("{");
                const jsonEndIndex = message.data.lastIndexOf("}");
                if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
                  const jsonString = message.data.substring(
                    jsonStartIndex,
                    jsonEndIndex + 1
                  );
                  const parsedData = JSON.parse(jsonString); // JSON 부분만 파싱

                  console.log(
                    "워치 데이터 응답 수신:",
                    JSON.stringify(parsedData)
                  );
                  // setPace(parsedData.pace);
                  // setElapsedTime(parsedData.time);
                  // setRunningDistance(parsedData.runningDistance);
                  setHeartRate(parsedData.heartRate);
                  // setWatchData((prev) => [
                  //   ...prev,
                  //   {
                  //     latitude: parsedData.latitude,
                  //     longitude: parsedData.longitude,
                  //   },
                  // ]);
                }
              }
            } catch (error) {
              console.error("Error processing message:", error);
            }
          }
          //받은 데이터에 대한 세팅
        };
      }
      // 워치 연동이 안되었을 때
      else {
        console.log("워치 연동 안된 상태로 달리기");

        kafkaWs.onmessage = (message) => {
          console.log("서버로부터 메시지 수신:", message.data);

          //연결 응답이 올 경우 console.log에 찍기
          if (message.data.startsWith("CONNECTED")) {
            console.log("STOMP 연결 성공!");

            //stomp에 연결된 경우 종료 sub 구독하고 있기
            const subscribeFrame = `SUBSCRIBE\nid:sub-1\ndestination:/sub/running/${runningData.current.recordId}/end\n\n\0`;
            kafkaWs.send(subscribeFrame);
            console.log("종료 구독 ", subscribeFrame);
          } else {
            try {
              const parsedMessage = message.data.trim(); // 메시지 데이터를 정리
              console.log("Received message:", parsedMessage);

              // 메시지에서 destination을 추출 (메시지 포맷에 맞게 처리)
              const destinationMatch =
                parsedMessage.match(/destination:(.*)\n/);
              if (!destinationMatch) {
                console.warn("No destination found in the message");
                return;
              }

              const destination = destinationMatch[1]; // destination 값 추출
              console.log("Destination:", destination);

              // destination 값에 따라 다른 로직 실행
              if (destination.endsWith("/end")) {
                console.log("Handling /end destination logic");
                try {
                  // JSON 형식만 추출하기
                  const jsonStartIndex = message.data.indexOf("{");
                  const jsonEndIndex = message.data.lastIndexOf("}");
                  if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
                    const jsonString = message.data.substring(
                      jsonStartIndex,
                      jsonEndIndex + 1
                    );
                    const parsedData = JSON.parse(jsonString); // JSON 부분만 파싱

                    if (parsedData.status === "end") {
                      console.log(
                        "종료 응답 수신:",
                        JSON.stringify(parsedData)
                      );

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
                    }
                  } else {
                    console.error("유효한 JSON 형식이 포함되지 않음.");
                  }
                } catch (error) {
                  console.error("메시지 파싱 오류:", error);
                }
              } else {
                console.log("Unknown destination, handling default case");
                // 기타 처리 로직
              }
            } catch (error) {
              console.error("Error processing message:", error);
            }
          }
        };
      }
      kafkaWs.onclose = () => {
        console.log("WebSocket 연결이 종료되었습니다.");
      };

      kafkaWs.onerror = (error) => {
        console.error("WebSocket 오류:", error);
      };

      kafkaStompClientRef.current = kafkaWs;

      return () => {
        kafkaWs.close(); // 컴포넌트 언마운트 시 WebSocket 연결 해제
      };
    }
  }, [recordId]);

  //4.결과 데이터가 변경이 되면 종료를 의미하기에 종료페이지로 이동
  useEffect(() => {
    if (resultData.id) {
      navigation.navigate("RunResult", {
        resultData: resultData,
        mode: mode,
        recordId: runningData.current.recordId,
      });
    }
  }, [resultData]);

  //바뀐 측정값 바로 적용시켜주기
  useEffect(() => {
    console.log("변경된 값 : ", elapsedTime, pace, runningDistance);
    runningData.current.time = elapsedTime;
    runningData.current.pace = pace;
    runningData.current.runningDistance = runningDistance;
    console.log("Updated runningData:", runningData.current);
  }, [elapsedTime, pace, runningDistance]);

  //위치가 바뀔 떄마다 정보 업데이트하기
  useEffect(() => {
    setCurrentLocation(location);
  }, [location]);

  return (
    <>
      {showLoading ? (
        <LoadingModal />
      ) : (
        <View style={{ flex: 1 }}>
          {running && !showStartModal && (
            <Top>
              <StopBtn
                onPress={() => {
                  if (!showStopModal) {
                    setShowStopModal(true);
                    setRunStart(false);
                  }
                }}
              >
                {!showStopModal && (
                  <FontAwesomeIcon icon={faPause} color="white" size={25} />
                )}
                {showStopModal && (
                  <FontAwesomeIcon icon={faPlay} color="white" size={25} />
                )}
              </StopBtn>
              <Timer
                elapsedTime={elapsedTime} // 경과시간
                connectedWatch={connectedWatch} //워치연동여부 - 연동된 경우엔 시간을 앱에서 계산하지않음
                showStopModal={showStopModal} //종료모달이 열려있으면 시간 카운팅 x
                runStart={runStart} // 달리기 시작
                setElapsedTime={setElapsedTime} // 경과시간 업데이트 함수
              />
            </Top>
          )}
          <Map
            showLoading={showLoading}
            connectedWatch={connectedWatch} //워치연동여부
            showStartModal={showStartModal} //시작모달 열림 여부
            setShowStartModal={setShowStartModal}
            runStart={runStart}
            setRunningDistance={setRunningDistance}
            mode={mode}
            running={running}
            onLocationChange={handleUserLocationChange}
            currentLocation={currentLocation}
          />
          {running && !showStartModal && (
            <Bottom>
              <RunInfo>
                <RunInfoCol style={{ flex: 1 }}>
                  <GoalDonutChart
                    connectedWatch={connectedWatch}
                    currentDistance={parseFloat(runningDistance)}
                    goalDistance={0}
                    mode={mode}
                  />
                </RunInfoCol>
                <RunInfoCol style={{ flex: 2, paddingLeft: 21 }}>
                  <Pace
                    connectedWatch={connectedWatch}
                    mode={mode}
                    elapsedTime={elapsedTime}
                    currentDistance={runningDistance}
                    setPace={setPace}
                    pace={pace}
                  />
                  <HeartBeat heartRate={heartRate} mode={mode} />
                </RunInfoCol>
              </RunInfo>
            </Bottom>
          )}
          {showStartModal && (
            <RunStartModal
              getRoomId={getRoomId}
              connectedWatch={connectedWatch}
              showStartModal={showStartModal}
              setShowStartModal={setShowStartModal}
              setRunStart={setRunStart}
              setRunning={setRunning}
            />
          )}
          {showStopModal && (
            <DefaultModal
              isVisible={showStopModal}
              content={StopModalContent}
            />
          )}
        </View>
      )}
    </>
  );
};

export default RunningAlone;
