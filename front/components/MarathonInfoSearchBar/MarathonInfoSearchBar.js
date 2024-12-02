import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  Button,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { useState } from "react";
import { useFontsLoaded } from "../../utils/fontContext";
import {
  OptionTitle,
  SearchButton,
  Wrapper,
  Top,
  Middle,
  Bottom,
  SelectView,
  styles,
  pickerSelectStyles,
} from "./MarathonInfoSearchBarStyle";
import Slider from "@react-native-community/slider";
import RNPickerSelect from "react-native-picker-select";
import color from "../../styles/colors";
import { LinearGradient } from "expo-linear-gradient";
import RadioButton from "../RadioButton/RadioButton";

const MarathonInfoSearchBar = ({ mode, searchFunc, searchType }) => {
  const fontsLoaded = useFontsLoaded();
  const [routeType, setRouteType] = useState("");
  const [routeName, setRouteName] = useState("");
  const [year, setYear] = useState(2024);
  const [month, setMonth] = useState(0);
  const [region, setRegion] = useState(0);
  //루트 타입 선택 옵션
  const routeTypeOptions = [
    { label: "북마크한 코스", value: "bookmark" },
    { label: "나의 코스", value: "mine" },
    { label: "마라톤 코스", value: "marathon" },
    { label: "일반 코스", value: "general" },
  ];
  //신청 가능 마라톤 선택 옵션
  const [possible, setPossible] = useState(false);
  const years = [
    { label: "년도", value: new Date().getFullYear() },
    { label: "2024년", value: 2024 },
    { label: "2025년", value: 2025 },
    { label: "2026년", value: 2026 },
    { label: "2027년", value: 2027 },
    { label: "2028년", value: 2028 },
  ];
  const months = [
    { label: "월", value: 0 },
    { label: "1월", value: 1 },
    { label: "2월", value: 2 },
    { label: "3월", value: 3 },
    { label: "4월", value: 4 },
    { label: "5월", value: 5 },
    { label: "6월", value: 6 },
    { label: "7월", value: 7 },
    { label: "8월", value: 8 },
    { label: "9월", value: 9 },
    { label: "10월", value: 10 },
    { label: "11월", value: 11 },
    { label: "12월", value: 12 },
  ];
  const regions = [
    { label: "지역", value: 0 },
    { label: "강원도", value: 1 },
    { label: "경기도", value: 2 },
    { label: "경상남도", value: 3 },
    { label: "경상북도", value: 4 },
    { label: "광주광역시", value: 5 },
    { label: "서울특별시", value: 6 },
    { label: "세종특별자치시", value: 7 },
    { label: "울산광역시", value: 8 },
    { label: "인천광역시", value: 9 },
    { label: "전라남도", value: 11 },
    { label: "전라북도", value: 12 },
    { label: "제주특별자치도", value: 13 },
    { label: "충청남도", value: 14 },
    { label: "충청북도", value: 15 },
    { label: "대구광역시", value: 16 },
    { label: "부산광역시", value: 17 },
    { label: "대전광역시", value: 18 },
    { label: "해외", value: 20 },
  ];

  if (!fontsLoaded) {
    return null; // 폰트 로드 전까지 렌더링 방지
  }

  const [distance, setDistance] = useState(0); // 초기 슬라이더 값 설정
  return (
    <Wrapper style={styles.shadow}>
      <Top>
        <OptionTitle style={[{ marginBottom: searchType === "run" ? 0 : 10 }]}>
          {searchType == "run" ? `거리선택 ${distance}km` : "상세검색"}
        </OptionTitle>
        {searchType == "run" && (
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={43}
            step={1} // 1씩 증가/감소
            value={distance} // 현재 슬라이더 값
            onValueChange={(newValue) => setDistance(newValue)} // 값이 변경될 때 호출
            minimumTrackTintColor={color.light_orange} // 선택된 트랙 색상
            maximumTrackTintColor="#E0E0E0" // 선택되지 않은 트랙 색상
            thumbTintColor="transparent" // thumb 색상 투명으로 설정
          />
        )}
      </Top>
      {searchType == "run" && (
        <>
          <Middle>
            <OptionTitle>코스 선택</OptionTitle>
            <RadioButton
              options={routeTypeOptions}
              selectedOption={routeType}
              setSelectedOption={setRouteType}
            />
          </Middle>
          <Bottom>
            <TextInput
              style={styles.input}
              placeholder="코스명을 입력해주세요"
              value={routeName}
              onChangeText={setRouteName}
            />
            <LinearGradient
              colors={["#FF740E", "#FFA646"]} // 시작 색상과 끝 색상 설정
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradient}
            >
              <SearchButton
                onPress={() => {
                  onPress();
                }}
              >
                <Text style={styles.buttonText}>검색</Text>
              </SearchButton>
            </LinearGradient>
          </Bottom>
        </>
      )}
      {searchType == "searchInfo" && (
        <>
          <Middle style={{ paddingTop: 0, paddingBottom: 20 }}>
            <SelectView>
              <View style={styles.pickerContainer}>
                <RNPickerSelect
                  onValueChange={(value) => setYear(value)}
                  items={years}
                  value={year}
                  style={pickerSelectStyles}
                  placeholder={{}}
                  useNativeAndroidPickerStyle={false}
                />
              </View>

              <View style={[styles.pickerContainer, { marginHorizontal: 20 }]}>
                <RNPickerSelect
                  onValueChange={(value) => setMonth(value)}
                  items={months}
                  value={month}
                  style={pickerSelectStyles} // 커스텀 스타일 적용
                  placeholder={{}}
                  useNativeAndroidPickerStyle={false}
                />
              </View>

              <View style={styles.pickerContainer}>
                <RNPickerSelect
                  onValueChange={(value) => setRegion(value)}
                  items={regions}
                  value={region}
                  style={pickerSelectStyles} // 커스텀 스타일 적용
                  placeholder={{}}
                  useNativeAndroidPickerStyle={false}
                />
              </View>
            </SelectView>
          </Middle>

          <Bottom>
            <View style={{ flex: 4 }}>
              <RadioButton
                options={[{ label: "접수 가능한 마라톤", value: "true" }]}
                selectedOption={possible}
                setSelectedOption={setPossible}
              />
            </View>
            <SearchButton
              onPress={() => {
                searchFunc(year, month, region, possible);
              }}
            >
              <LinearGradient
                colors={["#FF740E", "#FFA646"]} // 시작 색상과 끝 색상 설정
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.gradient]}
              >
                <Text style={styles.buttonText}>검색</Text>
              </LinearGradient>
            </SearchButton>
          </Bottom>
        </>
      )}
    </Wrapper>
  );
};
export default MarathonInfoSearchBar;
