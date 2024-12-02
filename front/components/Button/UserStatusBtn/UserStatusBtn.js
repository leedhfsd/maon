import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import color from "../../../styles/colors";
import fonts from "../../../styles/fonts";

const UserStatusBtn = ({text, onPress}) => {
  // text === '수락대기'일 경우 버튼이 눌리지 않도록.
  // text === '요청하기' or '친구 신청'일 경우 버튼이 눌리되 각각의 함수가 작동하도록

  return(
    <View style={styles.container}>
      {text === '수락대기' ?
        <TouchableOpacity 
          style={styles.waitBtn}
          onPress={onPress}
          >
          <Text style={styles.waitText}>{text}</Text>
        </TouchableOpacity>
        :
        <TouchableOpacity 
          style={styles.btn}
          onPress={onPress}
          >
          <Text style={styles.text}>{text}</Text>
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
    aspectRatio: 2.5, // 가로가 세로의 5배 비율
    backgroundColor: color.dark_mandarind,
    borderRadius: 28,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waitBtn: {
    // flex:0.3,
    aspectRatio: 2.5, // 가로가 세로의 5배 비율
    backgroundColor: color.begie,
    borderRadius: 28,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: color.white,
    fontSize: 14,
    fontFamily: fonts.gMarketMedium,
  },
  waitText: {
    color: color.black,
    fontSize: 14,
    fontFamily: fonts.gMarketMedium,
  }
})

export default UserStatusBtn;