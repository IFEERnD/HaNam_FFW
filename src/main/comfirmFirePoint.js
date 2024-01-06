import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  PermissionsAndroid,
  Platform,
} from "react-native";
import {
  Content,
  ListItem,
  CheckBox,
  Body,
  Toast,
  Root,
  Separator,
  Form,
  Textarea,
  Button,
  Picker,
} from "native-base";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import CusHeader from "../layout/header";
import Loader from "react-native-modal-loader";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { mainURL } from "../untils/Variable";
import { request, PERMISSIONS } from "react-native-permissions";

const options = {
  mediaType: "photo",
  cameraType: "back",
  includeExtra: true,
};

export default class comfirmFirePoint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      loading: false,
      ForestFire: false,
      NotForestFire: true,
      FireNotForest: false,
      ext: false,
      notExt: true,
      imageComfirm: null,
      description: "",
      selected: "Đông",
      acreage: "",
      range: "",
      username: "",
      userphone: "",
      tgdaptat: "",
    };
  }

  componentDidMount() {}

  ChangeCheck(id) {
    if (id == 1) {
      this.setState({
        ForestFire: true,
        NotForestFire: false,
        FireNotForest: false,
      });
    } else if (id == 2) {
      this.setState({
        ForestFire: false,
        NotForestFire: true,
        FireNotForest: false,
      });
    } else {
      this.setState({
        ForestFire: false,
        NotForestFire: false,
        FireNotForest: true,
      });
    }
  }

  ChangeExt() {
    this.setState({
      ext: !this.state.ext,
      notExt: !this.state.notExt,
    });
  }

  requestCameraAndroid = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Yêu cầu quyền sử dụng máy ảnh",
          message: "Ứng dụng yêu cầu quyền sử dụng máy ảnh của bạn!",
          buttonNeutral: "Nhắc tôi sau",
          buttonNegative: "Hủy",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.takePhoto();
      } else {
      }
    } catch (err) {
      console.log(err);
    }
  };

  requestCameraIOS = () => {
    try {
      request(PERMISSIONS.IOS.CAMERA).then((result) => {
        if (result === "granted") {
          this.takePhoto();
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  pickImgFromStorage = () => {
    launchImageLibrary(options, (res) => {
      if (res.didCancel) {
        console.log("user cancel");
      } else if (res.errorCode) {
        console.log(res.errorMessage);
      } else {
        this.setState({
          imageComfirm: res.assets[0],
        });
      }
    });
  };

  takePhoto = () => {
    launchCamera(options, (res) => {
      if (res.didCancel) {
        console.log("user cancel");
      } else if (res.errorCode) {
        console.log(res.errorMessage);
      } else {
        this.setState({
          imageComfirm: res.assets[0],
        });
      }
    });
  };

  _chooseFile = (optionPicker) => {
    optionPicker == 1
      ? this.pickImgFromStorage()
      : Platform.OS === "android"
      ? this.requestCameraAndroid()
      : this.requestCameraIOS();
  };

  checkAcreage = (text) => {
    //if (/^\d+$/.test(text) || text === '') {
    this.setState({
      acreage: text,
    });
    // }
  };

  checkRange = (text) => {
    this.setState({
      range: text,
    });
  };

  checkPhone = (text) => {
    if (/^\d+$/.test(text) || text === "") {
      this.setState({
        userphone: text,
      });
    }
  };

  _ComfirmFire = () => {
    this.setState({
      disabled: true,
      loading: true,
    });
    const { navigation } = this.props;
    const idPoint = navigation.getParam("idPoint", "");
    const {
      ForestFire,
      NotForestFire,
      FireNotForest,
      ext,
      acreage,
      range,
      username,
      userphone,
      imageComfirm,
      description,
      selected,
    } = this.state;
    let formdata = new FormData();
    formdata.append("dataId", idPoint);
    if (ForestFire) {
      formdata.append("fire", 2);
    }
    if (NotForestFire) {
      formdata.append("fire", 3);
    }
    if (FireNotForest) {
      formdata.append("fire", 4);
    }

    if (ext) {
      formdata.append("daptat", 1);
    } else {
      formdata.append("daptat", 0);
    }
    formdata.append("mota", description);
    formdata.append("huongphoi", selected);
    formdata.append("dtdamchay", acreage);
    formdata.append("khoangcach", range);
    formdata.append("username", username);
    formdata.append("userphone", userphone);
    var RandomNumber = Math.floor(Math.random() * 10000) + 1;
    if (imageComfirm) {
      formdata.append("hinhanh", {
        uri: imageComfirm.uri,
        type: imageComfirm.type,
        name: RandomNumber + "_" + idPoint + ".png",
      });
    } else {
      formdata.append("hinhanh", "");
    }
    console.log("data", formdata);
    var requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };
    fetch(`${mainURL}/api/verificationFireForm`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        if (result == 1) {
          Toast.show({
            text: "Đã gửi xác minh",
            type: "success",
            position: "bottom",
            textStyle: {
              fontSize: 13,
              textAlign: "center",
            },
            duration: 2000,
          });
          this.setState({
            disabled: false,
            loading: false,
            ForestFire: false,
            NotForestFire: true,
            ext: false,
            notExt: true,
            imageComfirm: null,
            description: "",
            selected: "Đông",
            acreage: "",
            range: "",
            username: "",
            userphone: "",
          });
          navigation.state.params.onRefesh();
          navigation.goBack();
          Toast.show({
            text: "Xác minh thành công",
            type: "success",
            position: "bottom",
            textStyle: {
              fontSize: 13,
              textAlign: "center",
            },
            duration: 2000,
          });
        } else {
          Toast.show({
            text: "Gửi xác minh thất bại",
            type: "danger",
            position: "bottom",
            textStyle: {
              fontSize: 13,
              textAlign: "center",
            },
            duration: 2000,
          });
          this.setState({
            disabled: false,
            loading: false,
          });
        }
      })
      .catch((error) => console.log("error", error));
  };

  render() {
    const { navigation } = this.props;
    return (
      <Root>
        <View style={{ flex: 1, flexDirection: "column" }}>
          <CusHeader title="Xác minh cháy rừng" navigation={navigation} />
          <Loader
            title="Đang gửi dữ liệu xác minh..."
            size="small"
            loading={this.state.loading}
            color="#007bff"
          />
          <Content>
            <View style={{ flex: 1, marginBottom: 10 }}>
              <Separator bordered style={{ height: 50 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  Xác minh điểm cháy
                </Text>
              </Separator>
            </View>
            <ListItem style={styles.listStyle}>
              <CheckBox
                checked={this.state.ForestFire}
                onPress={() => this.ChangeCheck(1)}
              />
              <Body>
                <Text style={styles.content}>Cháy rừng</Text>
              </Body>
            </ListItem>
            <ListItem style={styles.listStyle}>
              <CheckBox
                checked={this.state.NotForestFire}
                onPress={() => this.ChangeCheck(2)}
              />
              <Body>
                <Text style={styles.content}>Không phải cháy rừng</Text>
              </Body>
            </ListItem>
            <ListItem style={styles.listStyle}>
              <CheckBox
                checked={this.state.FireNotForest}
                onPress={() => this.ChangeCheck(3)}
              />
              <Body>
                <Text style={styles.content}>
                  Có cháy nhưng không phải cháy rừng
                </Text>
              </Body>
            </ListItem>
            <View style={{ flex: 1, marginBottom: 10, marginTop: 10 }}>
              <Separator bordered style={{ height: 50 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  Thông tin xác minh
                </Text>
              </Separator>
            </View>
            <Text style={{ fontSize: 14, paddingLeft: 20, marginBottom: 10 }}>
              Mô tả:
            </Text>
            <ListItem style={{ borderBottomWidth: 0, height: 160 }}>
              <Body>
                <Textarea
                  rowSpan={8}
                  multiline
                  value={this.state.description}
                  onChangeText={(text) => this.setState({ description: text })}
                  style={[
                    styles.content,
                    {
                      height: 150,
                      textAlignVertical: "top",
                      padding: 15,
                      borderColor: "#c9c9c9",
                      borderWidth: 1,
                      borderRadius: 8,
                    },
                  ]}
                />
              </Body>
            </ListItem>
            {(this.state.ForestFire || this.state.FireNotForest) && (
              <View>
                <Text style={{ fontSize: 14, paddingLeft: 20, marginTop: 10 }}>
                  Hướng:
                </Text>
                <Form
                  style={{
                    marginHorizontal: 15,
                    borderBottomColor: "#c9c9c9",
                    borderBottomWidth: 1,
                  }}
                >
                  <Picker
                    style={{
                      height: 50,
                      width: Dimensions.get("screen").width - 30,
                    }}
                    selectedValue={this.state.selected}
                    onValueChange={(value) => {
                      this.setState({ selected: value });
                    }}
                  >
                    <Picker.Item label="Đông" value="Đông" />
                    <Picker.Item label="Tây" value="Tây" />
                    <Picker.Item label="Nam" value="Nam" />
                    <Picker.Item label="Bắc" value="Bắc" />
                    <Picker.Item label="Đông - Bắc" value="Đông - Bắc" />
                    <Picker.Item label="Đông - Nam" value="Đông - Nam" />
                    <Picker.Item label="Tây - Bắc" value="Tây - Bắc" />
                    <Picker.Item label="Tây - Nam" value="Tây - Nam" />
                  </Picker>
                </Form>
                <Text style={{ fontSize: 14, paddingLeft: 20, marginTop: 10 }}>
                  Ước lượng diện tích đám cháy (m²):
                </Text>
                <ListItem
                  style={{ borderBottomWidth: 0, height: 40, marginBottom: 10 }}
                >
                  <Body>
                    <TextInput
                      keyboardType="numeric"
                      value={this.state.acreage}
                      onChangeText={(text) => this.checkAcreage(text)}
                      style={{
                        borderBottomColor: "#c9c9c9",
                        borderBottomWidth: 1,
                        height: 40,
                      }}
                    />
                  </Body>
                </ListItem>
                <Text style={{ fontSize: 14, paddingLeft: 20, marginTop: 10 }}>
                  Ước lượng khoảng cách đến đám cháy (Km):
                </Text>
                <ListItem
                  style={{ borderBottomWidth: 0, height: 40, marginBottom: 10 }}
                >
                  <Body>
                    <TextInput
                      keyboardType="numeric"
                      value={this.state.range}
                      onChangeText={(text) => this.checkRange(text)}
                      style={{
                        borderBottomColor: "#c9c9c9",
                        borderBottomWidth: 1,
                        height: 40,
                      }}
                    />
                  </Body>
                </ListItem>
              </View>
            )}

            <Text style={{ fontSize: 14, paddingLeft: 20, marginTop: 10 }}>
              Ảnh chụp:
            </Text>

            <View
              style={{
                flexDirection: "row",
                width: "28%",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Button
                onPress={() => {
                  this._chooseFile(2);
                }}
                transparent
                style={{
                  height: 50,
                  width: 50,
                  marginLeft: 20,
                  marginTop: 10,
                  backgroundColor: "#e1e1e1",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FontAwesome name="camera" size={24} color={"black"} />
              </Button>
              <Button
                onPress={() => {
                  this._chooseFile(1);
                }}
                transparent
                style={{
                  height: 50,
                  width: 50,
                  marginLeft: 20,
                  marginTop: 10,
                  backgroundColor: "#e1e1e1",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={require("../images/imagePicker.png")}
                  style={{ height: 24, width: 24 }}
                />
              </Button>
            </View>
            {this.state.imageComfirm && (
              <Image
                source={{ uri: this.state.imageComfirm.uri }}
                style={{
                  width: 180,
                  height: 180,
                  marginVertical: 10,
                  marginLeft: 20,
                }}
              />
            )}
            {(this.state.ForestFire || this.state.FireNotForest) && (
              <View>
                <Text style={{ fontSize: 14, paddingLeft: 20, marginTop: 10 }}>
                  Tình trạng:
                </Text>
                <ListItem style={styles.listStyle}>
                  <CheckBox
                    checked={this.state.ext}
                    onPress={() => this.ChangeExt()}
                  />
                  <Body>
                    <Text style={styles.content}>Đã dập tắt</Text>
                  </Body>
                </ListItem>
                <ListItem style={styles.listStyle}>
                  <CheckBox
                    checked={this.state.notExt}
                    onPress={() => this.ChangeExt()}
                  />
                  <Body>
                    <Text style={styles.content}>Chưa dập tắt</Text>
                  </Body>
                </ListItem>
              </View>
            )}

            <View style={{ flex: 1, marginBottom: 10, marginTop: 10 }}>
              <Separator bordered style={{ height: 50 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  Thông tin người xác minh
                </Text>
              </Separator>
            </View>
            <Text style={{ fontSize: 14, paddingLeft: 20, marginTop: 10 }}>
              Họ và tên:
            </Text>
            <ListItem
              style={{ borderBottomWidth: 0, height: 40, marginBottom: 10 }}
            >
              <Body>
                <TextInput
                  value={this.state.username}
                  onChangeText={(text) => this.setState({ username: text })}
                  style={{
                    borderBottomColor: "#c9c9c9",
                    borderBottomWidth: 1,
                    height: 40,
                  }}
                />
              </Body>
            </ListItem>
            <Text style={{ fontSize: 14, paddingLeft: 20, marginTop: 10 }}>
              Số điện thoại:
            </Text>
            <ListItem
              style={{ borderBottomWidth: 0, height: 40, marginBottom: 10 }}
            >
              <Body>
                <TextInput
                  keyboardType="numeric"
                  value={this.state.userphone}
                  onChangeText={(text) => this.checkPhone(text)}
                  style={{
                    borderBottomColor: "#c9c9c9",
                    borderBottomWidth: 1,
                    height: 40,
                  }}
                />
              </Body>
            </ListItem>
            <TouchableOpacity
              disabled={this.state.disabled}
              style={styles.comfirm}
              onPress={this._ComfirmFire}
            >
              <Text style={styles.comfirmText}>Gửi xác minh</Text>
            </TouchableOpacity>
          </Content>
        </View>
      </Root>
    );
  }
}
const styles = StyleSheet.create({
  content: {
    paddingLeft: 10,
  },
  comfirm: {
    marginHorizontal: 15,
    backgroundColor: "#007bff",
    borderRadius: 5,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 10,
    flexDirection: "row",
  },
  comfirmText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  listStyle: {
    borderBottomWidth: 0,
    marginRight: 20,
  },
});
