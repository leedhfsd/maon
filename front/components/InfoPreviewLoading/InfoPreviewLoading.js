import { SafeAreaView, View, Text, Button, Image } from "react-native";
import { useFontsLoaded } from "../../utils/fontContext";
import {
  Col,
  Row,
  Wrapper,
  ImageLoading,
  loadingStyles,
} from "./InfoPreviewLoadingStyle";
import { styles } from "../RouteInfoPreview/RouteInfoPreviewStyle";
import color from "../../styles/colors";
import fonts from "../../styles/fonts";

const InfoPreviewLoading = ({}) => {
  const fontsLoaded = useFontsLoaded();

  if (!fontsLoaded) {
    return null; // 폰트 로드 전까지 렌더링 방지
  }

  return (
    <View>
      <Wrapper>
        <Col>
          <ImageLoading></ImageLoading>
        </Col>
        <Col style={[styles.secondCol]}>
          <Row style={[loadingStyles.smallRow]} />
          <Row style={[loadingStyles.bigRow]} />
          <Row style={[loadingStyles.bigRow]} />
          <Row style={[loadingStyles.smallRow]} />
          <Row style={[loadingStyles.smallRow]} />
        </Col>
      </Wrapper>
      <Wrapper>
        <Col>
          <ImageLoading></ImageLoading>
        </Col>
        <Col style={[styles.secondCol]}>
          <Row style={[loadingStyles.smallRow]} />
          <Row style={[loadingStyles.bigRow]} />
          <Row style={[loadingStyles.bigRow]} />
          <Row style={[loadingStyles.smallRow]} />
          <Row style={[loadingStyles.smallRow]} />
        </Col>
      </Wrapper>
      <Wrapper>
        <Col>
          <ImageLoading></ImageLoading>
        </Col>
        <Col style={[styles.secondCol]}>
          <Row style={[loadingStyles.smallRow]} />
          <Row style={[loadingStyles.bigRow]} />
          <Row style={[loadingStyles.bigRow]} />
          <Row style={[loadingStyles.smallRow]} />
          <Row style={[loadingStyles.smallRow]} />
        </Col>
      </Wrapper>
      <Wrapper>
        <Col>
          <ImageLoading></ImageLoading>
        </Col>
        <Col style={[styles.secondCol]}>
          <Row style={[loadingStyles.smallRow]} />
          <Row style={[loadingStyles.bigRow]} />
          <Row style={[loadingStyles.bigRow]} />
          <Row style={[loadingStyles.smallRow]} />
          <Row style={[loadingStyles.smallRow]} />
        </Col>
      </Wrapper>
    </View>
  );
};

export default InfoPreviewLoading;
