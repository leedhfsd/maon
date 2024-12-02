import {
  Wrapper,
  BackColor,
  WhitePathView,
  MountainView,
  FooterArea,
  ChallengeArea,
  ChallengeLevelText,
  ChallengeNextLevelText,
  ChallengeText,
  FooterIconArea,
} from "./ChallengeScreenStyles"

import { SafeAreaView, View, Text, Button, TouchableOpacity, ScrollView, Image } from "react-native";
import { useFontsLoaded } from "../../utils/fontContext";
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import Mountain from "../../components/ChallengeSvg/Mountain/Mountain";
import WhitePath from "../../components/ChallengeSvg/WhitePath/WhitePath";
import WhitePoint from "../../components/ChallengeSvg/WhitePoint/WhitePoint";
import ghost from "./../../assets/images/challenge_ghost.png"
import trophy from "./../../assets/images/challenge_Trophy.png"

const testMode = true


const ChallengeScreen = ({ navigation }) => {
  const fontsLoaded = useFontsLoaded();

  if (!fontsLoaded) {
    return null; // 폰트 로드 전까지 렌더링 방지
  }
  return (
    <BackColor>

      <Wrapper>

        {testMode?
          <View
            style={{zIndex: 10000}}
          >
            <Text>챌린지 화면</Text>
              <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("Login");
                  }}
                >
                  <Text style={{fontSize: 30}}>로그인 화면</Text>
                </TouchableOpacity>
              <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("MyPage");
                  }}
                >
                  <Text style={{fontSize: 30}}>마이페이지</Text>
                </TouchableOpacity>
              <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("CreateTeam");
                  }}
                >
                  <Text style={{fontSize: 30}}>팀 생성</Text>
                </TouchableOpacity>
              <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("MarathonEntryForm");
                  }}
                >
                  <Text style={{fontSize: 30}}>마라톤 신청서</Text>
                </TouchableOpacity>
              <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("MarathonInfoDetail");
                  }}
                >
                  <Text style={{fontSize: 30}}>마라톤 정보 디테일</Text>
                </TouchableOpacity>

          </View>
         :
          null}
          <FooterArea>
            <ChallengeArea>
              <ChallengeLevelText>
                Lv. 3
              </ChallengeLevelText>
              <ChallengeNextLevelText>
                달성 조건:
              </ChallengeNextLevelText>
              <ChallengeText>
                  5km 이상 1회 달리기
              </ChallengeText>
            </ChallengeArea>
            <FooterIconArea>
              <Image
                style={{ width: "100%", height: "100%", resizeMode: "contain", transform: [{ scaleX: -1 }]  }}
                source={trophy}
              />
              {/* <Image
                // style={{width: '50px', height: '50px', position: 'relative', zIndex: 1000000}}
                source={trophy} /> */}
            </FooterIconArea>
          </FooterArea>

          <Svg width="234" height="415" viewBox="0 0 234 415" fill="none">
            <Path d="M-120 0.5L233.5 197.5V415H-120V0.5Z" fill="url(#paint0_linear_2006_176)" />
            <Defs>
              <LinearGradient
                id="paint0_linear_2006_176"
                x1="151.5"
                y1="245.5"
                x2="64"
                y2="142.5"
                gradientUnits="userSpaceOnUse"
              >
                <Stop stopColor="#FA9987" />
                <Stop offset="1" stopColor="#FA7514" />
              </LinearGradient>
            </Defs>
          </Svg>

          {/* 유령 */}
          <WhitePathView
          style={{zIndex: 5, right: 0, bottom: 200}}
          >
            <Image source={ghost} />
          </WhitePathView>

          {/* 미션 원 */}
          <WhitePathView>
            <WhitePoint />
          </WhitePathView>
          {/* 미션 길 */}
          <WhitePathView>
            <WhitePath />
          </WhitePathView>
          <MountainView
            style={{zIndex: 3, right: 0}}
          >
            <Mountain number={1}/>
          </MountainView>
          <MountainView
            style={{zIndex: 2}}
          >
            <Mountain number={2}/>
          </MountainView>
          <MountainView
            style={{zIndex: 1}}
          >
            <Mountain number={3}/>
          </MountainView>
          <MountainView
            style={{zIndex: 0}}
          >
            <Mountain number={4}/>
          </MountainView>
          <MountainView
            style={{zIndex: -1}}
          >
            <Mountain number={5}/>
          </MountainView>
      </Wrapper>
    </BackColor>
  );
};
export default ChallengeScreen;
