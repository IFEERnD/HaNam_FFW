import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Platform,
  Image,
} from "react-native";
import {
  Content,
  ListItem,
  CheckBox,
  Body,
  Toast,
  Root,
  Separator,
  List,
  Left,
  Thumbnail,
  Label,
} from "native-base";
import CusHeader from "../layout/header";
import DatePicker from "react-native-datepicker";
import DateTimePicker from "@react-native-community/datetimepicker";
import Loader from "react-native-modal-loader";
import Moment from "moment";
import { mainURL } from "../untils/Variable";

export default class ListFirePoint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      DailyCheck: true,
      HisCheck: false,
      disabled: false,
      loading: false,
      DailyData: [],
      HisData: [],
      dateStart: new Date(),
      dateEnd: new Date(),
      isLoadData: false,
    };
  }

  componentDidMount() {
    fetch(`${mainURL}/api/hotspots`)
      .then((res) => res.json())
      .then((resJSON) => {
        if (resJSON.length > 0) {
          this.setState({
            DailyData: resJSON,
            isLoadData: true,
          });
        } else {
          this.setState({
            DailyData: resJSON,
            isLoadData: false,
          });
        }
      });
  }

  ChangeCheck() {
    this.setState({
      DailyCheck: !this.state.DailyCheck,
      HisCheck: !this.state.HisCheck,
      isLoadData: false,
    });
  }

  onRefesh = () => {
    this.GetFirePoint();
  };

  async GetFirePoint() {
    const { dateStart, dateEnd, DailyCheck } = this.state;
    if (DailyCheck) {
      this.setState({
        disabled: true,
        loading: true,
      });
      fetch(`${mainURL}/api/hotspots`)
        .then((res) => res.json())
        .then((resJSON) => {
          if (resJSON.length > 0) {
            this.setState({
              DailyData: resJSON,
              isLoadData: true,
            });
          } else {
            this.setState({
              DailyData: resJSON,
              isLoadData: false,
            });
          }
        });
    } else {
      if (!dateStart || !dateEnd) {
        Toast.show({
          text: "Vui lòng chọn đầy thời gian",
          type: "warning",
          position: "bottom",
          textStyle: {
            fontSize: 13,
            textAlign: "center",
          },
          duration: 3000,
        });
      } else {
        if (this.state.dateEnd <= this.state.dateStart) {
          Toast.show({
            text: "Thời gian kết thúc phải lớn hơn thời gian bắt đầu",
            type: "danger",
            position: "bottom",
            textStyle: {
              fontSize: 13,
              textAlign: "center",
            },
            duration: 3000,
          });
        } else {
          this.setState({
            disabled: true,
            loading: true,
          });
          var url =
            `${mainURL}/api/getHotSpotInfo?from=` +
            Moment(dateStart).format("Y-MM-DD") +
            "&to=" +
            Moment(dateEnd).format("Y-MM-DD");

          console.log(url);
          fetch(url)
            .then((res) => res.json())
            .then((resJSON) => {
              console.log(resJSON);
              if (resJSON.length > 0) {
                this.setState({
                  HisData: resJSON,
                  isLoadData: true,
                });
              } else {
                this.setState({
                  HisData: resJSON,
                  isLoadData: false,
                });
              }
            });
        }
      }
    }
    this.setState({
      disabled: false,
      loading: false,
    });
  }

  _renderItem(item) {
    const { navigation } = this.props;
    return (
      <List>
        <ListItem
          button
          onPress={() =>
            navigation.navigate("detailFirePoint", {
              item: item,
              onRefesh: () => this.onRefesh(),
            })
          }
        >
          <Left
            style={{
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
              flex: 2,
            }}
          >
            {item.properties.XACMINH == 1 && (
              <Thumbnail
                style={{ width: 48, height: 48 }}
                source={require("../images/fire_notconfirmed.png")}
              />
            )}
            {item.properties.XACMINH == 2 && (
              <Thumbnail
                style={{ width: 48, height: 48 }}
                source={require("../images/confirmed_fire_forest.png")}
              />
            )}
            {item.properties.XACMINH == 3 && (
              <Thumbnail
                style={{ width: 48, height: 48 }}
                source={require("../images/confirmed_not_fire.png")}
              />
            )}
            {item.properties.XACMINH == 4 && (
              <Thumbnail
                style={{ width: 48, height: 48 }}
                source={require("../images/confirmed_fire_not_forest.png")}
              />
            )}
          </Left>
          <Body style={{ flex: 8 }}>
            <Label style={{ fontSize: 14, fontWeight: "bold" }}>
              {item.properties.XACMINH} -
              {item.properties.XACMINH == 1
                ? " Chưa xác minh"
                : item.properties.XACMINH == 2
                ? " Xác minh là cháy rừng"
                : item.properties.XACMINH == 3
                ? " Xác minh không phải cháy rừng"
                : " Xác minh có cháy nhưng không phải cháy rừng"}
            </Label>
            <Text style={{ fontSize: 12 }}>Huyện: {item.properties.HUYEN}</Text>
            <Text style={{ fontSize: 12 }}>Xã: {item.properties.XA}</Text>
            <Text style={{ fontSize: 12 }}>
              Thời gian ghi nhận: {item.properties.ACQ_DATE}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontSize: 12 }}>
                Tiểu khu: {item.properties.TIEUKHU}
              </Text>
              <Text style={{ fontSize: 12 }}>
                {" "}
                - Khoảnh: {item.properties.KHOANH}
              </Text>
              <Text style={{ fontSize: 12 }}> - Lô: {item.properties.LO}</Text>
            </View>
            <Text style={{ fontSize: 12 }}>
              Độ tin cậy: {item.properties.CONFIDENCE}
            </Text>
          </Body>
        </ListItem>
      </List>
    );
  }

  render() {
    const { navigation } = this.props;
    const { isLoadData, DailyCheck, HisCheck, DailyData, HisData } = this.state;
    return (
      <Root>
        <View style={{ flex: 1, flexDirection: "column" }}>
          <CusHeader title="Danh sách điểm cháy" navigation={navigation} />
          <Loader
            title="Đang tải dữ liệu..."
            size="small"
            loading={this.state.loading}
            color="#007bff"
          />
          <Content>
            <View style={{ flex: 1 }}>
              <Separator bordered style={{ height: 50 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  Lựa chọn điểm cháy
                </Text>
              </Separator>
            </View>
            <ListItem style={styles.listStyle}>
              <CheckBox
                checked={this.state.DailyCheck}
                onPress={() => this.ChangeCheck()}
              />
              <Body>
                <Text style={styles.content}>Dữ liệu cháy trong 24h qua</Text>
              </Body>
            </ListItem>
            <ListItem style={styles.listStyle}>
              <CheckBox
                checked={this.state.HisCheck}
                onPress={() => this.ChangeCheck()}
              />
              <Body>
                <Text style={styles.content}>Lịch sử điểm cháy</Text>
              </Body>
            </ListItem>
            {Platform.OS === "android" && this.state.HisCheck && (
              <ListItem style={{ borderBottomWidth: 0 }}>
                <DatePicker
                  style={{ flex: 1 }}
                  date={this.state.dateStart}
                  mode="date"
                  locale="vi"
                  androidMode="spinner"
                  placeholder="Ngày bắt đầu"
                  format="YYYY-MM-DD"
                  confirmBtnText="Chọn"
                  cancelBtnText="Huỷ"
                  customStyles={{
                    dateIcon: {
                      position: "absolute",
                      left: 0,
                      top: 4,
                      marginLeft: 0,
                    },
                    dateInput: {
                      flex: 1,
                      paddingVertical: 20,
                      justifyContent: "center",
                      borderBottomWidth: 1,
                      borderBottomColor: "#c9c9c9",
                      borderWidth: 0,
                    },
                  }}
                  onDateChange={(date) => {
                    this.setState({ dateStart: date, isLoadData: false });
                  }}
                />
              </ListItem>
            )}
            {Platform.OS === "ios" && this.state.HisCheck && (
              <View>
                <Text style={{ fontSize: 14, paddingLeft: 20, marginTop: 10 }}>
                  Thời gian bắt đầu:
                </Text>
                <ListItem style={{ borderBottomWidth: 0 }}>
                  <DateTimePicker
                    testID="dateStart"
                    style={{ flex: 1 }}
                    value={this.state.dateStart}
                    mode="date"
                    locale="vi"
                    dateFormat="YYYY-MM-DD"
                    onChange={(event, date) => {
                      this.setState({ dateStart: date, isLoadData: false });
                    }}
                  />
                </ListItem>
              </View>
            )}
            {Platform.OS === "android" && this.state.HisCheck && (
              <ListItem style={{ borderBottomWidth: 0 }}>
                <DatePicker
                  style={{ flex: 1 }}
                  date={this.state.dateEnd}
                  mode="date"
                  locale="vi"
                  androidMode="spinner"
                  placeholder="Ngày kết thúc"
                  format="YYYY-MM-DD"
                  confirmBtnText="Chọn"
                  cancelBtnText="Huỷ"
                  customStyles={{
                    dateIcon: {
                      position: "absolute",
                      left: 0,
                      top: 4,
                      marginLeft: 0,
                    },
                    dateInput: {
                      flex: 1,
                      paddingVertical: 20,
                      justifyContent: "center",
                      borderBottomWidth: 1,
                      borderBottomColor: "#c9c9c9",
                      borderWidth: 0,
                      color: "black",
                    },
                  }}
                  onDateChange={(date) => {
                    this.setState({ dateEnd: date, isLoadData: false });
                  }}
                />
              </ListItem>
            )}
            {Platform.OS === "ios" && this.state.HisCheck && (
              <View>
                <Text style={{ fontSize: 14, paddingLeft: 20, marginTop: 10 }}>
                  Thời gian kết thúc:
                </Text>
                <ListItem style={{ borderBottomWidth: 0 }}>
                  <DateTimePicker
                    testID="dateEnd"
                    style={{ flex: 1 }}
                    value={this.state.dateEnd}
                    mode="date"
                    locale="vi"
                    dateFormat="YYYY-MM-DD"
                    onChange={(event, date) => {
                      this.setState({ dateEnd: date, isLoadData: false });
                    }}
                  />
                </ListItem>
              </View>
            )}

            {!isLoadData ? (
              <TouchableOpacity
                disabled={this.state.disabled}
                style={styles.comfirm}
                onPress={() => this.GetFirePoint()}
              >
                <Text style={styles.comfirmText}>Tải dữ liệu điểm cháy</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.comfirm}
                onPress={() => {
                  var listFirePoint = [];
                  if (DailyCheck == true && HisCheck == false) {
                    listFirePoint = DailyData;
                  } else if (DailyCheck == false && HisCheck == true) {
                    listFirePoint = HisData;
                  }

                  this.setState({ isLoadData: false });
                  this.props.navigation.navigate("map", {
                    listFirePoint: listFirePoint,
                    reselactFirePoint: true,
                  });
                }}
              >
                <Text style={styles.comfirmText}>Mở trong bản đồ</Text>
              </TouchableOpacity>
            )}
            {this.state.DailyCheck ? (
              <Separator bordered style={{ height: 50 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  Điểm cháy trong ngày
                </Text>
              </Separator>
            ) : (
              <Separator bordered style={{ height: 50 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  Lịch sử điểm cháy
                </Text>
              </Separator>
            )}
            {this.state.DailyCheck ? (
              this.state.DailyData.length > 0 ? (
                <FlatList
                  data={this.state.DailyData}
                  renderItem={({ item }) => this._renderItem(item)}
                  keyExtractor={(item) => item._id.toString()}
                />
              ) : (
                <View style={{ flex: 1, marginTop: 30, alignItems: "center" }}>
                  <Image
                    source={require("../images/emptyItem.png")}
                    style={{ width: 128, height: 128 }}
                  />
                  <Text>Không có điểm cháy trong ngày</Text>
                </View>
              )
            ) : this.state.HisData.length > 0 ? (
              <FlatList
                data={this.state.HisData}
                renderItem={({ item }) => this._renderItem(item)}
                keyExtractor={(item) => item._id.toString()}
              />
            ) : (
              <View style={{ flex: 1, marginTop: 30, alignItems: "center" }}>
                <Image
                  source={require("../images/emptyItem.png")}
                  style={{ width: 128, height: 128 }}
                />
                <Text>Khoảng thời gian đã chọn không có điểm cháy</Text>
              </View>
            )}
          </Content>
        </View>
      </Root>
    );
  }
}
const styles = StyleSheet.create({
  lable: {
    fontWeight: "bold",
    textAlign: "left",
    fontSize: 16,
    color: "red",
  },
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
    borderBottomWidth: 1,
    borderBottomColor: "#c9c9c9",
    borderWidth: 0,
    marginRight: 20,
  },
});
