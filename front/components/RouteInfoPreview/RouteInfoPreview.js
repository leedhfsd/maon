import { SafeAreaView, View, Text, Button, Image } from "react-native";
import { useFontsLoaded } from "../../utils/fontContext";
import { Col, Row, Wrapper, styles } from "./RouteInfoPreviewStyle";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faLocationDot,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { faBookmark as faBookmarkSolid } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as faBookmarkRegular } from "@fortawesome/free-regular-svg-icons";
import { faCalendarDays } from "@fortawesome/pro-duotone-svg-icons";
import color from "../../styles/colors";
import MapView, { Marker, Polyline } from "react-native-maps";
import MapStyle from "../../components/Map/MapStyle";
import { useEffect } from "react";
const RouteInfoPreview = ({ navigation, data, mode, moveDetail }) => {
  const fontsLoaded = useFontsLoaded();

  if (!fontsLoaded) {
    return null; // 폰트 로드 전까지 렌더링 방지
  }

  const latLongArray = data.track.coordinates.map((point) => ({
    latitude: point.x,
    longitude: point.y,
  }));

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
              latitude: latLongArray[0].latitude,
              longitude: latLongArray[0].longitude,
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
            <Text style={[styles.SmallText]}>{data.startPoint}</Text>
          </View>

          {true ? (
            <FontAwesomeIcon size={16} icon={faBookmarkSolid} />
          ) : (
            <FontAwesomeIcon size={16} icon={faBookmarkRegular} />
          )}
        </Row>
        <Row>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.LargeText]}>
            {data.routeName}
          </Text>
        </Row>
        <Row>
          <Text style={[styles.LargeText]}>{data.distance}Km</Text>
        </Row>
        <Row>
          <FontAwesomeIcon
            icon={faCalendarDays}
            color={color.grape_fruit}
            secondaryColor={color.light_mandarin}
            swapOpacity={true} // 필요에 따라 두 색상 간의 불투명도 조정
          />

          <Text style={[styles.SmallText]}>
            등록일:
            {new Date(data.createdAt)
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
          <FontAwesomeIcon color={color.grape_fruit} icon={faPenToSquare} />
          <Text style={[styles.SmallText]}>작성자: {data.writerName}</Text>
        </Row>
      </Col>
    </Wrapper>
  );
};
export default RouteInfoPreview;
