import React, { useEffect } from "react";
import {KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView } from "react-native";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAuthStore from "./../../store/AuthStore"
import * as ImagePicker from 'expo-image-picker';
import { useFontsLoaded } from "../../utils/fontContext";
import { 
  Wrapper,
  Content,
  Title,
  TitleContent,
  BoldText,
  Main,
  ProfileChangeIcon,
  ProfileView,
  PlusIcon,
  UserInfo,
  UserBodyInfo,
  BtnArea,
} from "./SignUpScreenStyles"
import { TouchableOpacity, Image, Text } from "react-native";
import Svg, { Path } from "react-native-svg";
import colors from "../../styles/colors";

import BodyInfo from "../../components/BodyInfo/BodyInfo";
import CustomIcon from "../../components/CustomIcon/CustomIcon";
import InputBox from "./../../components/InputBox/InputBox"
import SquareBtn from "./../../components/Button/SquareBtn/SquareBtn"
import { apiClient } from "../../customAxios";

// import testImg from "./../../assets/images/testProfile1.jpg"
const testImg = require("./../../assets/images/testProfile1.jpg")

import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const SignUpScreen = ({navigation, route}) => {
  const { setUser } = useAuthStore()
  const { paramsName, paramsEmail, paramsImg, paramsAccessToken } = route.params;
  const fontsLoaded = useFontsLoaded();
  const [process, setProcess] = useState(0);

  const [dateOfBirth, setDateOfBirth] = useState(''); // 생년월일 상태 관리
  const [phoneNumber, setPhoneNumber] = useState(''); // 전화번호 상태 관리
  const [name, setName] = useState('') // 이름 상태관리
  const [email, setEmail] = useState('') // 이메일 상태관리
  const [address, setAddress] = useState('') // 주소 상태관리
  const [nickName, setNickName] = useState('') // 닉네임 상태관리
  const [selectedGender, setSelectedGender] = useState(''); // 선택된 성별 상태 관리

  const [heightInfo, setHeightInfo] = useState('') // 키 상태관리
  const [weightInfo, setWeightInfo] = useState('') // 몸무게 상태관리

  const [accessToken, setAccessToken] = useState('') // 액세스 토큰 상태관리

  // const [profileImgUrl, setProfileImgUrl] = useState() // 
  const [image, setImage] = useState(testImg);


  // 유효성 검사용 상태관리
  const [nameError, setNameError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [birthDateError, setBirthDateError] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [genderError, setGenderError] = useState('');
  const [heightError, setHeightError] = useState('');
  const [weightError, setWeightError] = useState('');


  if (!fontsLoaded) {
    return null; // 폰트 로드 전까지 렌더링 방지
  }

  useEffect(() => {
    setName(paramsName)
    setEmail(paramsEmail)
    setImage(paramsImg)
    setAccessToken(paramsAccessToken)
    setNickName('')
    setNicknameError(false)
    // console.log('이미지 주소:', paramsImg)
  }, [])


  useEffect(()=>{
    if (process === 2) {
      nickNameCheck()
    }
  }, [nickName])

  // 회원가입 완료시 동작
  // const SignUpComplete = () =>  {
  //   console.log("가입 완료")
  //   navigation.navigate('Home')
  // }

  // 사용자 입력값 유효성 검사
  const validatePhoneNumber = (phone) => {
    return /^\d{3}-\d{4}-\d{4}$/.test(phone); // 11자리 숫자인지 확인
  };
  
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // 이메일 형식 확인
  };
  
  const validateBirthDate = (date) => {
    return /^\d{4}\/\d{2}\/\d{2}$/.test(date); // "YYYY/MM/DD" 형식인지 확인
  };
  
  const validateNickname = (nickname) => {
    return nickname.length > 0 && nickname.length <= 10; // 닉네임이 공백이 아니고 10자 이내인지 확인
  };
  

  // 회원가입 최종 완료 버튼
  const SignUpComplete = async () => {
    // 닉네임 유효성 검사
    if (!validateNickname(nickName)) {
      setNicknameError('닉네임은 1~10자 이내로 입력해주세요.');
      return;
    }
    console.log(1)


    // 닉네임 중복 확인 (여기에 중복 확인 API 호출 추가 예정)
    const isNicknameDuplicate = await nickNameCheck(); // 나중에 실제 중복 확인 로직 추가
    console.log('닉네임 중복 확인 결과', isNicknameDuplicate)
    // 예시: const isNicknameDuplicate = await checkNicknameDuplicate(nickName);
    if (isNicknameDuplicate) {
      setNicknameError('이미 사용 중인 닉네임입니다.');
      return;
    } else {
      setNicknameError('');
    }
    console.log(2)

    // 닉네임 유효성 검사 및 중복 확인이 통과된 경우에만 가입 요청 실행
    const formattedDate = dateOfBirth.replaceAll("/", "");
    const formattedPhoneNumber = phoneNumber.replaceAll("-", "");

    const requestBody = {
      name: name,
      nickname: nickName,
      email: email,
      height: Number(heightInfo),
      weight: Number(weightInfo),
      birthDate: formattedDate,
      address: address,
      gender: selectedGender,
      imageUrl: image || testImg,
      phoneNumber: formattedPhoneNumber
    };
    try {

      // FormData 객체 생성
      const formData = new FormData();

      formData.append("name", name || ""); // 이름 추가 또는 ''
      formData.append("nickname", nickName || "") // 닉네임 추가 또는 ''
      formData.append("email", email || "") // 이메일 추가 또는 ''
      formData.append("phoneNumber", formattedPhoneNumber || ""); // 전화번호 추가 또는 ''
      formData.append("birthDate",  formattedDate || ""); // 생년월일 추가 또는 ''
      formData.append("height", heightInfo || ""); // 키 추가 또는 ''
      formData.append("weight", weightInfo || ""); // 몸무게 추가 또는 ''
      formData.append("address", address || ""); // 주소 추가 또는 ''
      formData.append("gender", selectedGender || ""); // 성별 추가 또는 ''

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
        `/member/member/info`,
        formData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`, // Authorization 헤더에 Bearer 토큰 추가
            "Content-Type": "multipart/form-data", // multipart 형식 명시
          },
          transformRequest: (data, headers) => {
            return data;
          },
        }
      );
      if (response.status === 200) {
        const responseUserInfo = response.data.data
        console.log("가입완료", requestBody)
        // store에 저장하기
        console.log(1)
        setUser({
          id: responseUserInfo.id,
          name: responseUserInfo.name,
          nickName: requestBody.nickname,
          email: responseUserInfo.email,
          accessToken: responseUserInfo.accessToken,
          refreshToken: responseUserInfo.refreshToken,
          imageUrl: responseUserInfo.imageUrl,
          height: requestBody.height,
          weight: requestBody.weight,
          birthDate: requestBody.birthDate,
          address: requestBody.address,
          gender: requestBody.gender,
          phoneNumber: requestBody.phoneNumber,
          imageUrl: requestBody.imageUrl,
        })
        console.log(2)
        // navigation.navigate("Home")
  
        // 토큰을 AsyncStorage에 저장하여 자동 로그인 활성화
        await AsyncStorage.setItem("accessToken", responseUserInfo.accessToken);
        console.log(3)
        await AsyncStorage.setItem("refreshToken", responseUserInfo.refreshToken);
        console.log(4)
        await AsyncStorage.setItem("id", responseUserInfo.id);
        console.log(5)
        await AsyncStorage.setItem("email", responseUserInfo.email);
        console.log(6)
  
        await AsyncStorage.setItem("name", responseUserInfo.name);
        console.log(7)
        await AsyncStorage.setItem("nickname", requestBody.nickname);
        console.log(8)
  
        // 상세 정보까지 저장
        await AsyncStorage.setItem("height", String(requestBody.height));
        console.log(9)
  
        await AsyncStorage.setItem('weight', String(requestBody.weight));
        console.log(10)
        await AsyncStorage.setItem("birthDate", requestBody.birthDate);
        console.log(11)
        await AsyncStorage.setItem("address", requestBody.address);
        console.log(12)
        await AsyncStorage.setItem("gender", requestBody.gender);
        console.log(13)
        await AsyncStorage.setItem("imageUrl", requestBody.imageUrl);
        console.log(14)
        await AsyncStorage.setItem("phoneNumber", requestBody.phoneNumber);
        console.log(15)
  
        navigation.reset({
          index: 0,
          routes: [{ name: "MainTabs" }],
        });
        
      }

    } catch (error) {
      console.error("로그인 에러 발생: ", error, requestBody);
    }
  };

  const selectProfileImage = async () => {
    // 갤러리 접근 권한 요청
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
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
    }
  };


  const process1Complete = () => {
    let isValid = true;
  
    // 이름 공백 확인
    if (name.trim() === '') {
      setNameError('이름을 비워둘 수 없습니다.');
      isValid = false;
    } else {
      setNameError('');
    }

    // 주소 공백 확인
    if (address.trim() === '') {
      setAddressError('주소를 비워둘 수 없습니다.');
      isValid = false;
    } else {
      setAddressError('');
    }

    // 전화번호 유효성 검사
    if (!validatePhoneNumber(phoneNumber) || phoneNumber.trim() === '') {
      setPhoneError('전화번호는 11자리 숫자로 입력해주세요.');
      isValid = false;
    } else {
      setPhoneError('');
    }
  
    // 이메일 유효성 검사
    if (!validateEmail(email) || email.trim() === '') {
      setEmailError('올바른 이메일 형식을 입력해주세요.');
      isValid = false;
    } else {
      setEmailError('');
    }
  
    // 생년월일 유효성 검사
    if (!validateBirthDate(dateOfBirth) || dateOfBirth.trim() === '') {
      setBirthDateError('생년월일은 YYYY/MM/DD 형식으로 입력해주세요.');
      isValid = false;
    } else {
      setBirthDateError('');
    }

    // 성별 선택 확인
    if (!selectedGender || selectedGender.trim() === '') {
      setGenderError('성별을 선택해주세요.');
      isValid = false;
    } else {
      setGenderError('');
    }
  
    // 모든 값이 유효하면 다음 단계로 진행
    if (isValid) {
      setProcess(1);
    } else {
      console.log("입력한 정보를 확인해주세요.");
    }
  };
  

  const process2Complete = () => {
    // 키, 몸무게가 공백일 경우 에러메시지 띄우도록
    let isValid = true;

    // 키 공백 확인
    if (heightInfo.trim() === '') {
      setHeightError('키를 입력해주세요.');
      isValid = false;
    } else {
      setHeightError('');
    }

    // 몸무게 공백 확인
    if (weightInfo.trim() === '') {
      setWeightError('몸무게를 입력해주세요.');
      isValid = false;
    } else {
      setWeightError('');
    }

    // 모든 값이 유효하면 다음 단계로 진행
    if (isValid) {
      setProcess(2);
    } else {
      console.log("신체 정보를 확인해주세요.");
    }
  }

  const nickNameCheck = async () => {
    try {
      const response = await apiClient.post(
        `/member/member/check`,
        {
          nickname: nickName
        }
        ,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`, // Authorization 헤더에 Bearer 토큰 추가
          },
        }
      );
      // console.log("닉네임 중복확인 성공!:", response)
      if (response.status === 200) {
        console.log(response.data.data.duplicated)
        const result = response.data.data.duplicated
        return result;
        // if (response.data.data.duplicated) {
          
        // }
      }
      // const responseUserInfo = response.data.data

    } catch (error) {
      console.error("닉네임 중복 확인 에러 발생: ", error);
    }
  }

  return(
    <Wrapper>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView 
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled" // 스크롤 중에도 키보드가 사라지지 않도록 설정
        >
          {process === 0? 
            <Content
            showsVerticalScrollIndicator={true} // 스크롤바 숨기기
            >
              <Title>
                <TitleContent>MA:ON 이용을 위한</TitleContent>
                <TitleContent><BoldText>회원가입</BoldText>을 진행해주세요.</TitleContent>
              </Title>
              <UserInfo>
                <InputBox label={'이름'} placeholder={'이름을 입력해주세요.'} value={name} setValue={setName} isEditMode={true}/>
                {nameError ? <Text style={{ color: colors.nav_orange, paddingLeft: 5 }}>{nameError}</Text> : null}
                <InputBox label={'전화번호'} placeholder={'010-XXXX-XXXX'} value={phoneNumber} setValue={setPhoneNumber} isEditMode={true}/>
                {phoneError ? <Text style={{ color: colors.nav_orange, paddingLeft: 5 }}>{phoneError}</Text> : null}
                <InputBox label={'이메일'} placeholder={'email@email.com'} value={email} setValue={setEmail} isEditMode={false} />
                {emailError ? <Text style={{ color: colors.nav_orange, paddingLeft: 5 }}>{emailError}</Text> : null}
                <InputBox label={'생년월일'} placeholder={'YYYY/MM/DD'} value={dateOfBirth} setValue={setDateOfBirth} isEditMode={true} />
                {birthDateError ? <Text style={{ color: colors.nav_orange, paddingLeft: 5 }}>{birthDateError}</Text> : null}
                <InputBox label={'주소'} placeholder={'주소를 입력해주세요.'} value={address} setValue={setAddress} isEditMode={true} />
                {addressError ? <Text style={{ color: colors.nav_orange, paddingLeft: 5 }}>{addressError}</Text> : null}
                <InputBox label={'성별'} placeholder={''} value={selectedGender} setValue={setSelectedGender} isEditMode={true} />
                {genderError ? <Text style={{ color: colors.nav_orange, paddingLeft: 5 }}>{genderError}</Text> : null}
              </UserInfo>
              <BtnArea>
                <SquareBtn text={'입력 완료'} onPress={process1Complete} />
              </BtnArea>
            </Content>
          :null}
          {process === 1? 
            <Content>
              <Title>
                <TitleContent>MA:ON 이용을 위한</TitleContent>
                <TitleContent><BoldText>신체정보</BoldText>를 입력해주세요.</TitleContent>
              </Title>
              <Main>
                <UserBodyInfo isRightAligned={true}>
                  <BodyInfo label={'키'} placeholder={'키'} value={heightInfo} setValue={setHeightInfo} />
                  {heightError ? <Text style={{ color: colors.nav_orange, paddingLeft: 5, paddingTop: 5}}>{heightError}</Text> : null}
                </UserBodyInfo>
                <CustomIcon />
                <UserBodyInfo isRightAligned={false}>
                  <BodyInfo label={'몸무게'} placeholder={'몸무게'} value={weightInfo} setValue={setWeightInfo} />
                  {weightError ? <Text style={{ color: colors.nav_orange, paddingLeft: 5, paddingTop: 5}}>{weightError}</Text> : null}
                </UserBodyInfo>
              </Main>
              <BtnArea>
                <SquareBtn text={'가입하기'} onPress={process2Complete} />
              </BtnArea>
            </Content>
          :null}
          {process === 2?
            <Content>
              <Title>
                <TitleContent>MA:ON 이용 시</TitleContent>
                <TitleContent>사용할 <BoldText>프로필</BoldText>을 설정해주세요.</TitleContent>
              </Title>
                {image?
                  <ProfileChangeIcon as={TouchableOpacity}  onPress={selectProfileImage}>
                    <ProfileView>
                      <Image
                      style={{width: '100%', height: '100%'}}
                      source={{ uri: image || testImg }}
                    />
                    </ProfileView>
                  </ProfileChangeIcon>
                  :
                  <ProfileChangeIcon as={TouchableOpacity}  onPress={selectProfileImage}>
                    <PlusIcon>
                      <Svg fill={colors.black} width={screenWidth*0.12} height={screenWidth*0.12} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                        <Path d="M248 72c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 160L40 232c-13.3 0-24 10.7-24 24s10.7 24 24 24l160 0 0 160c0 13.3 10.7 24 24 24s24-10.7 24-24l0-160 160 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-160 0 0-160z"/>
                      </Svg>
                    </PlusIcon>
                    <Svg width={screenWidth*0.35} height={screenWidth*0.35} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                      <Path fill={colors.dark_mandarind} className="fa-secondary" opacity=".4" d="M96 128a128 128 0 1 0 256 0A128 128 0 1 0 96 128z"/>
                      <Path fill={colors.black} className="fa-primary" d="M0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z"/>
                    </Svg>
                  </ProfileChangeIcon>
                }
              <BtnArea>
                <InputBox label={''} placeholder={'닉네임은 이후 변경이 불가합니다.'} value={nickName} setValue={setNickName} isEditMode={true} />
                {nicknameError ? <Text style={{ color: colors.nav_orange, paddingLeft: 5, paddingTop: 5 }}>{nicknameError}</Text> : null}
              </BtnArea>
              <BtnArea>
                <SquareBtn text={'등록하기'} onPress={SignUpComplete} />
              </BtnArea>
            </Content>
          :
            null
          }
      </ScrollView>
    </KeyboardAvoidingView>
  </TouchableWithoutFeedback>
  </Wrapper>
  )
}

export default SignUpScreen;