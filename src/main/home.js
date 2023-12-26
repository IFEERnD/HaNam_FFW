import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ImageBackground,
  LogBox,
  Alert,
} from "react-native";
import { Card, CardItem } from "native-base";
import CusHeader from "../layout/header";
import Carousel from "react-native-banner-carousel";

const BannerWidth = Dimensions.get("window").width;
const BannerHeight = 260;
const images = [
  require("../images/1.jpg"),
  require("../images/2.jpg"),
  require("../images/3.jpg"),
];
export default class home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    LogBox.ignoreLogs(["Animated: `useNativeDriver`"]);
  }

  renderPage(image, index) {
    return (
      <View key={index}>
        <Image
          style={{ width: BannerWidth, height: BannerHeight }}
          source={image}
        />
      </View>
    );
  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1, flexDirection: "column", marginBottom: 10 }}>
        <CusHeader isHome={true} title="Trang chủ" navigation={navigation} />
        <View style={{ width: Dimensions.get("screen").width, height: 260 }}>
          <Carousel
            autoplay
            autoplayTimeout={3000}
            loop
            index={0}
            pageSize={BannerWidth}
          >
            {images.map((image, index) => this.renderPage(image, index))}
          </Carousel>
        </View>
        <View style={{ flex: 1, alignItems: "stretch", marginTop: 5 }}>
          <TouchableOpacity onPress={() => navigation.navigate("map")}>
            <View style={styles.container}>
              <Card
                style={[
                  styles.cardStyle,
                  { height: 190, backgroundColor: "#4682b4" },
                ]}
              >
                <ImageBackground
                  source={require("../images/4.jpg")}
                  style={styles.image}
                >
                  <Text style={styles.text}>Bản đồ</Text>
                </ImageBackground>
              </Card>
            </View>
          </TouchableOpacity>

          <View style={styles.container}>
            <Card style={[styles.cardStyle, { height: 50 }]}>
              <CardItem
                button
                onPress={() => navigation.navigate("firelevel")}
                style={{ flex: 1, backgroundColor: "#007bff" }}
              >
                <View style={styles.main}>
                  <Text style={[styles.name, { color: "white" }]}>
                    Danh sách cấp cháy
                  </Text>
                </View>
              </CardItem>
            </Card>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
  },
  cardStyle: {
    flex: 1,
    borderRadius: 5,
  },
  img: {
    height: 96,
    resizeMode: "contain",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  main: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 13,
    textAlign: "center",
  },
  text: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#000000a0",
    paddingVertical: 10,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
