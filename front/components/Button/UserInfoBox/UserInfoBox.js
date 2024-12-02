import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View, TouchableOpacity, Image, Text } from "react-native";
import Svg, { Path } from 'react-native-svg'
import UserStatusBtn from "../UserStatusBtn/UserStatusBtn";
import color from "../../../styles/colors";
import testImg from "./../../../assets/images/testProfile1.jpg"
// import testProfile from "./../../../assets/images/testProfile.jpg"

const UserInfoBox = ({proImg, level, name, status, onPress}) => {
  return(
    <View style={styles.container}>
      <View style={styles.userBox}>
        <View style={styles.innerContainer}>
          <Image 
            source={
              proImg.startsWith('http') 
                ? { uri: proImg }
                : proImg.startsWith('file://')
                  ? { uri: proImg }
                  : { uri: testImg }
            }
            style={styles.profileImg} />
          <View style={styles.profileContent}>
            <View style={styles.ProfileContentInfo}>
              {/* 챌린지 레벨 및 닉네임 */}
              <Text style={styles.level}>챌린지 Lv.{level}</Text>
              <Text style={styles.name}>{name}</Text>
            </View>

            {/* 상태에 따라 바뀌는 부분 >, 요청하기Btn, 수락대기Btn, 친구 신청Btn */}
            <View style={styles.changeArea}>
              {status === 'show-detail'?
                <Svg width={30} height={30} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill={color.light_grape_fruit}>
                  <Path d="M273 239c9.4 9.4 9.4 24.6 0 33.9L113 433c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l143-143L79 113c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L273 239z"/>
                </Svg>
              : 
                <UserStatusBtn text={status} onPress={onPress} />
              }
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userBox:{
    flex: 1,
    backgroundColor: 'white',
    aspectRatio: 3,
    borderColor: 'rgba(188, 188, 188, 0.56)',
    borderWidth: 1,
    borderRadius: 36,

    // iOS 전용 그림자 속성
    shadowColor: '#000',                  // 그림자 색상
    shadowOffset: { width: 4, height: 4 }, // 그림자 위치
    shadowOpacity: 0.14,                   // 그림자의 투명도
    shadowRadius: 5,                       // 그림자 퍼짐 정도
    // Android 전용 elevation
    // elevation: 5,
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  profileImg: {
    flex:1,
    aspectRatio: 1,
    borderRadius: 17,
  },
  profileContent: {
    flex: 3,
    flexDirection: 'row',
    // paddingHorizontal: 10, 
    paddingLeft: 10, 
    // gap: 3
  },
  ProfileContentInfo: {
    flex: 3,
    gap: 3
  },
  changeArea: {
    flex: 2,
    alignItems: 'flex-end',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  level: {
    color: '#989898',
    fontSize: 11,
  },
  name: {
    fontSize: 16
  },
})

export default UserInfoBox