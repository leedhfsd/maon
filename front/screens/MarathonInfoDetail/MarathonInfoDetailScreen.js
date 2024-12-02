import {
  Wrapper,
  MapArea,
  BookmarkBtnArea,
  ContentArea,
  TitleArea,
  TitleText,
  DetailInfoArea,
  DetailInfoView,
  LineInfoView,
  LineIconTitleWrap,
  LineInfoTitleText,
  LineInfoText,
  BtnArea,
  HalfBtnContainer,
  BtnHalfArea,
  TeamTitleArea,
  TeamContainer,
  TeamTitleText,
  AddUserView,
  AddUserText,
  TeamListArea,
} from "./MarathonInfoDetailScreenStyles";
import { useState, useEffect } from "react";
import Svg, { Path } from "react-native-svg";
import BookmarkBtn from "../../components/Button/BookmarkBtn/BookmarkBtn";
import MarathonInfoDetailIcon from "../../components/MarathonInfoDetailIcon/MarathonInfoDetailIcon";
import RoundBtn from "../../components/Button/RoundBtn/RoundBtn";
import SelectModal from "../../components/Modal/SelectModal/SelectModal";
import MarathonDetailRoundBtn from "../../components/Button/MarathonDetailRoundBtn/MarathonDetailRoundBtn";
import UserInfoBox from "../../components/Button/UserInfoBox/UserInfoBox";
import { apiClient } from "../../customAxios";
import useAuthStore from "./../../store/AuthStore";
import {
  faLocationDot,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCalendarDays } from "@fortawesome/pro-duotone-svg-icons";
import MapView, { Marker } from "react-native-maps";
import MapStyle from "./../../components/Map/MapStyle";

import CreateTeamInputModal from "./../../components/Modal/CreateTeamInputModal/CreateTeamInputModal";

import {
  Text,
  View,
  Image,
  ScrollView,
  Linking,
  Alert,
  TouchableOpacity,
} from "react-native";
// import testImg from "./../../assets/images/testProfile2.jpg";
// import testImg1 from "./../../assets/images/testProfile1.jpg";
// import testImg2 from "./../../assets/images/testProfile.jpg";
import color from "../../styles/colors";

const testImg = require("./../../assets/images/testProfile2.jpg");
const testImg1 = require("./../../assets/images/testProfile1.jpg");
const testImg2 = require("./../../assets/images/testProfile.jpg");

// /////////////////// 테스트용
const testMyInfo = {
  marathonList: {
    "2024 국제 국민 마라톤": {
      teamCode: 1,
      // teamCode: null,
    },
  },
  bookmarkList: ["2024 국제 국민 마라톤"],
};

const testMyInfo2 = {
  marathonList: {},
  bookmarkList: [],
};

const testMarathonInfo = {
  name: "2024 국제 국민 마라톤",
  date: "2024-11-18",
  period: "2024.09.20 ~ 2024.09.25",
  place: "여의도 공원 문화의 마당",
  url: "http://국민마라톤.com",
  course: ["하프", "10km", "3.6km"],
  host: "무안군체육회, 전국 마라톤 협회",
  callNum: "061.0000.0000",
};

const testUsers = [
  {
    userNickName: "마미남",
    userProfileImg: testImg,
    marathonName: "무안 마라톤",
    level: 5,
    teamCode: null,
    userStatus: "요청하기", // 참여중인 팀 없음
  },
  {
    userNickName: "신라의 달밤",
    userProfileImg: testImg1,
    marathonName: "무안 마라톤",
    level: 3,
    teamCode: null,
    userStatus: "요청하기", // 참여중인 팀 없음
  },
  {
    userNickName: "참여중인 팀 있음-우리팀",
    userProfileImg: testImg1,
    marathonName: "무안 마라톤",
    level: 5,
    teamCode: 1,
    userStatus: true, // 참여중인 팀 있음
  }, // 백 쪽에서 팀에 참여중이지 않은 사람 리스트만 뽑아서 보내주면 될듯
  {
    userNickName: "치즈 덕덕-우리팀",
    userProfileImg: testImg2,
    marathonName: "무안 마라톤",
    level: 2,
    teamCode: 1,
    userStatus: "요청하기", // 참여중인 팀 없음
  },
  {
    userNickName: "치즈 덕덕2",
    userProfileImg: testImg2,
    marathonName: "무안 마라톤",
    level: 5,
    teamCode: null,
    userStatus: "수락대기", // 참여중인 팀 없음
  },
  {
    userNickName: "우리 팀",
    userProfileImg: testImg,
    marathonName: "무안 마라톤",
    level: 5,
    teamCode: 1,
    userStatus: "show-detail", // 참여중인 팀 없음
  },
];
// ///////////////////

