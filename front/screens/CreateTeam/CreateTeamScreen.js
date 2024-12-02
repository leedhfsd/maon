import {
  Wapper,
  Container,
  ListContainer,
  TitleArea,
  TitleText,
  SearchBarArea,
  ListView,
  UserInfoBoxView,
  BackBtn,
  FollowerBtn,
  FollowerBtnText,
} from "./CreateTeamScreenStyles";
import { FlatList } from "react-native";
import HeaderNavigation from "../../components/HeaderNavigation/HeaderNavigation";
import SearchBar from "../../components/SearchBar/SearchBar";
import UserInfoBox from "../../components/Button/UserInfoBox/UserInfoBox";
import { useState, useEffect } from "react";
import DefaultModal from "../../components/Modal/DefaultModal/DefaultModal";
import {
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions } from "react-native";
import { apiClient } from "../../customAxios";
import useAuthStore from "./../../store/AuthStore";
import color from "../../styles/colors";
import fonts from "../../styles/fonts";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

// import testImg from './../../assets/images/testProfile2.jpg'
// import testImg1 from "./../../assets/images/testProfile1.jpg"
// import testImg2 from "./../../assets/images/testProfile.jpg"

const testImg = require("./../../assets/images/testProfile2.jpg");
const testImg1 = require("./../../assets/images/testProfile1.jpg");
const testImg2 = require("./../../assets/images/testProfile.jpg");

const testMyInfo2 = {
  marathonList: {
    "무안 마라톤": {
      teamCode: "이미 참여중인 팀 명",
    },
  },
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
  // {
  // userNickName: '참여중인 팀 있음',
  // userProfileImg: testImg1,
  // marathonName: '무안 마라톤',
  // level: 5,
  // teamCode: 1,
  // userStatus: true, // 참여중인 팀 있음
  // }, // 백 쪽에서 팀에 참여중이지 않은 사람 리스트만 뽑아서 보내주면 될듯
  {
    userNickName: "치즈 덕덕",
    userProfileImg: testImg2,
    marathonName: "무안 마라톤",
    level: 2,
    teamCode: null,
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
    teamCode: null,
    userStatus: "show-detail", // 참여중인 팀 없음
  },
];

