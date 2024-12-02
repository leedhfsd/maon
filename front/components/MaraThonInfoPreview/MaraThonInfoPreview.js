import { SafeAreaView, View, Text, Button, Image } from "react-native";
import { useFontsLoaded } from "../../utils/fontContext";
import {
  Col,
  Row,
  Wrapper,
  styles,
} from "../RouteInfoPreview/RouteInfoPreviewStyle";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faLocationDot,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { faCalendarDays } from "@fortawesome/pro-duotone-svg-icons";
import color from "../../styles/colors";
import fonts from "../../styles/fonts";
import { status } from "./MaraThonInfoPreviewStyle";
import moment from "moment";
import MapView, { Marker } from "react-native-maps";
import MapStyle from "../../components/Map/MapStyle";
const MaraThonInfoPreview = ({ navigation, data, mode }) => {
  const fontsLoaded = useFontsLoaded();

  if (!fontsLoaded) {
    return null; // 폰트 로드 전까지 렌더링 방지
  }

  const navigateDetailPage = () => {
    navigation.navigate("MarathonInfoDetail", { uuid: data.uuid, paramsLatitude: data.latitude, paramsLongitude: data.longitude });
  };
  return (
    <Wrapper
      onPress={() => {
        navigateDetailPage();
      }}
    >
      <Col>
        <View style={{ flex: 1 }}>
          {data.imageUrl ? (
            <Image source={require("../../assets/images/route.png")} />
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
                scrollEnabled={false} // 지도 이동 비활성화
                zoomEnabled={false} // 줌인, 줌아웃 비활성화
                showsUserLocation={false}
                initialRegion={{
                  latitude: data.latitude,
                  longitude: data.longitude,
                  latitudeDelta: 0.005, // 줌 레벨 설정 (작을수록 줌 인)
                  longitudeDelta: 0.005,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: data.latitude,
                    longitude: data.longitude,
                  }}
                >
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    size={34}
                    color={color.light_orange}
                  />
                </Marker>
              </MapView>
            </View>
          )}
          <View style={status.status}>
            {!data.closed ? (
              <Text style={status.ing}>접수중</Text>
            ) : (
              <Text style={status.end}>접수종료</Text>
            )}
          </View>
        </View>
      </Col>
      <Col style={styles.secondCol}>
        <Row style={{ marginTop: 5 }}>
          <FontAwesomeIcon icon={faLocationDot} color={color.red} />
          <Text style={[styles.SmallText]}>
            {(() => {
              const words = data.location.trim().split(/\s+/); // 연속된 공백 제거 후 단어 분리
              return words.length > 1 ? `${words[0]}, ${words[1]}` : words[0];
            })()}
          </Text>
        </Row>
        <Row>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.LargeText]}
          >
            {data.title}
          </Text>
        </Row>
        <Row>
          <Text style={[styles.LargeText]}>무료</Text>
        </Row>
        <Row>
          <FontAwesomeIcon
            icon={faCalendarDays}
            color={color.grape_fruit}
            secondaryColor={color.light_mandarin}
            swapOpacity={true} // 필요에 따라 두 색상 간의 불투명도 조정
          />

          <Text style={[styles.SmallText]}>
            {moment(data.tournamentDayStart).format("YYYY.MM.DD")}
          </Text>
        </Row>
        <Row>
          {data.categories.map((length, index) => {
            return (
              <View
                key={index}
                style={[
                  {
                    width: 22,
                    height: 22,
                    marginRight: 10,
                    borderRadius: 11,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor:
                      length == "Full"
                        ? color.grape_fruit
                        : length == "Half"
                        ? color.dark_mandarind
                        : length == "10km"
                        ? color.mandarin
                        : color.light_mandarin,
                  },
                ]}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "white",
                    fontFamily: fonts.gMarketBold,
                  }}
                >
                  {length.startsWith("10") ? "10" : length.charAt(0)}
                </Text>
              </View>
            );
          })}
        </Row>
      </Col>
    </Wrapper>
  );
};
export default MaraThonInfoPreview;
