import styled from "styled-components/native";
import colors from "../../../styles/colors";
import fonts from "../../../styles/fonts";
import { Text, TouchableOpacity, SafeAreaView } from "react-native";

export const ModalText = styled(Text)`
  color: ${colors.black};
  font-size: 20px;
  line-height: 30px;
  font-family: ${fonts.gMarketMedium};
  text-align: center;
  justify-content: center;
`;

export const pickerSelectStyles = {
  inputIOS: {
    marginLeft: "10%",
    width: "80%",
    height: 35,
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: 10,
    paddingHorizontal: 10,
    color: colors.black,
    fontFamily: fonts.gMarketMedium,
    fontSize: 14,
    marginVertical: 10,
  },
  inputAndroid: {
    marginLeft: "10%",
    width: "80%",
    height: 35,
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: 10,
    paddingHorizontal: 10,
    color: colors.black,
    fontFamily: fonts.gMarketMedium,
    fontSize: 14,
    marginVertical: 10,
  },
};
