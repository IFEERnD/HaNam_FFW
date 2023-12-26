import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Modal,
  FlatList,
  PermissionsAndroid,
  Alert,
  Platform,
} from "react-native";
import {
  Content,
  ListItem,
  Body,
  Separator,
  Form,
  Textarea,
  Picker,
  Left,
  List,
  Thumbnail,
  Header,
  Button,
  Right,
  Title,
} from "native-base";
import CusHeader from "../layout/header";
import Loader from "react-native-modal-loader";
import SendSMS from "react-native-sms";
import { selectContactPhone } from "react-native-select-contact";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { mainURL } from "../untils/Variable";

export default class contactSMS extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      loading: false,
      description: "",
      deg: "Đông",
      contentWarning: "Cháy rừng",
      range: "",
      username: "",
      methodContact: "1",
      inputPhone: "",
      contactBook: "",
      selectedPhone: "",
      modalVisible: false,
      listPhone: [],
    };
  }

  componentDidMount() {
    fetch(`${mainURL}/api/listContact/1`)
      .then((res) => res.json())
      .then((resJSON) => {
        if (resJSON.length > 0) {
          this.setState({
            listPhone: resJSON,
          });
        }
      });
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  CloseModal(phone) {
    this.setState({
      modalVisible: false,
      selectedPhone: phone,
    });
  }

  onRequestClose() {
    this.setModalVisible(false);
  }

  _renderItem(item) {
    const { navigation } = this.props;
    return (
      <List>
        <ListItem button onPress={() => this.CloseModal(item.phone)}>
          <Left
            style={{
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
              flex: 2,
            }}
          >
            <Thumbnail
              style={{ width: 48, height: 48, borderRadius: 0 }}
              source={require("../images/phone-call.png")}
            />
          </Left>
          <Body style={{ flex: 8, justifyContent: "center", paddingLeft: 10 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {item.department}
            </Text>
            <Text style={{ fontSize: 13 }}>
              {item.name} -{" "}
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "bold",
                  fontStyle: "italic",
                }}
              >
                {item.position}
              </Text>
            </Text>
          </Body>
        </ListItem>
      </List>
    );
  }

  checkRange = (text) => {
    // if (/^\d+$/.test(text) || text === '') {
    this.setState({
      range: text,
    });
    // }
  };

  inputPhone = (text) => {
    if (/^\d+$/.test(text) || text === "") {
      this.setState({
        inputPhone: text,
      });
    }
  };

  _SendSMS = async () => {
    const { navigation } = this.props;
    const myLocation = navigation.getParam("myLocation", "");
    const {
      description,
      deg,
      contentWarning,
      range,
      username,
      methodContact,
      inputPhone,
      contactBook,
      selectedPhone,
    } = this.state;
    const content =
      "Tôi phát hiện có " +
      contentWarning +
      " cách vị trí toạ độ (" +
      myLocation.point.lat +
      "," +
      myLocation.point.long +
      ") " +
      range +
      "(m) về hướng " +
      deg +
      ". Mô tả chi tiết: " +
      description +
      ". Người khai báo: " +
      username;
    if (methodContact == "1") {
      SendSMS.send(
        {
          body: content,
          recipients: [selectedPhone],
          successTypes: ["sent", "queued"],
          allowAndroidSendWithoutReadPermission: true,
        },
        (completed, cancelled, error) => {
          console.log(
            "SMS Callback: completed: " +
              completed +
              " cancelled: " +
              cancelled +
              "error: " +
              error
          );
        }
      );
    }
    if (methodContact == "2") {
      SendSMS.send(
        {
          body: content,
          recipients: [contactBook],
          successTypes: ["sent", "queued"],
          allowAndroidSendWithoutReadPermission: true,
        },
        (completed, cancelled, error) => {
          console.log(
            "SMS Callback: completed: " +
              completed +
              " cancelled: " +
              cancelled +
              "error: " +
              error
          );
        }
      );
    } else {
      SendSMS.send(
        {
          body: content,
          recipients: [inputPhone],
          successTypes: ["sent", "queued"],
          allowAndroidSendWithoutReadPermission: true,
        },
        (completed, cancelled, error) => {
          console.log(
            "SMS Callback: completed: " +
              completed +
              " cancelled: " +
              cancelled +
              "error: " +
              error
          );
        }
      );
    }
    navigation.goBack();
  };

  _GetContact = async () => {
    try {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: "Cho phép NinhBinhFFW truy cập danh bạ",
            buttonNegative: "Không",
            buttonPositive: "Có",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          selectContactPhone().then((selection) => {
            if (!selection) {
              return null;
            }
            let { contact, selectedPhone } = selection;
            this.setState({
              contactBook: selectedPhone.number,
            });
          });
        } else {
          Alert.alert(
            "Thông báo",
            "NinhBinhFFW bị từ chối truy cập danh bạ. Vui lòng cấp quyền truy cập danh bạ để sử dụng tính năng này!",
            [{ text: "Thoát", onPress: () => console.log("OK Pressed") }]
          );
        }
      } else {
        selectContactPhone().then((selection) => {
          if (!selection) {
            return null;
          }
          let { contact, selectedPhone } = selection;
          this.setState({
            contactBook: selectedPhone.number,
          });
        });
      }
    } catch (err) {}
  };

  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1, flexDirection: "column" }}>
        <CusHeader title="Gửi tin SMS" navigation={navigation} />
        <Loader
          title="Đang gửi tin nhắn..."
          size="small"
          loading={this.state.loading}
          color="#007bff"
        />
        <Content>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => this.onRequestClose()}
          >
            <Header style={{ backgroundColor: "#3f51b5" }}>
              <Left
                style={{
                  flex: 0.1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button transparent onPress={() => this.onRequestClose()}>
                  <FontAwesome5 name="angle-left" size={24} color={"white"} />
                </Button>
              </Left>
              <Body
                style={{
                  flex: 0.8,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Title style={{ color: "white" }}>Chọn người nhận</Title>
              </Body>
              <Right style={{ flex: 0.1 }}></Right>
            </Header>
            <FlatList
              data={this.state.listPhone}
              renderItem={({ item }) => this._renderItem(item)}
              keyExtractor={(item) => item.id.toString()}
            />
          </Modal>
          <View style={{ flex: 1, marginBottom: 10 }}>
            <Separator bordered style={{ height: 50 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                Thông tin cảnh báo, phát hiện
              </Text>
            </Separator>
          </View>
          <Text style={{ fontSize: 14, paddingLeft: 20, marginTop: 10 }}>
            Người phát hiện:
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
            Phương thức liên hệ:
          </Text>
          <Form
            style={{
              marginHorizontal: 15,
              borderBottomColor: "#c9c9c9",
              borderBottomWidth: 1,
            }}
          >
            <Picker
              style={{ height: 50, width: Dimensions.get("screen").width - 30 }}
              selectedValue={this.state.methodContact}
              onValueChange={(value) => {
                this.setState({ methodContact: value });
              }}
            >
              <Picker.Item label="Chọn từ danh sách hệ thống" value="1" />
              <Picker.Item label="Chọn từ danh bạ" value="2" />
              <Picker.Item label="Nhập số điện thoại" value="3" />
            </Picker>
          </Form>
          {this.state.methodContact == 1 ? (
            <View>
              <Text style={{ fontSize: 14, paddingLeft: 20, marginTop: 10 }}>
                Số điện thoại người nhận:
              </Text>
              <ListItem
                style={{ borderBottomWidth: 0, height: 60, marginBottom: 10 }}
                button
                onPress={() => {
                  this.setModalVisible(true);
                }}
              >
                <Left
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <AntDesign name="contacts" size={30} color={"black"} />
                </Left>
                <Body style={{ flex: 9 }}>
                  <TextInput
                    keyboardType="numeric"
                    value={this.state.selectedPhone}
                    placeholder="Vui lòng chọn trong danh sách hệ thống"
                    editable={false}
                    style={{
                      borderBottomColor: "#c9c9c9",
                      borderBottomWidth: 1,
                      height: 40,
                      color: "black",
                    }}
                  />
                </Body>
              </ListItem>
            </View>
          ) : this.state.methodContact == 3 ? (
            <View>
              <Text style={{ fontSize: 14, paddingLeft: 20, marginTop: 10 }}>
                Số điện thoại người nhận:
              </Text>
              <ListItem
                style={{ borderBottomWidth: 0, height: 40, marginBottom: 10 }}
              >
                <Body>
                  <TextInput
                    keyboardType="numeric"
                    value={this.state.inputPhone}
                    onChangeText={(text) => this.inputPhone(text)}
                    style={{
                      borderBottomColor: "#c9c9c9",
                      borderBottomWidth: 1,
                      height: 40,
                    }}
                  />
                </Body>
              </ListItem>
            </View>
          ) : (
            <View>
              <Text style={{ fontSize: 14, paddingLeft: 20, marginTop: 10 }}>
                Số điện thoại người nhận:
              </Text>
              <ListItem
                style={{ borderBottomWidth: 0, height: 60, marginBottom: 10 }}
                button
                onPress={this._GetContact}
              >
                <Left
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <AntDesign name="contacts" size={30} color={"black"} />
                </Left>
                <Body style={{ flex: 9 }}>
                  <TextInput
                    keyboardType="numeric"
                    value={this.state.contactBook}
                    placeholder="Vui lòng chọn trong danh bạ"
                    editable={false}
                    style={{
                      borderBottomColor: "#c9c9c9",
                      borderBottomWidth: 1,
                      height: 40,
                      color: "black",
                    }}
                  />
                </Body>
              </ListItem>
            </View>
          )}
          <Text style={{ fontSize: 14, paddingLeft: 20, marginTop: 10 }}>
            Nội dung cảnh báo:
          </Text>
          <Form
            style={{
              marginHorizontal: 15,
              borderBottomColor: "#c9c9c9",
              borderBottomWidth: 1,
            }}
          >
            <Picker
              style={{ height: 50, width: Dimensions.get("screen").width - 30 }}
              selectedValue={this.state.contentWarning}
              onValueChange={(value) => {
                this.setState({ contentWarning: value });
              }}
            >
              <Picker.Item label="Cháy rừng" value="cháy rừng" />
              <Picker.Item label="Chặt phá rừng" value="chặt phá rừng" />
              <Picker.Item label="Khác" value="Khác" />
            </Picker>
          </Form>
          <Text style={{ fontSize: 14, paddingLeft: 20, marginTop: 10 }}>
            Khoảng cách ước lượng với vị trí người dùng (m):
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
              style={{ height: 50, width: Dimensions.get("screen").width - 30 }}
              selectedValue={this.state.deg}
              onValueChange={(value) => {
                this.setState({ deg: value });
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
          <Text
            style={{
              fontSize: 14,
              paddingLeft: 20,
              marginBottom: 10,
              marginTop: 10,
            }}
          >
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
          <TouchableOpacity
            disabled={this.state.disabled}
            style={styles.comfirm}
            onPress={this._SendSMS}
          >
            <Text style={styles.comfirmText}>Gửi tin nhắn</Text>
          </TouchableOpacity>
        </Content>
      </View>
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
    height: 30,
  },
});
