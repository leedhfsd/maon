import { StyleSheet, View, TextInput, Text } from "react-native";
import { useState } from "react";
import Svg, { Path } from 'react-native-svg'
import color from "../../styles/colors";

const SearchBar = ({searchName, setSearchName}) => {
  // const [searchName, setSearchName] = useState('') // 사용자가 입력할 값을 담을 state변수

  return(
    <View style={styles.container}>
      {/* <Text>{searchName}</Text> */}
      <View style={styles.innerContainer}>
        <View style={styles.innerWrap}>
          {/* 검색창에서 사용자가 입력하는 부분 */}
          <TextInput 
            style={styles.teatArea}
            value={searchName}
            onChangeText={(text) => setSearchName(text)} // TextInput 안의 내용이 바뀔 때마다 값 변화
            placeholder="닉네임으로 친구를 검색해보세요!" 
          />
          {/* 검색 아이콘 */}
          <View style={styles.searchSvg}>
            <Svg width={24} height={24} fill={color.grape_fruit} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <Path
                  opacity={0.4}
                  d="M0 208a208 208 0 1 0 416 0A208 208 0 1 0 0 208zm352 0A144 144 0 1 1 64 208a144 144 0 1 1 288 0z"
                />
                <Path
                  d="M330.7 376L457.4 502.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L376 330.7C363.3 348 348 363.3 330.7 376z"
                />
            </Svg>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  innerContainer: {
    flex: 1,
  },
  innerWrap: {
    flexDirection: 'row',
    aspectRatio: 6.5,
    paddingHorizontal: 15,
    backgroundColor: color.white,
    borderColor: color.dark_mandarind,
    borderWidth: 2,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  teatArea:{
    // flex: 8,
    width: '87%'
  },
  searchSvg: {
    // flex: 1,
    alignItems: 'flex-end'
  }
})

export default SearchBar