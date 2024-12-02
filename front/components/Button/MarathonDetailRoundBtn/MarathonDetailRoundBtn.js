import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import colors from "../../../styles/colors";
import fonts from "../../../styles/fonts";
import Svg, { Path } from "react-native-svg";

const MarathonDetailRoundBtn = ({ text, onPress, backColor}) => {
  // text === '수락대기'일 경우 버튼이 눌리지 않도록.
  // text === '요청하기' or '친구 신청'일 경우 버튼이 눌리되 각각의 함수가 작동하도록

  return(
    <View style={styles.container}>
      { backColor === 'o_btn'?
        <TouchableOpacity 
          style={styles.gradientBtn}
          onPress={onPress}
          >
          <LinearGradient 
            style={styles.gradientButton}
            start={{ x: 0, y: 0.5}} // 왼쪽 중앙 시작
            end={{x: 1, y: 0.5}} // 오른쪽 중앙 종료 
            colors={[colors.nav_orange, colors.dark_mandarind]}
          >
              <Text style={styles.text}>{text}</Text>
          </LinearGradient>
        </TouchableOpacity>
        :
        <TouchableOpacity
          style={styles.btn}
          onPress={onPress}
        >
          <View>
            <Text style={styles.text}>{text}</Text>
          </View>
        </TouchableOpacity>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    
    width: '100%',
    flexDirection:"row",
  },
  btn: {
    // flex:0.3,
    flexDirection: 'row',
    aspectRatio: 2.7, // 가로가 세로의 5배 비율
    backgroundColor: colors.black,
    borderRadius: 78,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  gradientBtn: { 
    // flex: 1, 
    flexDirection: 'row',
    borderRadius: 78,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  gradientButton: {
    aspectRatio: 2.7, // 가로가 세로의 5.5배 비율
    flex: 1,
    // height: 60,
    width: '100%',
    // backgroundColor: '#FF740E',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 78,
  },
  text: {
    color: colors.white,
    fontSize: 17,
    fontFamily: fonts.gMarketMedium,
  },
})

export default MarathonDetailRoundBtn;