import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import color from '../../../styles/colors';

export default function SquareBtn({text, onPress}) {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.touchableOpacity}
        onPress={onPress}
        >
        <LinearGradient 
          style={styles.gradientButton}
          start={{ x: 0, y: 0.5}} // 왼쪽 중앙 시작
          end={{x: 1, y: 0.5}} // 오른쪽 중앙 종료 
          colors={[color.nav_orange, color.dark_mandarind]}
        >
            <Text style={styles.btnText}>{text}</Text>
        </LinearGradient>
      </TouchableOpacity>
      {/* <StatusBar style="auto" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // flexDirection: 'row',
    // backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchableOpacity: { 
    // flex: 1, 
    flexDirection: 'row'
  },
  gradientButton: {
    flex: 1,
    // height: 60,
    aspectRatio: 6, // 가로가 세로의 6배 비율
    // backgroundColor: '#FF740E',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  btnText: {    
    color: color.white,
    fontSize: 18,
    lineHeight: 22, // 글자 높이 맞춤
    paddingVertical: 2, // 위아래 약간의 여백 추가
  }
});