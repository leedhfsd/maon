import React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { StyleSheet, SafeAreaView, View } from 'react-native';

const CustomIcon = () => (
  <SafeAreaView style={styles.Wrapper}>
    <Svg width="121" height="196" viewBox="0 0 121 196" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M43.025 7.73196C38.5138 12.6826 35.9795 19.3972 35.9795 26.3986C35.9795 33.3999 38.5138 40.1145 43.025 45.0652C47.5361 50.0159 53.6546 52.7971 60.0343 52.7971C66.4141 52.7971 72.5325 50.0159 77.0437 45.0652C81.5548 40.1145 84.0892 33.3999 84.0892 26.3986C84.0892 19.3972 81.5548 12.6826 77.0437 7.73196C72.5325 2.78127 66.4141 0 60.0343 0C53.6546 0 47.5361 2.78127 43.025 7.73196Z"
        fill="url(#paint0_linear)"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M54.1173 182.145V142.547H66.1447V182.145C66.1447 189.446 71.5194 195.344 78.1721 195.344C84.8248 195.344 90.1995 189.446 90.1995 182.145V102.866L98.0925 116.602C101.626 122.748 109.068 124.604 114.668 120.727C120.268 116.849 121.959 108.724 118.426 102.537L103.43 76.3854C94.0708 60.0513 77.7211 59.6367 60.131 59.6367C42.5409 59.6367 26.1911 60.0513 16.8323 76.4267L1.83561 102.537C-1.69744 108.682 0.0314982 116.808 5.63176 120.686C11.232 124.563 18.674 122.748 22.207 116.561L30.0624 102.866V182.145C30.0624 189.446 35.4372 195.344 42.0899 195.344C48.7425 195.344 54.1173 189.446 54.1173 182.145Z"
        fill="url(#paint1_linear)"
      />
      <Defs>
        <LinearGradient id="paint0_linear" x1="-52.7928" y1="5.46907" x2="-52.7928" y2="216.658" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFB727" />
          <Stop offset="1" stopColor="#FF6F06" />
        </LinearGradient>
        <LinearGradient id="paint1_linear" x1="-52.6961" y1="-12.8938" x2="-52.6961" y2="200.879" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFB727" />
          <Stop offset="1" stopColor="#FF6F06" />
        </LinearGradient>
      </Defs>
    </Svg>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  Wrapper: {
    // justifyContent: 'center',
    alignItems: 'center',
  }
})

export default CustomIcon;
