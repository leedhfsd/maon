import { SafeAreaView, View, Text, Button, TouchableOpacity, ScrollView } from "react-native";
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const MountainMap = {
  1: (
    <Svg width="391" height="250" viewBox="0 0 391 250" fill="none">
      <Path
        d="M-57.2346 178.389L271.488 5.00058C282.739 -0.933923 296.213 -0.845357 307.385 5.23656L625.889 178.625C660.48 197.456 647.105 250 607.72 250H-39.506C-79.1589 250 -92.3075 196.889 -57.2346 178.389Z"
        fill="url(#paint0_linear_2396_4)"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_2396_4"
          x1="173.5"
          y1="79.5"
          x2="345"
          y2="142.5"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FDD048" />
          <Stop offset="1" stopColor="#FF740E" />
        </LinearGradient>
      </Defs>
    </Svg>
  ),
  2: (
    <Svg width="391" height="354" viewBox="0 0 391 354" fill="none">
      <Path
        d="M0 353.5V0L639.5 353.5H0Z"
        fill="url(#paint0_linear_2396_3)"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_2396_3"
          x1="55"
          y1="61.5"
          x2="155.5"
          y2="168.5"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FA7514" />
          <Stop offset="1" stopColor="#FA9987" />
        </LinearGradient>
      </Defs>
    </Svg>
  ),

  3:(
    <Svg width="391" height="402" viewBox="0 0 391 402" fill="none">
        <Path
          d="M-190 402L391 0V402H-190Z"
          fill="url(#paint0_linear_2006_175)"
        />
        <Defs>
          <LinearGradient
            id="paint0_linear_2006_175"
            x1="263"
            y1="90"
            x2="375"
            y2="259.5"
            gradientUnits="userSpaceOnUse"
          >
            <Stop stopColor="#FA9987" />
            <Stop offset="0.128584" stopColor="#FA9987" />
            <Stop offset="1" stopColor="#A76251" />
          </LinearGradient>
        </Defs>
      </Svg>
  ),
  4: (
    <Svg width="391" height="575" viewBox="0 0 391 575" fill="none">
      <Path
        d="M-1 574.5V0L102.425 73.0873C107.939 76.9832 115.234 77.2479 121.015 73.7617L161.422 49.3945C170.838 43.7158 182.758 44.3152 191.557 50.9098L400.5 207.5V574.5H-1Z"
        fill="url(#paint0_linear_2006_174)"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_2006_174"
          x1="122"
          y1="230.5"
          x2="107"
          y2="88"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FFC48D" />
          <Stop offset="1" stopColor="#FF6A0E" />
        </LinearGradient>
      </Defs>
    </Svg>
  ),
  5:(
    <Svg width="391" height="707" viewBox="0 0 391 707" fill="none">
        <Path
          d="M162.735 9.74298L-1 193.5V706.5H393V193.5L204.72 8.35785C192.901 -3.26409 173.762 -2.63268 162.735 9.74298Z"
          fill="url(#paint0_linear_2006_173)"
        />
        <Defs>
          <LinearGradient
            id="paint0_linear_2006_173"
            x1="196"
            y1="-13"
            x2="196"
            y2="706.5"
            gradientUnits="userSpaceOnUse"
          >
            <Stop stopColor="#A24945" />
            <Stop offset="0.331" stopColor="#FFC58E" />
          </LinearGradient>
        </Defs>
      </Svg>
  )
}

const Mountain = ({number}) => {
  return(
    <View>
      {MountainMap[number] || null}
    </View>
  )
}

export default Mountain;