const MarathonInfoDetailScreen = ({ navigation, route }) => {
  const { uuid, paramsLatitude, paramsLongitude } = route.params;
  const { user } = useAuthStore();
  const [marathonInfo, setMarathonInfo] = useState({
    uuid: "", // 대회 uuid
    categories: "", // 종목 종류(리스트)
    closed: "", // 신청 가능한가
    hasTeam: "", // 팀에 속해있는가
    tournamentDayEnd: "",
    tournamentDayStart: "",
    location: "",
    homepage: "",
    host: "",
    imageUrl: "",
    latitude: "",
    longitude: "",
    participated: "", // 이 마라톤을 신청했는가
    receiptEnd: "",
    receiptStart: "",
    teamId: "",
    teamMembers: "",
    title: "",
    inquiry: "", // 문의처
    bookmarked: "", // true:북마크했음 false:북마크안함
  }); // 마라톤 디테일 정보 조회를 통해 받아온 마라톤 정보
  const [myMarathonInfo, setMyMarathonInfo] = useState(testMyInfo);
  const [isActivated, setIsActived] = useState(false); // 북마크 여부
  const [showSelectCourseModal, setShowSelectCourseModal] = useState(false); // 모달
  const [runType, setRunType] = useState(""); // 모달에서 선택한 종목

  const [marathonName, setMarathonName] = useState(""); // 마라톤 이름
  const [marathonUuid, setMarathonUuid] = useState(""); // 마라톤 uuid
  const [marathonDate, setMarathonDate] = useState(""); // 대회 일시
  const [marathonFormatDate, setMarathonFormatDate] = useState(""); // 대회 일시 양식 변화
  const [marathonPeriod, setMarathonPeriod] = useState(""); // 접수 기간
  const [marathonPeriodEndDate, setMarathonPeriodEndDate] = useState(""); // 접수 마감일
  const [marathonPlace, setMarathonPlace] = useState(""); // 대회 장소
  const [marathonUrl, setMarathonUrl] = useState(""); // 홈페이지
  const [marathonCourse, setMarathonCourse] = useState([]); // 종목 종류
  const [marathonHost, setMarathonHost] = useState(""); // 주최
  const [marathonCallNum, setMarathonCallNum] = useState(""); // 문의 번호

  const [dDay, setDDay] = useState(null); // 마라톤 시작 디데이
  const [entryEndDDay, setEntryEndDDay] = useState(null); // 마라톤 접수 마감일 디데이
  const [showWarning, setShowWarning] = useState(false); // 경고 메시지 표시 상태

  const [latitude, setLatitude] = useState(paramsLatitude); // 예: 서울의 위도 값
  const [longitude, setLongitude] = useState(paramsLongitude); // 예: 서울의 경도 값
  const [bookmarked, setBookmarked] = useState(false); // 북마크 여부

  const [participated, setParticipated] = useState(false); // 참가 신청 여부

  const [teamMemberList, setTeamMemberList] = useState([]); // 팀원들
  const [myTeamCode, setMyTeamCode] = useState(""); // 내 팀 코드

  const [addModal, setAddModal] = useState(false);
  const [teamName, setTeamName] = useState("");

  // 코스 선택 모달 내용
  // 코스 선택 모달 내용
  const [selectCourseModalContent, setSelectCourseModalContent] = useState({
    text: `참가 종목을 선택하세요.`,
    subText: "",
    buttons: [
      {
        title: "취소",
        onPress: () => {
          setShowSelectCourseModal(false);
        },
      },
      {
        title: "신청",
        onPress: () => {
          // navigation.navigate("MarathonEntryForm", { memberId: user.id, tournamentCategory: runType, tournamentId: marathonInfo.tournamentId, teamId: marathonInfo.teamId})
          // console.log("정보 확인용:", selectCourseModalContent);
          entryMarathon();
        },
      },
    ],
    item: [], // 초기 상태
  });

  useEffect(() => {
    // 마라톤 상세 정보 조회
    getMarathonDetailInfo();

    setMarathonUuid(uuid);
  }, []);

  useEffect(() => {
    // 대회 일시 양식 맞춤
    if (marathonInfo.tournamentDayStart) {
      // 날짜 부분만 추출하고 '-'를 '.'로 변환
      const formattedDate = marathonInfo.tournamentDayStart
        .split("T")[0]
        .split("-")
        .join(".");
      setMarathonFormatDate(formattedDate);
      console.log("변경된 날짜:", formattedDate);
    }

    // 접수 기간 양식 맞춤
    if (marathonInfo.receiptStart && marathonInfo.receiptEnd) {
      // 시작일과 마감일을 각각 형식 변환
      const formattedStartDate = marathonInfo.receiptStart
        .split("T")[0]
        .split("-")
        .join(".");
      const formattedEndDate = marathonInfo.receiptEnd
        .split("T")[0]
        .split("-")
        .join(".");

      // 시작일과 마감일을 결합하여 "YYYY.MM.DD~YYYY.MM.DD" 형태로 저장
      setMarathonPeriod(`${formattedStartDate} ~ ${formattedEndDate}`);
      console.log("접수 기간:", `${formattedStartDate}~${formattedEndDate}`);
      setMarathonPeriodEndDate(marathonInfo.receiptEnd);
    }

    setMarathonName(marathonInfo.title);
    setMarathonDate(marathonInfo.tournamentDayStart);
    setMarathonPlace(marathonInfo.location);
    setMarathonUrl(marathonInfo.homepage);
    setMarathonCourse(marathonInfo.categories);
    setMarathonHost(marathonInfo.host);
    // setLatitude(marathonInfo.latitude)
    // setLongitude(marathonInfo.longitude)
    console.log(
      "마라톤 정보 조회 후 위/경도",
      marathonInfo.latitude,
      marathonInfo.longitude
    );
    setMarathonCallNum(marathonInfo.inquiry);
    console.log(marathonInfo.latitude, marathonInfo.longitude);
    setTeamMemberList(marathonInfo.teamMembers);

    setMyTeamCode(marathonInfo.teamId);
    console.log("팀 코드 확인용", marathonInfo.teamId);
    setParticipated(marathonInfo.participated); // 나중에 주석 풀기
    // setParticipated(true)

    setIsActived(marathonInfo.bookmarked); // 북마크 여부

    // // marathonCourse와 selectCourseModalContent를 함께 업데이트
    // const updatedCourse = marathonInfo.categories;
    // setMarathonCourse(updatedCourse);

    // // 코스 데이터가 있을 경우에만 selectCourseModalContent 업데이트
    // if (updatedCourse.length > 0) {
    //   setSelectCourseModalContent((prevContent) => ({
    //     ...prevContent,
    //     item: updatedCourse.map((course) => ({ label: course, value: course })),
    //   }));
    // }
  }, [marathonInfo]);

  console.log("선택 가능한 코스:", selectCourseModalContent.item); // 디버깅용

  // console.log('북마크 활성화 여부:',isActivated, myMarathonInfo)

  // 북마크 버튼 토글
  const toggleBookmark = async () => {
    console.log("북마크 api 요청 전 대회 아이디 확인용: ", marathonUuid);
    if (!isActivated) {
      try {
        const response = await apiClient.post(
          `/tournament/tournament/bookmark`,
          {
            tournamentId: marathonUuid,
          },
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${user.accessToken}`, // Authorization 헤더에 Bearer 토큰 추가
            },
          }
        );
        console.log("북마크 성공: ", response.status);
        setIsActived(true);
        getMarathonDetailInfo();
      } catch (error) {
        console.error("북마크 에러 발생: ", error);
      }
    } else {
      try {
        const response = await apiClient.post(
          `/tournament/tournament/bookmark/delete`,
          {
            tournamentId: marathonUuid,
          },
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${user.accessToken}`, // Authorization 헤더에 Bearer 토큰 추가
            },
          }
        );
        console.log("북마크 해제 성공: ", response.status);
        setIsActived(false);
        getMarathonDetailInfo();
      } catch (error) {
        console.error("북마크 해제 에러 발생: ", error);
      }
    }
    // const marathonName = testMarathonInfo.name;
    // setMyMarathonInfo((prevState) => {
    //   const isBookmarked = prevState.bookmarkList.includes(marathonName);
    //   return {
    //     ...prevState,
    //     bookmarkList: isBookmarked
    //       ? prevState.bookmarkList.filter((name) => name !== marathonName)
    //       : [...prevState.bookmarkList, marathonName],
    //   };
    // });
    // setIsActived((prev) => !prev); // 북마크 상태 토글
  };

  // 마라톤 대회 시작일 디데이
  useEffect(() => {
    const calculateDDay = () => {
      // 마라톤 날짜를 Date 객체로 변환
      const marathonDateObj = new Date(marathonDate); // 예시로 사용
      const currentDate = new Date(); // 현재 날짜

      // 두 날짜의 차이 (밀리초 단위)
      const timeDifference = marathonDateObj - currentDate;

      // 밀리초를 일 단위로 변환
      const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

      console.log("디데이 계산 확인용", dayDifference);
      // D-Day 값 업데이트
      setDDay(dayDifference);
    };

    calculateDDay(); // D-Day 계산 함수 호출
  }, [marathonDate]);

  // 마라톤 접수 마감일 디데이
  useEffect(() => {
    const calculateDDay = () => {
      // 마라톤 날짜를 Date 객체로 변환
      const marathonDateObj = new Date(marathonPeriodEndDate); // 예시로 사용
      const currentDate = new Date(); // 현재 날짜

      // 두 날짜의 차이 (밀리초 단위)
      const timeDifference = marathonDateObj - currentDate;

      // 밀리초를 일 단위로 변환
      const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

      console.log("디데이 계산 확인용", dayDifference);
      // D-Day 값 업데이트
      setEntryEndDDay(dayDifference);
    };

    calculateDDay(); // D-Day 계산 함수 호출
  }, [marathonPeriodEndDate]);

  // useEffect(() => {
  //   setMyMarathonInfo(testMyInfo);

  //   const maraName = testMarathonInfo.name;
  //   // 사용자의 북마크 목록에 해당 마라톤이 있는지 확인
  //   setIsActived(testMyInfo.bookmarkList.includes(maraName));

  //   setRunType(""); // 선택 타입 초기화

  //   // 날짜 형식을 'YYYY.MM.DD'로 변환
  //   const formattedDate = testMarathonInfo.date.split("-").join(".");
  //   setMarathonFormatDate(formattedDate);

  //   // isActived 초기값 확인용
  //   console.log(
  //     "isActived 초기값 확인용",
  //     testMyInfo.bookmarkList.includes(maraName)
  //   );
  //   setMarathonName(maraName);
  //   setMarathonDate(testMarathonInfo.date);
  //   setMarathonPeriod(testMarathonInfo.period);
  //   setMarathonPlace(testMarathonInfo.place);
  //   setMarathonUrl(testMarathonInfo.url);
  //   setMarathonCourse(testMarathonInfo.course);
  //   setMarathonHost(testMarathonInfo.host);
  //   setMarathonCallNum(testMarathonInfo.callNum);

  //   // setTeamMemberList(testUsers)
  //   // 나와 같은 팀인 팀원들 필터링해서 teamMemberList에 저장하기
  //   const filteredTeamMembers = testUsers.filter(
  //     (user) => user.teamCode === myTeamCode
  //   );
  //   setTeamMemberList(filteredTeamMembers);
  // }, []);

  // 팀 생성 및 인원 추가 버튼
  const createTeam = async () => {
    console.log("팀 이름 확인용:", teamName, "대회 uuid: ", marathonUuid);
    try {
      const response = await apiClient.post(
        `/tournament/team/create`,
        {
          name: teamName, // 팀 이름
          tournamentId: marathonUuid,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${user.accessToken}`, // Authorization 헤더에 Bearer 토큰 추가
          },
        }
      );
      if (response.status === 200) {
        console.log("팀 생성 성공: ", response.data.data);
        const teamId = response.data.data.teamId;
        setMyTeamCode(teamId);
        getMarathonDetailInfo(); // 마라톤 정보 재조회(신청, 팀 생성 여부에 따른 즉각적인 화면 반영을 위함)
        navigation.navigate("CreateTeam", {
          teamId: response.data.data.teamId,
          reloadGetMarathonDetailInfo: getMarathonDetailInfo,
          tournamentId: uuid,
          paramsLatitude: paramsLatitude,
          paramsLongitude: paramsLongitude,
        });
        setAddModal(false);
      }
    } catch (error) {
      console.error("팀 생성 에러 발생: ", error);
    }
  };

  // 코스선택 모달에서 신청 버튼- km정보 어떻게 담아서 넘길지 고민하기
  const entryMarathon = () => {
    // 필요한 값들이 모두 존재하는지 확인
    // if (!user?.id || !marathonInfo.title || !marathonInfo.tournamentId || !runType) {
    //   console.log("모든 데이터가 설정되지 않았습니다.");
    //   return;
    // }

    console.log("모달 신청 버튼 누름");
    console.log(
      user.id,
      runType,
      marathonInfo.tournamentId,
      marathonInfo.teamId,
      marathonInfo.title
    );
    navigation.navigate("MarathonEntryForm", {
      memberId: user.id,
      tournamentCategory: marathonCourse,
      tournamentId: marathonUuid,
      teamId: marathonInfo.teamId,
      marathonName: marathonInfo.title,
      reloadGetMarathonDetailInfo: getMarathonDetailInfo,
    });
  };
  // console.log('모달 신청 버튼 누름')
  // navigation.navigate("MarathonEntryForm", { memberId: user.id, tournamentCategory: runType, tournamentId: marathonInfo.tournamentId, teamId: marathonInfo.teamId, marathonName:marathonInfo.title})
  // console.log('selectCourseModalContent', selectCourseModalContent);
  // console.log(selectCourseModalContent.item);
  // console.log('runType', runType);
  // if (runType !== "") {
  //   navigation.navigate("MarathonEntryForm", { memberId: user.id, tournamentCategory: runType, tournamentId: marathonInfo.tournamentId, teamId: marathonInfo.teamId});
  // }
  // };

  // 시작일이 아닌데 시작 버튼을 눌렀을 경우
  const handleNotStartedWarning = () => {
    setShowWarning(true);
    setTimeout(() => setShowWarning(false), 2000); // 2초 후 경고 메시지 숨김
  };

  const getMarathonDetailInfo = async () => {
    if (!user.accessToken) {
      console.error("Access token is missing!");
      return;
    }
    // console.log(uuid)

    try {
      const response = await apiClient.get(
        `/tournament/tournament/getMarathon/detail/${uuid}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${user.accessToken}`, // Authorization 헤더에 Bearer 토큰 추가
          },
        }
      );
      // console.log('마라톤 상세정보 조회 성공: ', response.status);
      if (response.status === 200) {
        console.log("마라톤 상세정보 조회 성공: ", response.data.data);
        const getMarathonInfo = response.data.data;
        setMarathonInfo(getMarathonInfo);
      }
    } catch (error) {
      console.error("마라톤 상세정보 조회 에러 발생: ", error);
    }
  };

  // 홈페이지 url 터치 시 이동
  const handlePress = async () => {
    const supported = await Linking.canOpenURL(marathonUrl);
    if (supported) {
      // URL을 열 수 있는 경우 이동
      await Linking.openURL(marathonUrl);
    } else {
      // URL을 열 수 없는 경우 알림 표시
      Alert.alert("해당 URL을 열 수 없습니다.");
    }
  };

  return (
    <Wrapper>
      <ScrollView>
        {/* 지도 영역 */}
        <MapArea>
          {/* <Image
            // style={{height: '100%'}}
            source={testImg}
          /> */}
          <MapView
            provider={MapView.PROVIDER_GOOGLE}
            // customMapStyle={MapStyle}
            style={{
              height: 350,
              flex: 1,
              alignSelf: "stretch",
            }}
            // scrollEnabled={false} // 지도 이동 비활성화
            // zoomEnabled={false} // 줌인, 줌아웃 비활성화
            showsUserLocation={false}
            initialRegion={{
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0.005, // 줌 레벨 설정 (작을수록 줌 인)
              longitudeDelta: 0.005,
            }}>
            <Marker
              coordinate={{
                latitude: latitude,
                longitude: longitude,
              }}>
              <FontAwesomeIcon
                icon={faLocationDot}
                size={34}
                color={color.light_orange}
              />
            </Marker>
          </MapView>
          <BookmarkBtnArea>
            <BookmarkBtn
              text={"대회 북마크"}
              isActivated={isActivated}
              toggleBookmark={toggleBookmark}
            />
          </BookmarkBtnArea>
        </MapArea>

        <ContentArea>
          <TitleArea>
            {marathonName && <TitleText>{marathonName}</TitleText>}
          </TitleArea>
          <DetailInfoArea>
            <DetailInfoView>
              {marathonFormatDate && (
                <LineInfoView>
                  <View>
                    <LineIconTitleWrap>
                      <MarathonInfoDetailIcon iconName={"date"} />
                      <LineInfoTitleText>대회 일시:</LineInfoTitleText>
                    </LineIconTitleWrap>
                  </View>
                  <LineInfoText>{marathonFormatDate}</LineInfoText>
                </LineInfoView>
              )}
              {marathonPeriod && (
                <LineInfoView>
                  <View>
                    <LineIconTitleWrap>
                      <MarathonInfoDetailIcon iconName={"period"} />
                      <LineInfoTitleText>접수 기간:</LineInfoTitleText>
                    </LineIconTitleWrap>
                  </View>
                  <LineInfoText>{marathonPeriod}</LineInfoText>
                </LineInfoView>
              )}
              {marathonPlace && (
                <LineInfoView>
                  <View>
                    <LineIconTitleWrap>
                      <MarathonInfoDetailIcon iconName={"location"} />
                      <LineInfoTitleText>대회 장소:</LineInfoTitleText>
                    </LineIconTitleWrap>
                  </View>
                  <LineInfoText>{marathonPlace}</LineInfoText>
                </LineInfoView>
              )}
              {marathonUrl && (
                <LineInfoView>
                  <View>
                    <LineIconTitleWrap>
                      <MarathonInfoDetailIcon iconName={"url"} />
                      <LineInfoTitleText>홈페이지:</LineInfoTitleText>
                    </LineIconTitleWrap>
                  </View>
                  <LineInfoText
                    onPress={handlePress}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {marathonUrl}
                  </LineInfoText>
                </LineInfoView>
              )}
              {marathonCourse && (
                <LineInfoView>
                  <View>
                    <LineIconTitleWrap>
                      <MarathonInfoDetailIcon iconName={"course"} />
                      <LineInfoTitleText>대회 종목:</LineInfoTitleText>
                    </LineIconTitleWrap>
                  </View>
                  <LineInfoText>{marathonCourse.join(", ")}</LineInfoText>
                </LineInfoView>
              )}
              {marathonHost && (
                <LineInfoView>
                  <View>
                    <LineIconTitleWrap>
                      <MarathonInfoDetailIcon iconName={"host"} />
                      <LineInfoTitleText>주최:</LineInfoTitleText>
                    </LineIconTitleWrap>
                  </View>
                  <LineInfoText>{marathonHost}</LineInfoText>
                </LineInfoView>
              )}
              {marathonCallNum && (
                <LineInfoView>
                  <View>
                    <LineIconTitleWrap>
                      <MarathonInfoDetailIcon iconName={"callNum"} />
                      <LineInfoTitleText>문의:</LineInfoTitleText>
                    </LineIconTitleWrap>
                  </View>
                  <View>
                    <LineInfoText>{marathonCallNum}</LineInfoText>
                  </View>
                </LineInfoView>
              )}

              {/* 팀이 있을 경우 팀원 리스트 출력 */}
              {/* 유저가 참가 신청했다는 것도 조건으로 추가하기 */}
              {myTeamCode ? (
                <TeamContainer>
                  <TeamTitleArea>
                    <TeamTitleText>Team</TeamTitleText>
                    <AddUserView
                      onPress={() =>
                        navigation.navigate("CreateTeam", {
                          teamId: myTeamCode,
                          reloadGetMarathonDetailInfo: getMarathonDetailInfo,
                        })
                      }>
                      <AddUserText>인원추가</AddUserText>
                    </AddUserView>
                  </TeamTitleArea>

                  {/* 팀원들 */}
                  <TeamListArea>
                    {teamMemberList && teamMemberList.length > 0
                      ? teamMemberList.map((user, index) => (
                          <UserInfoBox
                            key={user.id || user.nickname || index} // 고유 key 제공
                            proImg={user.imageUrl}
                            level={user.level}
                            name={user.nickname}
                            status={"show-detail"}
                            onPress={() => console.log("사용자 디테일창")}
                          />
                        ))
                      : null}
                  </TeamListArea>
                </TeamContainer>
              ) : null}

              {/* 버튼 */}
              {participated ? (
                myTeamCode ? (
                  dDay >= 0 && (
                    <BtnArea>
                      <RoundBtn
                        text={dDay === 0 ? "시작하기" : `D - ${dDay}`}
                        onPress={
                          dDay === 0
                            ? () => console.log("시작하기 버튼 누름")
                            : handleNotStartedWarning
                        }
                      />
                      <View style={{ marginTop: 15, marginBottom: 30 }}>
                        {showWarning && (
                          <Text style={{ color: color.nav_orange }}>
                            아직 마라톤을 시작할 수 없습니다.
                          </Text>
                        )}
                      </View>
                    </BtnArea>
                  )
                ) : (
                  dDay >= 0 && (
                    <BtnArea>
                      <HalfBtnContainer>
                        <BtnHalfArea>
                          <MarathonDetailRoundBtn
                            text={"팀 생성"}
                            onPress={() => setAddModal(true)}
                          />
                        </BtnHalfArea>
                        <BtnHalfArea>
                          {/* 시작하기 눌렀을 때 어디로 넘어갈지 생각하기 */}
                          <MarathonDetailRoundBtn
                            text={dDay === 0 ? "시작하기" : `D - ${dDay}`}
                            backColor={"o_btn"}
                            onPress={
                              dDay === 0
                                ? () => {
                                    navigation.navigate("RunningWithRoute", {});
                                  }
                                : handleNotStartedWarning
                            }
                          />
                        </BtnHalfArea>
                      </HalfBtnContainer>
                      <View style={{ marginTop: 15, marginBottom: 30 }}>
                        {showWarning && (
                          <Text style={{ color: color.nav_orange }}>
                            아직 마라톤을 시작할 수 없습니다.
                          </Text>
                        )}
                      </View>
                    </BtnArea>
                  )
                )
              ) : (
                <BtnArea>
                  {marathonName && entryEndDDay >= 0 && (
                    <RoundBtn
                      text={"참가 신청하기"}
                      // onPress={() => setShowSelectCourseModal(true)}
                      onPress={entryMarathon}
                    />
                  )}
                </BtnArea>
              )}
            </DetailInfoView>
          </DetailInfoArea>
        </ContentArea>
      </ScrollView>
      {addModal && (
        <CreateTeamInputModal
          isVisible={addModal}
          textValue={teamName}
          setTextValue={setTeamName}
          content={{
            text: `팀 이름을 입력해주세요`,
            subText: "",
            buttons: [
              {
                title: "취소",
                onPress: () => {
                  setAddModal(false);
                },
              },
              {
                title: "생성",
                onPress: () => {
                  createTeam();
                  // addRoute();
                },
              },
            ],
          }}
        />
      )}
      {showSelectCourseModal && selectCourseModalContent.item.length > 0 && (
        <SelectModal
          isVisible={showSelectCourseModal}
          content={selectCourseModalContent}
          setRunType={setRunType}
        />
      )}
    </Wrapper>
  );
};

export default MarathonInfoDetailScreen;
