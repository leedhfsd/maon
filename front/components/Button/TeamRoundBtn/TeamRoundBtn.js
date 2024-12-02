import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import color from "../../../styles/colors";
import fonts from '../../../styles/fonts';

const TeamRoundBtn = ({text, onPress, backColor}) => {
  // text === '수락대기'일 경우 버튼이 눌리지 않도록.
  // text === '요청하기' or '친구 신청'일 경우 버튼이 눌리되 각각의 함수가 작동하도록

  return(
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.btn, {backgroundColor: backColor}]}
        onPress={onPress}
        >
          {backColor === color.o_btn?
            <LinearGradient 
            style={styles.btn}
            start={{ x: 0, y: 0.5}} // 왼쪽 중앙 시작
            end={{x: 1, y: 0.5}} // 오른쪽 중앙 종료 
            colors={[color.nav_orange, color.dark_mandarind]}
            >
                <Text style={styles.text}>{text}</Text>
            </LinearGradient> 
          :
          <View
            style={styles.btn}
          >
            <Text style={styles.text}>{text}</Text>
          </View>
          }
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection:"row",
  },
  btn: {
    // flex:1,
    aspectRatio: 3.5, // 가로가 세로의 5배 비율
    // backgroundColor: color.dark_mandarind,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: color.white,
    fontSize: 16,
    marginVertical: 5,
  },
  // gradientButton: {
  //   // flex: 1,
  //   // height: 60,
  //   aspectRatio: 2.5, // 가로가 세로의 5.5배 비율
  //   // backgroundColor: '#FF740E',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   borderRadius: 28,
  // },
})

export default TeamRoundBtn;