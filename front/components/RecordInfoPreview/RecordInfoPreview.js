import { SafeAreaView, View, Text, Button, Image } from "react-native";
import { useFontsLoaded } from "../../utils/fontContext";
import { Col, Row, Wrapper, styles } from "./RecordInfoPreviewStyles";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faLocationDot,
  faPenToSquare,
  faShoePrints,
} from "@fortawesome/free-solid-svg-icons";

import { faBookmark as faBookmarkSolid } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as faBookmarkRegular } from "@fortawesome/free-regular-svg-icons";
import { faCalendarDays } from "@fortawesome/pro-duotone-svg-icons";
import color from "../../styles/colors";
import MapView, { Marker, Polyline } from "react-native-maps";
import MapStyle from "../../components/Map/MapStyle";
import { useEffect } from "react";

const RecordInfoPreview = ({ navigation, data, mode, moveDetail }) => {
  const fontsLoaded = useFontsLoaded();

  useEffect(() => {
    // console.log("넘어온 데이터 확인용: ", data.recordedTrack)
  }, [])

  if (!fontsLoaded) {
    return null; // 폰트 로드 전까지 렌더링 방지
  }

  // const latLongArray = data.recordedTrack.coordinates.map((point) => ({
  //   latitude: point.x,
  //   longitude: point.y,
  // }));
  const latLongArray =
    data?.recordedTrack?.coordinates?.map((point) => ({
      latitude: point.x,
      longitude: point.y,
    })) || [];

  return (
    <Wrapper onPress={moveDetail}>
      <Col>
        <View style={{ flex: 1 }}>
          <MapView
            provider={MapView.PROVIDER_GOOGLE}
            customMapStyle={MapStyle}
            style={{
              flex: 1,
              alignSelf: "stretch",
              borderRadius: 20,
            }}
            scrollEnabled={false} // 지도 이동 비활성화
            zoomEnabled={false} // 줌인, 줌아웃 비활성화
            showsUserLocation={false}
            initialRegion={{
              latitude: latLongArray[0]?.latitude ||  35.205409,
              longitude: latLongArray[0]?.longitude || 126.811489,
              latitudeDelta: 0.003, // 줌 레벨 설정 (작을수록 줌 인)
              longitudeDelta: 0.003,
            }}>
            <Polyline
              coordinates={latLongArray}
              strokeColor={color.light_orange}
              strokeWidth={6}
            />
          </MapView>
        </View>
      </Col>
      <Col style={styles.secondCol}>
        <Row
          style={{
            marginTop: 5,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
          <View style={{ flexDirection: "row" }}>
            <FontAwesomeIcon icon={faLocationDot} color={color.red} />
            {data.startPoint&&<Text style={[styles.SmallText]}>
              {/* {data.startPoint} */}
              {(() => {
              const words = data.startPoint?.trim().split(/\s+/); // 연속된 공백 제거 후 단어 분리
              return words.length > 1 ? `${words[0]}, ${words[1]}` : words[0];
            })()}
            </Text>}
          </View>

          {/* {true ? (
            <FontAwesomeIcon size={16} icon={faBookmarkSolid} />
          ) : (
            <FontAwesomeIcon size={16} icon={faBookmarkRegular} />
          )} */}
        </Row>
        <Row>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.LargeText]}>
            {data.routeName || "미지정 코스"}
          </Text>
        </Row>
        <Row>
          <Text style={[styles.LargeText]}>{data.distance}Km</Text>
        </Row>
        <Row>
          {/* <FontAwesomeIcon color={color.grape_fruit} icon={faPenToSquare} /> */}
          <FontAwesomeIcon
              style={{ transform: [{ rotate: "270deg" }] }} // 270도 회전
              icon={faShoePrints}
              // size={25}
              color={color.light_orange}
            />
          <Text style={[styles.SmallText]}>평균 페이스: {data.averagePace}</Text>
        </Row>
        <Row>
          <FontAwesomeIcon
            icon={faCalendarDays}
            color={color.grape_fruit}
            secondaryColor={color.light_mandarin}
            swapOpacity={true} // 필요에 따라 두 색상 간의 불투명도 조정
          />

          <Text style={[styles.SmallText]}>
            등록일: {new Date(data.createdAt)
              .toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
              .replace(/\s/g, "")
              .replace(/\.$/, "")}
          </Text>
        </Row>
      </Col>
    </Wrapper>
  );
};
export default RecordInfoPreview;
