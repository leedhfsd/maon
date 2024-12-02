import { View, StyleSheet, TextInput, Text, TouchableOpacity } from 'react-native';
import { useFontsLoaded } from "../../utils/fontContext";
import fonts from '../../styles/fonts';
import colors from '../../styles/colors';
import { useState, useEffect } from 'react';
import RNPickerSelect from 'react-native-picker-select'; // 추가

const InputBox = ({label, placeholder, value, setValue, isEditMode, options = [] }) => {
  // console.log('마라톤 종목: ', options)
  const fontsLoaded = useFontsLoaded();

  if (!fontsLoaded) {
    return null; // 폰트 로드 전까지 렌더링 방지
  }

  // 성별
  // const handleGenderSelect = (gender) => {
  //   setSelectedGender(gender);
  // };


  // 전화번호 형식 자동 변환
  const handlePhoneNumberChange = (text) => {
    // 숫자만 남기기
    const cleaned = text.replace(/\D/g, '');

    // 번호 형식에 맞게 변환
    let formatted = cleaned;
    if (cleaned.length > 3 && cleaned.length <= 7) {
      formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    } else if (cleaned.length > 7) {
      formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
    }

    setValue(formatted);
  };

// 생년월일 형식 자동 변환
const handleDateOfBirthChange = (text) => {
  const cleaned = text.replace(/\D/g, ''); // 숫자만 남기기

  let formatted = cleaned;
  if (cleaned.length > 4 && cleaned.length <= 6) {
    formatted = `${cleaned.slice(0, 4)}/${cleaned.slice(4)}`;
  } else if (cleaned.length > 6) {
    formatted = `${cleaned.slice(0, 4)}/${cleaned.slice(4, 6)}/${cleaned.slice(6, 8)}`;
  }

  setValue(formatted);
};

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {label && <Text style={styles.label}>{label}</Text>}

        {/* 성별 버튼 */}
        {label === '성별' ?
        isEditMode?
          (
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  (value === '남' || value === 'M') && { backgroundColor: colors.light_begie },
                  !isEditMode&&{borderWidth: 0}
                ]}
                onPress={() => setValue('M')}
              >
                <Text style={styles.genderText}>남</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  (value === '여' || value==='F') && { backgroundColor: colors.light_begie },
                  !isEditMode&&{borderWidth: 0}
                ]}
                onPress={() => setValue('F')}
              >
                <Text style={styles.genderText}>여</Text>
              </TouchableOpacity>
            </View>
          )
          :
          (
            <View style={styles.genderContainer}>
              <View
                style={[
                  styles.genderButton,
                  (value === '남' || value === 'M') && { backgroundColor: colors.light_begie },
                  !isEditMode&&{borderWidth: 0}
                ]}
              >
                <Text style={styles.genderText}>남</Text>
              </View>
              <View
                style={[
                  styles.genderButton,
                  (value === '여' || value==='F') && { backgroundColor: colors.light_begie },
                  !isEditMode&&{borderWidth: 0}
                ]}
              >
                <Text style={styles.genderText}>여</Text>
              </View>
            </View>
          )

         :

        // 그외 input(1.숫자 키보드이용 / 2. 숫자 키보드X)
        // 1. 생년월일 or 전화번호일 경우(숫자 패드)
        label === "생년월일" ?
        (
          <TextInput
              style={[styles.input,
                !isEditMode && { backgroundColor: colors.light_begie, borderWidth: 0 }
              ]}
              placeholder={placeholder}
              value={value}
              onChangeText={handleDateOfBirthChange}
              keyboardType="numeric"
              editable={isEditMode} // 입력 불가능 상태 여부
            />
        )
        :
        label === '전화번호' ?
        (
          <TextInput
              style={[styles.input,
                !isEditMode && { backgroundColor: colors.light_begie, borderWidth: 0 }
              ]}
              placeholder={placeholder}
              value={value}
            onChangeText={handlePhoneNumberChange}
              keyboardType="numeric"
              editable={isEditMode} // 입력 불가능 상태 여부
            />
        )
        :
        // 닉네임
        label === ''?
          (
            <TextInput
              style={[styles.input, {textAlign: 'center'}]}
              placeholder={placeholder}
              value={value}
              onChangeText={(text)=>setValue(text)}
              editable={isEditMode} // 입력 불가능 상태 여부
            />
          )
          :
          label === '참가 종목' ? (
          <RNPickerSelect
            onValueChange={(value) => setValue(value)}
            items={options.map((option) => ({ label: option, value: option }))}
            style={{
              inputIOS: styles.input,
              inputAndroid: styles.input,
              iconContainer: {
                top: '50%', // 아이콘의 수직 위치를 가운데로 조정
                transform: [{ translateY: -12.5 }], // 아이콘의 높이에 따라 조정
                right: 10, // 오른쪽에 여백 추가
              },
            }}
            placeholder={{ label: placeholder, value: null }}
            value={value}
            useNativeAndroidPickerStyle={false} // 안드로이드에서 네이티브 스타일을 사용하지 않도록 설정
            disabled={!isEditMode}
            Icon={() => <Text style={{ color: colors.black, fontSize: 20, textAlignVertical: 'center'}}>▼</Text>} // 드롭다운 아이콘 추가
          />
          ) 
          :
          (
            // 2. 생일과 전화번호를 제외한 모든 input
            <TextInput
              style={[styles.input,
                !isEditMode && { backgroundColor: colors.light_begie, borderWidth: 0 }
              ]}
              placeholder={placeholder}
              inputMode={label==="이메일"? 'email' : 'text'}
              value={value}
              onChangeText={(text)=>setValue(text)}
              editable={isEditMode} // 입력 불가능 상태 여부
            />
          )

        }
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
  label: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 15,
    fontFamily: fonts.gMarketLight,
  },
  input: {
    height: 50, // 높이를 직접 설정하여 일관되게 만듦
    borderRadius: 12,
    borderColor: '#D5D5D5',
    borderWidth: 1,
    paddingHorizontal: 18,
    backgroundColor: 'white',
    fontSize: 15,
    fontFamily: fonts.gMarketLight,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    gap: 10,    
  },
  genderButton: {
    flex: 1,
    height: 50, // input과 동일한 높이 설정
    borderRadius: 12,
    borderColor: '#D5D5D5',
    borderWidth: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderText: {
    fontSize: 15,
    fontFamily: fonts.gMarketLight,
  },
});

export default InputBox;
