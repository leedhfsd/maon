import { View, StyleSheet, TextInput, Text, TouchableOpacity } from 'react-native';
import { useFontsLoaded } from "../../utils/fontContext";
import fonts from '../../styles/fonts';
import colors from '../../styles/colors';
import { useState } from 'react';

const BodyInfo = ({label, placeholder, value, setValue}) => {
  const fontsLoaded = useFontsLoaded();
  if (!fontsLoaded) {
    return null; // 폰트 로드 전까지 렌더링 방지
  }

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {label && <Text style={styles.label}>{label}</Text>}
        <View style={styles.infoWrapper}>
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            keyboardType="numeric"
            value={value}
            onChangeText={(text)=>setValue(text)}
          />
          <Text>
            {label === "키"? 'cm' : 'kg'}
          </Text>
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
  innerContainer: {
    flex: 1,
  },
  infoWrapper:{
    // flex: 1,
    flexDirection: 'row',
    borderRadius: 12,
    borderColor: '#D5D5D5',
    borderWidth: 1,
    paddingHorizontal: 18,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  label: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 15,
    fontFamily: fonts.gMarketLight,
  },
  input: {
    height: 50, // 높이를 직접 설정하여 일관되게 만듦
    width: '90%',
    // flex: 4,
    fontSize: 15,
    fontFamily: fonts.gMarketLight,
  },
});

export default BodyInfo;
