import styled from "styled-components";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import color from "../../styles/colors";
export const Wrapper = styled.View``;

export const Top = styled.View`
  flex: 1;
`;
export const RunBtn = styled(TouchableOpacity)`
  background-color: ${color.light_orange};
  border-radius: 78px;
  bottom: 0;
  justify-content: center;
  align-items: center;
  width: 30%;
  padding: 16px;
`;
export const Bottom = styled.View`
  padding: 28px 27px 0px 27px;
`;

export const Info = styled.View``;
export const Row = styled.View`
  flex-direction: row;
  margin-bottom: 12px;
  align-items: center;
`;
export const Rank = styled.View`
  margin-top: 24px;
`;

export const RankTitle = styled.View`
  flex-direction: row;
  align-items: flex-end;
`;

export const RankList = styled.View`
  margin-top: 20px;
`;
export const UserInfo = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${color.light_begie};
  padding: 10px 0px;
  margin-bottom: 10px;
  border-radius: 20px;
`;

export const styles = StyleSheet.create({
  boldFont: {
    fontFamily: fonts.gMarketBold,
  },
  mediumFont: {
    fontFamily: fonts.gMarketMedium,
  },
  lightFont: { fontFamily: fonts.gMarketLight },
  infoText: {
    marginLeft: 10,
    fontSize: 18,
  },
  userProflie: {
    width: 65,
    height: 65,
    borderRadius: 17,
  },
  rankNumber: {
    fontSize: 20,
    fontFamily: fonts.gMarketBold,
  },
});
