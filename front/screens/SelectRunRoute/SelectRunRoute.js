import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  Button,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import MarathonInfoSearchBar from "../../components/MarathonInfoSearchBar/MarathonInfoSearchBar";
import { useFontsLoaded } from "../../utils/fontContext";
import { Bottom, List, Top, Wrapper } from "./SelectRunRouteStyle";
import { useEffect, useState } from "react";
import RouteInfoPreview from "../../components/RouteInfoPreview/RouteInfoPreview";
import { apiClient } from "../../customAxios";
import useAuthStore from "../../store/AuthStore";

const SelectRunRoute = ({ navigation, route }) => {
  const { user } = useAuthStore();
  const [info, setInfo] = useState([]);
  const fontsLoaded = useFontsLoaded();
  const { searchType, mode } = route.params;

  if (!fontsLoaded) {
    return null; // 폰트 로드 전까지 렌더링 방지
  }

  const getRouteList = async () => {
    //정보 받아오기
    try {
      const response = await apiClient.get(`/route/course/list`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${user.accessToken}`, // Authorization 헤더에 Bearer 토큰 추가
        },
      });
      setInfo(response.data.data);
    } catch (e) {
      console.log("get route list error: " + error);
    }
  };
  useEffect(() => {
    getRouteList();
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      <ScrollView>
        <Wrapper>
          <Top>
            <MarathonInfoSearchBar
              searchType={"run"}
              onPress={() => {
                alert("hello");
              }}
            />
          </Top>

          <Bottom>
            <List>
              {info.map((data) => (
                <RouteInfoPreview
                  data={data}
                  mode="searchInfo"
                  moveDetail={() => {
                    // routeId랑 같이 보내기

                    navigation.navigate("RouteDetail", {
                      routeId: data.routeId,
                      searchType: searchType,
                      mode: mode,
                      info: data,
                    });
                  }}
                />
              ))}
            </List>
          </Bottom>
        </Wrapper>
      </ScrollView>
    </SafeAreaView>
  );
};
export default SelectRunRoute;
