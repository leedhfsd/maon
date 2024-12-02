import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import colors from "../../../styles/colors";
import fonts from "../../../styles/fonts";
import Svg, { Path } from "react-native-svg";

const BookmarkBtn = ({isActivated, text, toggleBookmark}) => {
  // text === '수락대기'일 경우 버튼이 눌리지 않도록.
  // text === '요청하기' or '친구 신청'일 경우 버튼이 눌리되 각각의 함수가 작동하도록

  return(
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.btn}
        onPress={toggleBookmark}
        >
          {isActivated?
            // {/* 북마크 색칠 O */}
            <Svg width={24} height={24} fill={colors.nav_orange} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
              <Path d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z"/>
            </Svg>
          :
            // {/* 북마크 색칠X */}
            <Svg width={24} height={24} fill={colors.nav_orange}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
              <Path d="M0 48C0 21.5 21.5 0 48 0l0 48 0 393.4 130.1-92.9c8.3-6 19.6-6 27.9 0L336 441.4 336 48 48 48 48 0 336 0c26.5 0 48 21.5 48 48l0 440c0 9-5 17.2-13 21.3s-17.6 3.4-24.9-1.8L192 397.5 37.9 507.5c-7.3 5.2-16.9 5.9-24.9 1.8S0 497 0 488L0 48z"/>
            </Svg>
          }
        <Text style={styles.text}>{text}</Text>
      </TouchableOpacity>
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
    aspectRatio: 3, // 가로가 세로의 5배 비율
    backgroundColor: colors.white,
    borderRadius: 28,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  text: {
    color: colors.nav_orange,
    fontSize: 14,
    fontFamily: fonts.gMarketMedium,
  },
  waitText: {
    color: colors.black,
    fontSize: 14,
    fontFamily: fonts.gMarketMedium,
  }
})

export default BookmarkBtn;