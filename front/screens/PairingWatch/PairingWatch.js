import { SafeAreaView, View, Text, ScrollView, Image } from "react-native";
import { useFontsLoaded } from "../../utils/fontContext";
import { useEffect, useRef, useState } from "react";
import { apiClient } from "../../customAxios";
import { Button, ButtonView, Title, styles } from "./PairingWatchStyle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAuthStore from "../../store/AuthStore";
import {
  savePairedWatch,
  fetchPairedWatch,
} from "../../utils/checkPairedWatch";

const PairingWatch = ({ navigation, route }) => {
  const { user } = useAuthStore();

  const [nickname, setNickname] = useState();
  const [id, setId] = useState();

  const [step, setStep] = useState(1);
  const [pairedWatch, setPairedWatch] = useState(false);
  const [pairingNumber, setPairingNumber] = useState(0);

  const pairingStompClientRef = useRef(null);

  const fontsLoaded = useFontsLoaded();
  if (!fontsLoaded) {
    return null; // 폰트 로드 전까지 렌더링 방지
  }

  useEffect(() => {
    // console.log("hello");
    const checkWatch = async () => {
      try {
        const storedPairedWatch = await fetchPairedWatch();
        if (storedPairedWatch === "true") {
          setPairedWatch(true);
        }
      } catch (error) {
        console.error("Error checking paired watch:", error);
      }
    };

    checkWatch(); // 비동기 함수 호출
    const checkNickname = async () => {
      const checkStorageNickname = await AsyncStorage.getItem("nickname");
      setNickname(checkStorageNickname);
      const checkStorageId = await AsyncStorage.getItem("id");
      setId(checkStorageId);
    };
    checkNickname();
  }, []);

  const changeStep = async () => {
    if (step === 1) {
      await pairing();
      setStep(2);
    }
  };

  // 페어링 진행
  const pairing = async () => {
    try {
      const generatedNumber = Math.floor(100000 + Math.random() * 900000);
      setPairingNumber(generatedNumber);

      const pairingWs = new WebSocket(
        "wss://k11c207.p.ssafy.io/maon/route/ws/location"
      );

      pairingWs.onopen = () => {
        console.log("페어링 용 WebSocket 연결 성공!");

        // STOMP CONNECT 프레임 직접 전송
        const connectFrame =
          "CONNECT\naccept-version:1.2,1.1,1.0\nhost:k11c207.p.ssafy.io\n\n\0";
        pairingWs.send(connectFrame);
      };

      pairingWs.onmessage = (message) => {
        console.log("페어링 서버로부터 메시지 수신:", message.data);

        if (message.data.startsWith("CONNECTED")) {
          console.log("페어링 STOMP 연결 성공!");

          // CONNECTED 후, 지정된 경로로 데이터 전송
          const destination = `/pub/connection/info/${generatedNumber}`;

          console.log("hello this is a id! : ", id);
          const payload = {
            memberId: id, // user 객체의 UUID 또는 기본 UUID
            memberNickname: nickname,
            timestamp: new Date().toISOString(), // ISO 형식의 timestamp
          };

          const sendFrame = `SEND\ndestination:${destination}\ncontent-type:application/json\n\n${JSON.stringify(
            payload
          )}\0`;

          pairingWs.send(sendFrame);
          console.log(`메시지가 ${destination} 경로로 전송되었습니다.`);

          // SUBSCRIBE 프레임 전송
          const subscribeDestination = `/sub/connection/${generatedNumber}`;
          const subscribeFrame = `SUBSCRIBE\nid:sub-${generatedNumber}\ndestination:${subscribeDestination}\n\n\0`;

          pairingWs.send(subscribeFrame);
          console.log(`구독이 ${subscribeDestination} 경로로 추가되었습니다.`);
        } else {
          console.log("연동 응답이 와버려");
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

              if (parsedData.type === "CONNECTION_SUCCEED") {
                console.log("연동 응답 수신:", JSON.stringify(parsedData));
                //유저 정보에 넣기
                savePairedWatch();
                setStep(3);
              }
            } else {
              console.error("유효한 JSON 형식이 포함되지 않음.");
            }
          } catch (error) {
            console.error("메시지 파싱 오류:", error);
          }
        }
      };

      pairingWs.onclose = () => {
        console.log("페어링 용 WebSocket 연결이 종료되었습니다.");
      };

      pairingWs.onerror = (error) => {
        console.error("페어링 용 WebSocket 오류:", error);
      };

      pairingStompClientRef.current = pairingWs;
    } catch (e) {
      console.log("pairing error : ", e);
    }
  };

  useEffect(() => {
    return () => {
      if (pairingStompClientRef.current) pairingStompClientRef.current.close(); // 컴포넌트 언마운트 시 WebSocket 연결 해제
    };
  }, []);

  const goHome = () => {
    navigation.navigate("Home");
  };

  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 50,
        }}>
        {step === 1 &&
          (pairedWatch ? (
            <View>
              <Title
                style={[
                  styles.BoldFont,
                ]}>{`연동된 워치가 존재합니다.\n새 워치를 연동하시겠습니까?`}</Title>
              <ButtonView>
                <Button
                  onPress={() => {
                    goHome();
                  }}>
                  <View>
                    <Text style={[styles.buttonText]}>취소</Text>
                  </View>
                </Button>
                <Button
                  onPress={() => {
                    changeStep();
                  }}>
                  <View>
                    <Text style={[styles.buttonText]}>확인</Text>
                  </View>
                </Button>
              </ButtonView>
            </View>
          ) : (
            <View>
              <Title style={[styles.BoldFont]}>워치를 연동하시겠습니까?</Title>
              <ButtonView>
                <Button
                  onPress={() => {
                    goHome();
                  }}>
                  <View>
                    <Text style={[styles.buttonText]}>취소</Text>
                  </View>
                </Button>
                <Button>
                  <View>
                    <Text
                      style={[styles.buttonText]}
                      onPress={() => {
                        changeStep();
                      }}>
                      확인
                    </Text>
                  </View>
                </Button>
              </ButtonView>
            </View>
          ))}
        {step === 2 && (
          <View>
            <Title style={[styles.BoldFont]}>
              {`연동할 워치에서 앱을 실행해\n아래의 PIN번호를 입력해주세요`}
            </Title>
            <Title style={[styles.BoldFont]}>{pairingNumber}</Title>
          </View>
        )}
        {step === 3 && (
          <View>
            <Title style={[styles.BoldFont]}>{`연동이 완료되었습니다!`}</Title>
            <ButtonView>
              <Button
                onPress={() => {
                  goHome();
                }}>
                <View>
                  <Text style={[styles.buttonText]}>확인</Text>
                </View>
              </Button>
            </ButtonView>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default PairingWatch;
