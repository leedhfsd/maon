import Svg, { Path } from "react-native-svg";
// import { launchImageLibrary } from 'react-native-image-picker';
import * as ImagePicker from "expo-image-picker";
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
  Alert,
} from "react-native";
// import {PermissionsAndroid} 'react-native';
// import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { useState, useEffect, useContext } from "react";
import useAuthStore from "./../../store/AuthStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiClient } from "../../customAxios";
import {
  Wapper,
  BackBtn,
  EditBtn,
  EditBtnText,
  Top,
  ProfileImg,
  TopInfoContainer,
  NickNameText,
  BodyInfoEditView,
  BodyInfoEditTextInput,
  BodyinfoText,
  Content,
  BtnArea,
} from "./MyPageScreenStyles";
import { FlatList } from "react-native";
import colors from "../../styles/colors";
import InputBox from "../../components/InputBox/InputBox";
import SquareBtn from "../../components/Button/SquareBtn/SquareBtn";
import { LocationContext } from "../../utils/LocationProvider";
// import testImg from './../../assets/images/testProfile.jpg'

const testImg = require("./../../assets/images/testProfile.jpg");

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

const MyPageScreen = ({ navigation }) => {
  const { user, setUser } = useAuthStore();
  const [editMode, setEditMode] = useState(false);

  const [dateOfBirth, setDateOfBirth] = useState(""); // 생년월일 상태 관리
  const [phoneNumber, setPhoneNumber] = useState(""); // 전화번호 상태 관리
  const [name, setName] = useState(""); // 이름 상태관리
  const [email, setEmail] = useState(""); // 이메일 상태관리
  const [address, setAddress] = useState(""); // 주소 상태관리
  const [nickName, setNickName] = useState(""); // 닉네임 상태관리
  const [selectedGender, setSelectedGender] = useState(""); // 선택된 성별 상태 관리

  const [heightInfo, setHeightInfo] = useState(""); // 키 상태관리
  const [weightInfo, setWeightInfo] = useState(""); // 몸무게 상태관리

  const [image, setImage] = useState(testImg);

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
  // const location = useContext(LocationContext);
  // console.log("MyPage: ", location.latitude, "   ", location.longitude);
  // Async Storage accessToken 갱신
  const updateAccessToken = async (newAccessToken) => {
    try {
      await AsyncStorage.setItem("accessToken", newAccessToken);
      console.log("accessToken이 성공적으로 갱신되었습니다.");
    } catch (error) {
      console.error("accessToken 갱신 중 오류 발생: ", error);
    }
  };
  const clearAccessToken = async () => {
    try {
      // AsyncStorage에서 accessToken 제거
      await AsyncStorage.clear();
      Alert.alert("로그아웃", "성공적으로 로그아웃되었습니다.");
      // 로그아웃 후, 로그인 페이지로 이동 (필요 시 추가)
      navigation.navigate("Login"); // 'LoginScreen' 경로는 실제 화면 이름으로 변경
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
      Alert.alert("오류", "로그아웃에 실패했습니다. 다시 시도해주세요.");
    }
  };
  const clearWatch = async () => {
    try {
      // AsyncStorage에서 accessToken 제거
      await AsyncStorage.removeItem("pairedWatch");
      Alert.alert("연동해제");
      // 로그아웃 후, 로그인 페이지로 이동 (필요 시 추가)
      navigation.navigate("Login"); // 'LoginScreen' 경로는 실제 화면 이름으로 변경
    } catch (error) {
      console.error("연동해제 중 오류 발생:", error);
      Alert.alert("오류", "연동해제 실패했습니다. 다시 시도해주세요.");
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
    setEditMode(false);

    getMyProfile(); // 내 정보 조회
  }, []);

  useEffect(() => {
    setName(userInfo.name);
    setNickName(userInfo.nickname);
    handlePhoneNumberChange(userInfo.phoneNumber);
    setEmail(userInfo.email);
    handleDateOfBirthChange(userInfo.birthDate);
    setAddress(userInfo.address);
    setSelectedGender(userInfo.gender);
    setHeightInfo(userInfo.height);
    setWeightInfo(userInfo.weight);
    setImage(userInfo.imageUrl);
  }, [userInfo]);

  const editComplete = async () => {
    try {
      // FormData 객체 생성
      const formData = new FormData();

      // phoneNumber에서 '-' 제거
      const formattedPhoneNumber = phoneNumber
        ? phoneNumber.replace(/-/g, "")
        : "";

      // dateOfBirth에서 '/' 제거
      const formattedDateOfBirth = dateOfBirth
        ? dateOfBirth.replace(/\//g, "")
        : "";

      formData.append("name", name || ""); // 이름 추가 또는 ''
      formData.append("phoneNumber", formattedPhoneNumber || ""); // 전화번호 추가 또는 ''
      formData.append("birthDate", formattedDateOfBirth || ""); // 생년월일 추가 또는 ''
      formData.append("height", heightInfo || ""); // 키 추가 또는 ''
      formData.append("weight", weightInfo || ""); // 몸무게 추가 또는 ''
      formData.append("address", address || ""); // 주소 추가 또는 ''

      // 이미지 파일이 있는 경우 처리
      if (image) {
        // 이미지 URI를 Blob으로 변환
        const response = await fetch(image);
        const blob = await response.blob();
        const randomName = `profile_${Date.now()}_${Math.floor(
          Math.random() * 1000
        )}.jpg`;
        formData.append("profileImage", {
          name: randomName,
          type: "image/jpeg",
          uri: image,
        });
      } else {
        // 이미지가 없는 경우 빈 Blob 추가 (Optional)
        const emptyFile = new Blob([""], { type: "image/jpeg" });
        formData.append("profileImage", emptyFile, "empty.jpg");
      }

      console.log("보낼 이미지: " + image);
      const response = await apiClient.post(
        `/member/member/info/edit`,
        formData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
            "Content-Type": "multipart/form-data", // multipart 형식 명시
          },
          transformRequest: (data, headers) => {
            return data;
          },
        }
      );

      if (response.status === 200) {
        console.log("수정된 주소: ", address);
        console.log("회원정보 수정 성공: ", response.data);
        const responseResult = response.data.data;
        const newAccessToken = response.data.data.accessToken;
        setUser({
          accessToken: newAccessToken,
          name: responseResult.name,
          phoneNumber: responseResult.phoneNumber,
          birthDate: responseResult.birthDate,
          height: responseResult.height,
          weight: responseResult.weight,
          address: responseResult.address,
          imageUrl: responseResult.imageUrl,
        });
        // 새로운 accessToken을 AsyncStorage에 갱신
        console.log(1);
        await updateAccessToken(newAccessToken);

        // 상세 정보까지 저장
        console.log(2);
        await AsyncStorage.setItem("name", name);
        console.log(3);
        await AsyncStorage.setItem("height", String(heightInfo));
        console.log(4);
        await AsyncStorage.setItem("weight", String(weightInfo));
        console.log(5);
        await AsyncStorage.setItem("birthDate", formattedDateOfBirth);
        console.log(6);
        await AsyncStorage.setItem("address", address);
        console.log(7);
        await AsyncStorage.setItem("phoneNumber", formattedPhoneNumber);
        console.log(8);
        await AsyncStorage.setItem("imageUrl", responseResult.imageUrl);
        setEditMode(false);
        console.log(9);
      }
    } catch (error) {
      console.error("회원정보 수정 에러 발생: ", error);
    }
  };

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

  const selectProfileImage = async () => {
    // 갤러리 접근 권한 요청
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("갤러리 접근 권한이 필요합니다.");
      return;
    }

    // 이미지 선택
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri); // 선택한 이미지 URI를 상태에 저장
      // setImage(result.uri); // 선택한 이미지 URI를 상태에 저장
    }
  };

  useEffect(() => {
    console.log("바뀐 이미지: " + image);
  }, [image]);

  // 데이터 배열 생성 (InputBox를 FlatList에 넣을 수 있도록 구성)
  const userDetails = [
    {
      key: "name",
      label: "이름",
      placeholder: "이름을 입력해주세요.",
      value: name,
      setValue: setName,
      editable: editMode,
    },
    {
      key: "phoneNumber",
      label: "전화번호",
      placeholder: "010-XXXX-XXXX",
      value: phoneNumber,
      setValue: setPhoneNumber,
      editable: editMode,
    },
    {
      key: "email",
      label: "이메일",
      placeholder: "email@email.com",
      value: email,
      setValue: setEmail,
      editable: false,
    },
    {
      key: "dateOfBirth",
      label: "생년월일",
      placeholder: "YYYY/MM/DD",
      value: dateOfBirth,
      setValue: setDateOfBirth,
      editable: editMode,
    },
    {
      key: "address",
      label: "주소",
      placeholder: "주소를 입력해주세요.",
      value: address,
      setValue: setAddress,
      editable: editMode,
    },
    {
      key: "gender",
      label: "성별",
      placeholder: "",
      value: selectedGender,
      setValue: setSelectedGender,
      editable: false,
    },
  ];

  return (
    <Wapper style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}>
          {/* <ScrollView
            contentContainerStyle={{ flexGrow: 1 , paddingBottom: 20}}
            keyboardShouldPersistTaps="handled" // 스크롤 중에도 키보드가 사라지지 않도록 설정
          > */}
          {editMode ? (
            <BackBtn onPress={() => setEditMode(false)}>
              <Svg
                fill={colors.nav_orange}
                width={24}
                height={24}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512">
                <Path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
              </Svg>
              <EditBtnText>뒤로가기</EditBtnText>
            </BackBtn>
          ) : (
            <EditBtn onPress={() => setEditMode(true)}>
              <Svg
                fill={colors.nav_orange}
                width={24}
                height={24}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512">
                <Path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1 0 32c0 8.8 7.2 16 16 16l32 0zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" />
              </Svg>
              <EditBtnText>편집하기</EditBtnText>
            </EditBtn>
          )}

          {/* <Top>
              {editMode ? (
                <ProfileImg as={TouchableOpacity} onPress={selectProfileImage}>
                  {image ? (
                    <Image
                      style={{ width: "100%", height: "100%" }}
                      source={
                        typeof image === "string" && image
                          ? { uri: image }
                          : testImg
                      }
                    />
                  ) : (
                    <Svg
                      width={100}
                      height={100}
                      fill={colors.grape_fruit}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      onPress={() => navigation.navigate("MyPage")}
                    >
                      <Path
                        class="fa-secondary"
                        opacity=".4"
                        d="M96 128a128 128 0 1 0 256 0A128 128 0 1 0 96 128z"
                      />
                      <Path
                        class="fa-primary"
                        d="M0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z"
                      />
                    </Svg>
                  )}
                </ProfileImg>
              ) : (
                <ProfileImg>
                  {image ? (
                    <Image
                      style={{ width: "100%", height: "100%" }}
                      source={
                        typeof image === "string" && image
                          ? { uri: image }
                          : testImg
                      }
                    />
                  ) : (
                    <Svg
                      width={100}
                      height={100}
                      fill={colors.grape_fruit}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      onPress={() => navigation.navigate("MyPage")}
                    >
                      <Path
                        class="fa-secondary"
                        opacity=".4"
                        d="M96 128a128 128 0 1 0 256 0A128 128 0 1 0 96 128z"
                      />
                      <Path
                        class="fa-primary"
                        d="M0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z"
                      />
                    </Svg>
                  )}
                </ProfileImg>
              )}
              <TopInfoContainer>
                <NickNameText>{nickName}</NickNameText>
                {editMode ? (
                  <BodyInfoEditView>
                    <BodyInfoEditTextInput
                      value={String(heightInfo)}
                      placeholder="키"
                      keyboardType="numeric"
                      onChangeText={(text) => setHeightInfo(text)}
                    />
                    <Text>cm / </Text>
                    <BodyInfoEditTextInput
                      value={String(weightInfo)}
                      placeholder="몸무게"
                      keyboardType="numeric"
                      onChangeText={(text) => setWeightInfo(text)}
                    />
                    <Text>kg</Text>
                  </BodyInfoEditView>
                ) : (
                  // <BodyinfoText>{heightInfo}cm / {weightInfo}kg</BodyinfoText>
                  <BodyinfoText>
                    {heightInfo}cm / {weightInfo}kg
                  </BodyinfoText>
                )}
              </TopInfoContainer>
            </Top>
            <Content>
              <InputBox
                label={"이름"}
                placeholder={"이름을 입력해주세요."}
                value={name}
                setValue={setName}
                isEditMode={editMode}
              />
              <InputBox
                label={"전화번호"}
                placeholder={"010-XXXX-XXXX"}
                value={phoneNumber}
                setValue={setPhoneNumber}
                isEditMode={editMode}
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
                isEditMode={editMode}
              />
              <InputBox
                label={"주소"}
                placeholder={"주소를 입력해주세요."}
                value={address}
                setValue={setAddress}
                isEditMode={editMode}
              />
              <InputBox
                label={"성별"}
                placeholder={""}
                value={selectedGender}
                setValue={setSelectedGender}
                isEditMode={false}
              />
              {editMode && (
                <BtnArea>
                  <SquareBtn text={"수정하기"} onPress={editComplete} />
                </BtnArea>
              )}
              {!editMode && (
                <>
                  <BtnArea>
                    <SquareBtn
                      text={"로그아웃"}
                      onPress={() => {
                        clearAccessToken();
                      }}
                    />
                  </BtnArea>
                  <TouchableOpacity onPress={() => {}}>
                    <Text>워치연동 끊기</Text>
                  </TouchableOpacity>
                </>
              )}
            </Content> */}
          <FlatList
            style={{ paddingHorizontal: 40 }}
            data={userDetails}
            keyExtractor={(item) => item.key} // 고유 키로 구분
            contentContainerStyle={{ paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <InputBox
                label={item.label}
                placeholder={item.placeholder}
                value={item.value}
                setValue={item.setValue}
                isEditMode={item.editable}
              />
            )}
            ListHeaderComponent={() => (
              <Top>
                {editMode ? (
                  <ProfileImg
                    as={TouchableOpacity}
                    onPress={selectProfileImage}>
                    {image ? (
                      <Image
                        style={{ width: "100%", height: "100%" }}
                        source={
                          typeof image === "string" && image
                            ? { uri: image }
                            : testImg
                        }
                      />
                    ) : (
                      <Svg
                        width={100}
                        height={100}
                        fill={colors.grape_fruit}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        onPress={() => navigation.navigate("MyPage")}>
                        <Path
                          class="fa-secondary"
                          opacity=".4"
                          d="M96 128a128 128 0 1 0 256 0A128 128 0 1 0 96 128z"
                        />
                        <Path
                          class="fa-primary"
                          d="M0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z"
                        />
                      </Svg>
                    )}
                  </ProfileImg>
                ) : (
                  <ProfileImg>
                    {image ? (
                      <Image
                        style={{ width: "100%", height: "100%" }}
                        source={
                          typeof image === "string" && image
                            ? { uri: image }
                            : testImg
                        }
                      />
                    ) : (
                      <Svg
                        width={100}
                        height={100}
                        fill={colors.grape_fruit}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        onPress={() => navigation.navigate("MyPage")}>
                        <Path
                          class="fa-secondary"
                          opacity=".4"
                          d="M96 128a128 128 0 1 0 256 0A128 128 0 1 0 96 128z"
                        />
                        <Path
                          class="fa-primary"
                          d="M0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z"
                        />
                      </Svg>
                    )}
                  </ProfileImg>
                )}
                <TopInfoContainer>
                  <NickNameText>{nickName}</NickNameText>
                  {editMode ? (
                    <BodyInfoEditView>
                      <BodyInfoEditTextInput
                        value={String(heightInfo)}
                        placeholder="키"
                        keyboardType="numeric"
                        onChangeText={(text) => setHeightInfo(text)}
                      />
                      <Text>cm / </Text>
                      <BodyInfoEditTextInput
                        value={String(weightInfo)}
                        placeholder="몸무게"
                        keyboardType="numeric"
                        onChangeText={(text) => setWeightInfo(text)}
                      />
                      <Text>kg</Text>
                    </BodyInfoEditView>
                  ) : (
                    // <BodyinfoText>{heightInfo}cm / {weightInfo}kg</BodyinfoText>
                    <BodyinfoText>
                      {heightInfo}cm / {weightInfo}kg
                    </BodyinfoText>
                  )}
                </TopInfoContainer>
              </Top>
            )}
            ListFooterComponent={() => (
              <BtnArea>
                {editMode ? (
                  <SquareBtn text={"수정하기"} onPress={editComplete} />
                ) : (
                  <>
                    <SquareBtn
                      text={"로그아웃"}
                      onPress={() => {
                        clearAccessToken();
                      }}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        clearWatch();
                      }}>
                      <Text>워치연동 끊기</Text>
                    </TouchableOpacity>
                  </>
                )}
              </BtnArea>
            )}
          />
          {/* </ScrollView> */}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Wapper>
  );
};

export default MyPageScreen;