const CreateTeamScreen = ({ navigation, route }) => {
  const { user } = useAuthStore();
  const { teamId, reloadGetMarathonDetailInfo, tournamentId, paramsLatitude, paramsLongitude } = route.params;

  const [searchName, setSearchName] = useState(""); // 사용자가 입력할 값을 담을 state변수

  const [recipientIndex, setRecipientIndex] = useState(null); // 초기값을 null로 설정
  const [showSendRequestModal, setShowSendRequestModal] = useState(false); // 초대 신청 모달
  const [showCancelRequestModal, setShowCancelRequestModal] = useState(false); // 초대 취소 모달
  const [showLeaveTeamModal, setShowLeaveTeamModal] = useState(false); // 팀 탈퇴 모달
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]); // 필터링된 사용자 리스트

  useEffect(() => {
    inviteableMemberLoad(); // 초대 가능 멤버 전체 리스트 조회

    // setMembers(testUsers)
    // setFilteredMembers(testUsers); // 초기 필터링된 사용자 리스트 설정
  }, []);

  useEffect(() => {
    // searchName이 변경될 때마다 필터링
    const filtered = members.filter(
      (member) => member.nickname && member.nickname.includes(searchName) // nickname 필드로 필터링
    );
    setFilteredMembers(filtered);
    console.log("초대 가능한 멤버: ", members);
  }, [searchName, members]);

  // 팀 참여 요청
  const sendRequestContent =
    recipientIndex !== null &&
    recipientIndex >= 0 &&
    recipientIndex < members.length
      ? {
          text: `'${filteredMembers[recipientIndex].nickname}'님에게\n요청을 보내겠습니까?`,
          subText: "",
          buttons: [
            {
              title: "취소",
              onPress: () => {
                cancelBtn();
                // setShowSendRequestModal(false);
              },
            },
            {
              title: "신청",
              onPress: () => {
                sendRequest();
              },
            },
          ],
        }
      : null;

  const cancelRequestContent =
    recipientIndex !== null &&
    recipientIndex >= 0 &&
    recipientIndex < members.length
      ? {
          text: `'${filteredMembers[recipientIndex].nickname}'님\n초대를 취소하시겠습니까?`,
          subText: "",
          buttons: [
            {
              title: "아니오",
              onPress: () => {
                setRecipientIndex(null);
                setShowCancelRequestModal(false);
              },
            },
            {
              title: "예",
              onPress: () => {
                leaveTeam();
              },
            },
          ],
        }
      : null;

  const leaveTeamContent = {
          text: `팀을 탈퇴하시겠습니까?`,
          subText: "",
          buttons: [
            {
              title: "아니오",
              onPress: () => {
                setShowLeaveTeamModal(false);
              },
            },
            {
              title: "예",
              onPress: () => {
                leaveTeam();
              },
            },
          ],
        }

  const clickRequestBtn = (index) => {
    // 요청 받는 사람 인덱스 recipientIndex에 담고
    console.log("요청 받은 사람 인덱스: ", index);
    setRecipientIndex(index);
    // 모달 띄우기
    setShowSendRequestModal(true);
  };

  const clickCancelRequestBtn = (index) => {
    // 요청 취소할 사람 인덱스 recipientIndex에 담고
    console.log("요청 취소할 사람 인덱스: ", index);
    setRecipientIndex(index);
    // 모달 띄우기
    setShowCancelRequestModal(true);
  };

  // 모달에서 신청 버튼 눌렀을 경우,
  const sendRequest = async () => {
    // 실제로 요청 보내기
    console.log(
      "요청 보낼 사람 id: ",
      filteredMembers[recipientIndex].id,
      "팀 id: ",
      teamId
    );
    try {
      const response = await apiClient.post(
        `/tournament/team/invite`,
        {
          teamId: teamId,
          inviteeId: filteredMembers[recipientIndex].id,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${user.accessToken}`, // Authorization 헤더에 Bearer 토큰 추가
          },
        }
      );
      if (response.status === 200) {
        console.log("초대 신청 성공: ", response.data);
        inviteableMemberLoad(); // 초대 가능 멤버 전체 리스트 조회

        // 모달 닫기
        setShowSendRequestModal(false);
      }
    } catch (error) {
      console.log("초대 신청 에러 발생: ", error);
    }
  };

  // 초대 모달-취소 버튼
  const cancelBtn = () => {
    // 수신자 state변수 초기화
    setRecipientIndex(null);

    // 모달 닫기
    setShowSendRequestModal(false);
  };

  // 초대 취소 버튼
  const cancelRequest = async () => {
    // console.log("초대 취소할 사람: ", filteredMembers[recipientIndex], "내 팀 id: ", teamId)
    // console.log("내 accessToken: ", user.accessToken)
    try {
      const response = await apiClient.post(
        `/tournament/team/invite/cancel`,
        {
          inviteeId: filteredMembers[recipientIndex].id,
          teamId: teamId,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${user.accessToken}`, // Authorization 헤더에 Bearer 토큰 추가
          },
        }
      );
      console.log("초대 취소 성공: ", response.data);
      if (response.status === 200) {
        inviteableMemberLoad(); // 초대 가능 멤버 전체 리스트 재조회

        // 모달 닫기
        setShowCancelRequestModal(false);
      }
    } catch (error) {
      console.error("초대 취소 에러 발생: ", error);
    }
  };

  // 초대 가능한 사람 전체 조회
  const inviteableMemberLoad = async () => {
    console.log("팀 아이디", teamId);
    console.log();
    try {
      const response = await apiClient.post(
        `/tournament/team/invite/candidate`,
        {
          teamId: teamId,
          keyword: null,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${user.accessToken}`, // Authorization 헤더에 Bearer 토큰 추가
          },
        }
      );
      if (response.status === 200) {
        console.log("팀 초대 가능 목록 전체 조회 성공: ", response.data.data);
        const candidateList = response.data.data.candidateInfoList;
        setMembers(candidateList);
      }
    } catch (error) {
      console.error("팀 초대 가능 전체 목록 조회 에러: ", error);
    }
  };

  const leaveTeam = async () => {
    try{
      const response = await apiClient.post(
        `/tournament/team/leave/${teamId}`,
        {
          teamId: teamId
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${user.accessToken}`, // Authorization 헤더에 Bearer 토큰 추가
          },
        }
      );
      console.log("팀 탈퇴 성공: ", response.status)
      setShowLeaveTeamModal(false)
      reloadGetMarathonDetailInfo()
      navigation.navigate("MarathonInfoDetail", {uuid: tournamentId, paramsLatitude: paramsLatitude,paramsLongitude: paramsLongitude})
    } catch (error) {
      console.error("팀 탈퇴 에러 발생: ", error);
    }
  }

  return (
    <Wapper>
      {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView 
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled" // 스크롤 중에도 키보드가 사라지지 않도록 설정
          > */}
      <Container>
        <TitleArea>
          <View style={{flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between'}}>
            <TitleText>Team</TitleText>
            <TouchableOpacity
              onPress={() => setShowLeaveTeamModal(true)}
            >
              <Text style={{color: color.nav_orange, fontSize: 16, fontFamily: fonts.gMarketMedium}}>탈퇴하기</Text>
            </TouchableOpacity>
          </View>
        </TitleArea>
        <SearchBarArea>
          <SearchBar searchName={searchName} setSearchName={setSearchName} />
        </SearchBarArea>
      </Container>
      <ListContainer>
        <FlatList
          contentContainerStyle={{
            paddingHorizontal: screenWidth * 0.07,
            paddingBottom: screenHeight * 0.05,
          }}
          showsVerticalScrollIndicator={false} // 스크롤바 숨김
          data={filteredMembers}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <UserInfoBoxView key={index}>
              <UserInfoBox
                proImg={item.imageUrl}
                level={item.level}
                name={item.nickname}
                status={item.invited ? "수락대기" : "요청하기"}
                onPress={
                  item.invited
                    ? () => clickCancelRequestBtn(index)
                    : () => clickRequestBtn(index)
                }
              />
            </UserInfoBoxView>
          )}
        />
        {/* 상단 그라데이션 레이어 */}
        <LinearGradient
          colors={["rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 0)"]}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 55, // 그라데이션 영역의 높이 조절
          }}
        />
      </ListContainer>
      {/* <ListView>
                {
                  members.map((user, index) => (
                    <UserInfoBoxView key={index}>
                      <UserInfoBox proImg={user.userProfileImg} level={user.level} name={user.userNickName} status={user.userStatus} onPress={() => clickRequestBtn(index)} />
                    </UserInfoBoxView>
                  ))
                }
              </ListView> */}
      {/* </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback> */}
      {showSendRequestModal && (
        <DefaultModal
          isVisible={showSendRequestModal}
          content={sendRequestContent}
        />
      )}
      {showCancelRequestModal && (
        <DefaultModal
          isVisible={showCancelRequestModal}
          content={cancelRequestContent}
        />
      )}
      {showLeaveTeamModal && (
        <DefaultModal
          isVisible={showLeaveTeamModal}
          content={leaveTeamContent}
        />
      )}
    </Wapper>
  );
};

export default CreateTeamScreen;
