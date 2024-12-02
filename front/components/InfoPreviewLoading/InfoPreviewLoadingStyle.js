// InfoPreviewLoadingStyle.js
import { StyleSheet, View } from "react-native";

export const Wrapper = (props) => (
  <View style={[loadingStyles.wrapper, props.style]}>{props.children}</View>
);

export const Col = (props) => (
  <View style={[loadingStyles.col, props.style]}>{props.children}</View>
);

export const Row = (props) => (
  <View style={[loadingStyles.row, props.style]}>{props.children}</View>
);

export const ImageLoading = (props) => (
  <View style={[loadingStyles.imageLoading, props.style]}>
    {props.children}
  </View>
);

export const loadingStyles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    padding: 10,
  },
  col: {
    flex: 1,
  },
  row: {
    height: 20,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    marginBottom: 9,
    width: "100%",
  },
  imageLoading: {
    flex: 1,
    backgroundColor: "#d0d0d0",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  smallRow: { height: 14 },
  bigRow: { height: 18 },
});
