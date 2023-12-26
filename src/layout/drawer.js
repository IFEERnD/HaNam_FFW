import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Linking,
  Share,
  Alert,
} from "react-native";
import Mailer from "react-native-mail";

export default class drawer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // Share
  _shareApp = async () => {
    try {
      const result = await Share.share({
        message: "Link tải ứng dụng HAHAMFFW\n",
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  //HDSD

  _HDSD = () => {
    Linking.openURL("https://www.youtube.com/channel/UCMMHXxI1RsJbNj1KjhnMZKQ");
  };

  _FeedBack = () => {
    Mailer.mail(
      {
        subject: "Góp ý ứng dụng HAHAMFFW",
        recipients: ["info@ifee.edu.vn"],
        body: "",
      },
      (error, event) => {
        Alert.alert(
          error,
          event,
          [
            {
              text: "Ok",
              onPress: () => console.log("OK: Email lỗi phải hồi"),
            },
            {
              text: "Cancel",
              onPress: () => console.log("CANCEL: Email lỗi phải hồi"),
            },
          ],
          { cancelable: true }
        );
      }
    );
  };
  render() {
    return (
      <View style={styles.body}>
        <View style={styles.bg}>
          <View style={styles.logo}>
            <Image
              source={require("../images/logo.png")}
              style={styles.imglogo}
            />
            <View style={{ width: 10 }}></View>
            <View style={styles.contentapp}>
              <Text style={styles.name}>HÀ NAM FFW</Text>
            </View>
          </View>
        </View>

        <View style={styles.module}>
          <Text style={styles.lable}>Liên hệ</Text>
          <TouchableOpacity onPress={this._HDSD}>
            <View style={styles.list}>
              <Image
                source={require("../images/hdsd.png")}
                style={styles.icon}
              />
              <Text style={styles.font}>Hướng dẫn sử dụng</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._shareApp}>
            <View style={styles.list}>
              <Image
                source={require("../images/share.png")}
                style={styles.icon}
              />
              <Text style={styles.font}>Chia sẻ ứng dụng</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._FeedBack}>
            <View style={styles.list}>
              <Image
                source={require("../images/feedback.png")}
                style={styles.icon}
              />
              <Text style={styles.font}>Góp ý</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("appInfo")}
          >
            <View style={styles.list}>
              <Image
                source={require("../images/info_on.png")}
                style={styles.icon}
              />
              <Text style={styles.font}>Thông tin tác giả</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  body: {
    flex: 1,
    height: Dimensions.get("screen").height,
    backgroundColor: "#fff",
    borderRightWidth: 1,
    borderColor: "#fff",
  },
  bg: {
    borderBottomWidth: 1,
    borderColor: "#e1e1e1",
    backgroundColor: "#f6f6f6",
    width: "100%",
    height: 150,
    paddingTop: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  contentapp: {
    flexDirection: "column",
  },
  name: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 17,
    textAlign: "center",
  },
  ver: {
    color: "#000",
    textAlign: "center",
    fontSize: 13,
  },
  logo: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  imglogo: {
    width: 120,
    height: 120,
  },
  list: {
    flexDirection: "row",
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: "#fff",
    borderBottomColor: "#fff",
  },
  font: {
    color: "black",
    textAlignVertical: "center",
    fontSize: 15,
    marginLeft: 10,
  },
  icon: {
    width: 32,
    height: 32,
    marginRight: 5,
  },
  module: {
    marginTop: 5,
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  lable: {
    paddingLeft: 12,
    fontSize: 13,
    fontWeight: "500",
  },
});
