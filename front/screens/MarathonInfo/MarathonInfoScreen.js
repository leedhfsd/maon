import { SafeAreaView, View, Text, Button, FlatList } from "react-native";
import { useFontsLoaded } from "../../utils/fontContext";
import { useEffect, useState } from "react";
import { apiClient } from "../../customAxios";

import MarathonInfoSearchBar from "../../components/MarathonInfoSearchBar/MarathonInfoSearchBar";
import { Bottom, Top, Wrapper } from "../SelectRunRoute/SelectRunRouteStyle";

import MarathonInfoPreview from "../../components/MaraThonInfoPreview/MaraThonInfoPreview";
import InfoPreviewLoading from "../../components/InfoPreviewLoading/InfoPreviewLoading";
import useAuthStore from "./../../store/AuthStore";

const MarathonInfo = ({ navigation, route }) => {
  const { user } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [displayCount, setDisplayCount] = useState(10); // 한 번에 로드할 데이터 수
  const fontsLoaded = useFontsLoaded();
  const { mode } = route.params;
  const [allInfos, setAllInfos] = useState([]); // 전체 데이터를 저장할 상태

  if (!fontsLoaded) {
    return null; // 폰트 로드 전까지 렌더링 방지
  }

  const getMarathonInfo = async (
    year = new Date().getFullYear(),
    month = new Date().getMonth() + 1,
    area = 0,
    closed = false
  ) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post(
        `/tournament/tournament/getMarathon`,
        {
          year: year,
          month: month,
          area: area,
          closed: closed,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      setAllInfos(response.data.data); // 전체 데이터를 저장
    } catch (e) {
      console.log("get marathoninfo error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMarathonInfo();
  }, []);

  // 추가 데이터 로드
  const loadMoreData = () => {
    if (!isLoading && displayCount < allInfos.length) {
      setDisplayCount((prevCount) => prevCount + 10); // 10개씩 추가
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      <Wrapper>
        <Top>
          <MarathonInfoSearchBar
            searchType={"searchInfo"}
            searchFunc={(year, month, area, closed) => {
              setDisplayCount(10); // 새로운 검색 시 표시 개수 초기화
              getMarathonInfo(year, month, area, closed);
            }}
          />
        </Top>
        <Bottom>
          <FlatList
            data={allInfos.slice(0, displayCount)} // 필요한 데이터만 제공
            keyExtractor={(item) => item.uuid.toString()}
            renderItem={({ item }) => (
              <MarathonInfoPreview
                data={item}
                mode="searchInfo"
                navigation={navigation}
              />
            )}
            ListEmptyComponent={
              !isLoading && (
                <Text>검색 조건에 맞는 마라톤이 존재하지 않아요</Text>
              )
            }
            ListFooterComponent={
              isLoading && <InfoPreviewLoading /> // 로딩 표시
            }
            onEndReached={loadMoreData} // 스크롤 끝에서 추가 데이터 로드
            onEndReachedThreshold={0.5} // 추가 데이터 로드할 임계값
          />
        </Bottom>
      </Wrapper>
    </SafeAreaView>
  );
};

export default MarathonInfo;
