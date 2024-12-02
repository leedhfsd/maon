import {
  Wrapper,
  Container,
  TitleArea,
  TitleText,
  ContentArea,
  BtnArea,
} from "./MarathonEntryFormScreenStyles";
import {
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import InputBox from "../../components/InputBox/InputBox";
import RoundBtn from "../../components/Button/RoundBtn/RoundBtn";
import DefaultModal from "../../components/Modal/DefaultModal/DefaultModal";
import { useState, useEffect } from "react";
import { apiClient } from "../../customAxios";
import useAuthStore from "./../../store/AuthStore";
import RNPickerSelect from "react-native-picker-select";

const testMarathonName = "2024 국제 국민 마라톤";
const testUser = {
  userName: "김성은",
  userNickName: "히히",
  userPhoneNum: "01012340000",
  userEmail: "test@email.com",
  userBirth: "20011119",
  userAddress: "광주광역시 하남 산단 5번로 12-345",
  userGender: "female",
  userHeight: "162",
  userWeight: "1000",
};

const modalMessageMap = {
  OK: `마라톤 신청이\n완료되었습니다.`,
  CONFLICT: `이미 신청한 마라톤입니다.`,
  NOT_FOUND: `신청불가한 마라톤입니다.`,
};

const MarathonEntryFormScreen = ({ navigation, route }) => {
  const { user } = useAuthStore();
  const { memberId, tournamentCategory, tournamentId, teamId, marathonName, reloadGetMarathonDetailInfo } =
    route.params;
  console.log(memberId, tournamentCategory, tournamentId, teamId, marathonName);
  const [dateOfBirth, setDateOfBirth] = useState(""); // 생년월일 상태 관리
  const [phoneNumber, setPhoneNumber] = useState(""); // 전화번호 상태 관리
  const [name, setName] = useState(""); // 이름 상태관리
  const [email, setEmail] = useState(""); // 이메일 상태관리
  const [address, setAddress] = useState(""); // 주소 상태관리
  const [selectedGender, setSelectedGender] = useState(""); // 선택된 성별 상태 관리

  const [selectRunType, setSelectRunType] = useState(""); // 참가 종목 상태 관리

  const [userInfo, setUserInfo] = useState({
    nickname: "",
    height: "",
    weight: "",
    name: "",
    phoneNumber: "",
    email: "",
    address: "",
    birthDate: "",
    gender: "",
    imageUrl: "",
  });

  const [showEntryModal, setShowEntryModal] = useState(false);

  const entryModalContent = {
    text: `마라톤 신청이\n완료되었습니다.`,
    subText: "",
    buttons: [
      {
        title: "확인",
        onPress: () => {
          reloadGetMarathonDetailInfo()
          setShowEntryModal(false);
          navigation.navigate("MarathonInfoDetail", { uuid: tournamentId });
          // navigation.navigate("Home") // 나중에 디테일 화면으로 돌아가도록 바꾸기
        },
      },
    ],
  };

  console.log("선택한 마라톤 종목:", selectRunType);

  // Picker에 사용할 아이템 배열 생성
  const runTypeOptions = tournamentCategory.map((item) => ({
    label: item,
    value: item,
  }));

  const clickEntryBtn = async () => {
    const requestBody = {
      memberId: user.uuid,
      tournamentCategory : selectRunType,
      tournamentId : tournamentId,
      teamId: teamId
    }

    console.log("마라톤 신청 요청값", requestBody);
    try {
      const response = await apiClient.post(
        `/tournament/participant/join`,
        requestBody,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${user.accessToken}`, // Authorization 헤더에 Bearer 토큰 추가
          },
        }
      );
      if (response.status === 200) {
        console.log("마라톤 신청 성공: ", response.data.data);
        // 응답 결과에 따라 모달 메시지 다르게 뜨게 하기
        setShowEntryModal(true);
      }
    } catch (error) {
      console.error("마라톤 신청 에러 발생: ", error);
    }
  };

  // 전화번호 형식 자동 변환
  const handlePhoneNumberChange = (text) => {
    // 숫자만 남기기
    const cleaned = text.replace(/\D/g, "");

    // 번호 형식에 맞게 변환
    let formatted = cleaned;
    if (cleaned.length > 3 && cleaned.length <= 7) {
      formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    } else if (cleaned.length > 7) {
      formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(
        3,
        7
      )}-${cleaned.slice(7, 11)}`;
    }

    setPhoneNumber(formatted);
  };

  // 생년월일 형식 자동 변환
  const handleDateOfBirthChange = (text) => {
    const cleaned = text.replace(/\D/g, ""); // 숫자만 남기기

    let formatted = cleaned;
    if (cleaned.length > 4 && cleaned.length <= 6) {
      formatted = `${cleaned.slice(0, 4)}/${cleaned.slice(4)}`;
    } else if (cleaned.length > 6) {
      formatted = `${cleaned.slice(0, 4)}/${cleaned.slice(
        4,
        6
      )}/${cleaned.slice(6, 8)}`;
    }

    setDateOfBirth(formatted);
  };

  useEffect(() => {
    getMyProfile(); // 내 정보 조회
  }, []);

  useEffect(() => {
    // 조회한 정보 state 변수에 넣기
    setName(userInfo.name);
    // setNickName(userInfo.nickname)
    handlePhoneNumberChange(userInfo.phoneNumber);
    setEmail(userInfo.email);
    handleDateOfBirthChange(userInfo.birthDate);
    setAddress(userInfo.address);
    setSelectedGender(userInfo.gender);
    // setHeightInfo(userInfo.height)
    // setWeightInfo(userInfo.weight)
    // setImage(userInfo.imageUrl)
  }, [userInfo]);

  const getMyProfile = async () => {
    try {
      const response = await apiClient.get(`/member/mypage/info`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      if (response.status === 200) {
        console.log("마이페이지 조회 성공: ", response.data.data);
        const getUserInfo = response.data.data;
        setUserInfo({ ...getUserInfo });
      }
    } catch (error) {
      console.error("마이페이지 조회 에러 발생: ", error);
    }
  };

  return (
    <Wrapper style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled" // 스크롤 중에도 키보드가 사라지지 않도록 설정
          >
            <Container>
              <TitleArea>
                <TitleText>{marathonName} 신청서</TitleText>
              </TitleArea>
              <ContentArea>
                <InputBox
                  label={"참가자명"}
                  placeholder={"이름을 입력해주세요."}
                  value={name}
                  setValue={setName}
                  isEditMode={false}
                />
                <InputBox
                  label={"전화번호"}
                  placeholder={"010-XXXX-XXXX"}
                  value={phoneNumber}
                  setValue={setPhoneNumber}
                  isEditMode={false}
                />
                <InputBox
                  label={"이메일"}
                  placeholder={"email@email.com"}
                  value={email}
                  setValue={setEmail}
                  isEditMode={false}
                />
                <InputBox
                  label={"생년월일"}
                  placeholder={"YYYY/MM/DD"}
                  value={dateOfBirth}
                  setValue={setDateOfBirth}
                  isEditMode={false}
                />
                <InputBox
                  label={"주소"}
                  placeholder={"주소를 입력해주세요."}
                  value={address}
                  setValue={setAddress}
                  isEditMode={false}
                />
                <InputBox
                  label={"성별"}
                  placeholder={""}
                  value={selectedGender}
                  setValue={setSelectedGender}
                  isEditMode={false}
                />

                {/* 드롭다운 컴포넌트 */}
                <InputBox
                  label="참가 종목"
                  placeholder="종목을 선택해주세요"
                  value={selectRunType}
                  setValue={setSelectRunType}
                  isEditMode={true}
                  options={tournamentCategory} // 드롭다운에 사용할 옵션 전달
                />

                <BtnArea>
                  <RoundBtn text={"신청하기"} onPress={clickEntryBtn} />
                </BtnArea>
              </ContentArea>
            </Container>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      {showEntryModal && (
        <DefaultModal isVisible={showEntryModal} content={entryModalContent} />
      )}
    </Wrapper>
  );
};

export default MarathonEntryFormScreen;
