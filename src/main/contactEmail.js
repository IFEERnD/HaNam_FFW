import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  FlatList,
  Modal,
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
import ImagePicker from "react-native-image-picker";
import Mailer from "react-native-mail";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { mainURL } from "../untils/Variable";

export default class contactEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      loading: false,
      description: "",
      deg: "Đông",
      contentWarning: "cháy rừng",
      range: "",
      username: "",
      imageContact: null,
      mailcontact: "",
      modalVisible: false,
      listEmail: [],
    };
  }

  componentDidMount() {
    fetch(`${mainURL}/api/listContact/1`)
      .then((res) => res.json())
      .then((resJSON) => {
        if (resJSON.length > 0) {
          this.setState({
            listEmail: resJSON,
          });
        }
      });
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  CloseModal(mailContact) {
    this.setState({
      modalVisible: false,
      mailcontact: mailContact,
    });
  }

  onRequestClose() {
    this.setModalVisible(false);
  }

  _renderItem(item) {
    const { navigation } = this.props;
    return (
      <List>
        <ListItem button onPress={() => this.CloseModal(item.email)}>
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
    //if (/^\d+$/.test(text) || text === '') {
    this.setState({
      range: text,
    });
    //}
  };

  _chooseFile = () => {
    var options = {
      title: "Chọn phương thức",
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else {
        this.setState({
          imageContact: response,
        });
      }
    });
  };

  sendEmail = async () => {
    // const imageContact = this.state;
    //console.log(imageContact);'
    const { navigation } = this.props;
    const myLocation = navigation.getParam("myLocation", "");
    const { description, deg, contentWarning, range, username, mailcontact } =
      this.state;
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
      ".<br>Mô tả chi tiết: " +
      description +
      ".<br>Người khai báo: " +
      username +
      ".<br><br><i>Ứng dụng phát triển bởi phòng R&D Viện Sinh thái rừng và Môi trường</i></b>";
    try {
      Mailer.mail(
        {
          subject: "Phản hồi phát hiện cháy rừng/mất rừng",
          recipients: [mailcontact],
          body: content,
          isHTML: true,
          // attachments: [{
          //     path: imageContact.path,
          //     type: 'JPG',
          //     name: imageContact.fileName,
          // }]
        },
        (error, event) => {
          console.log(error);
        }
      );
    } catch (error) {}
    this.setState({
      disabled: false,
      loading: false,
      description: "",
      deg: "Đông",
      contentWarning: "cháy rừng",
      range: "",
      username: "",
      imageContact: null,
      mailcontact: "qlbvklnb@gmail.com",
    });
    navigation.goBack();
  };

  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1, flexDirection: "column" }}>
        <CusHeader title="Gửi tin Email" navigation={navigation} />
        <Loader
          title="Đang gửi email..."
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
              data={this.state.listEmail}
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
            Chọn người nhận:
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
              <MaterialCommunityIcons
                name="email-search"
                size={30}
                color={"black"}
              />
            </Left>
            <Body style={{ flex: 9 }}>
              <TextInput
                value={this.state.mailcontact}
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
              <Picker.Item label="Khác" value="khác" />
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
          {/* <Text style={{ fontSize: 14, paddingLeft: 20, marginTop: 10 }}>Ảnh chụp:</Text>
                        <Button onPress={this._chooseFile} transparent style={{ height: 50, width: 50, marginLeft: 20, marginTop: 10, backgroundColor: '#e1e1e1', justifyContent: 'center', alignItems: 'center' }}>
                            <FontAwesome name='camera' size={24} color={'black'} />
                        </Button>
                        {this.state.imageContact != null && <Image
                            source={{ uri: this.state.imageContact.uri }}
                            style={{ width: 180, height: 180, marginVertical: 10, marginLeft: 20 }}
                        />} */}
          <TouchableOpacity
            disabled={this.state.disabled}
            style={styles.comfirm}
            onPress={this.sendEmail}
          >
            <Text style={styles.comfirmText}>Gửi Email</Text>
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
