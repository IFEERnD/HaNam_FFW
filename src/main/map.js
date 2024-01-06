import React, { Component } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  Slider,
  PixelRatio,
  Platform,
} from "react-native";
import {
  Header,
  Left,
  Right,
  Body,
  Title,
  Footer,
  FooterTab,
  Button,
  Toast,
  Root,
} from "native-base";
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Callout,
  WMSTile,
} from "react-native-maps";
import colors from "../untils/colors";
import { transformLatLng } from "../untils/converProject";
import cs_string from "../untils/strings";
import { array_name_projection } from "../untils/projectionConst";
import RNLocation from "react-native-location";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider,
} from "react-native-popup-menu";
import { ActionSheetCustom as ActionSheet } from "react-native-actionsheet";
import { defaultCoordinatesProvince } from "../untils/Variable";
import {
  request,
  PERMISSIONS,
  requestMultiple,
} from "react-native-permissions";

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const { LATITUDE, LONGITUDE } = defaultCoordinatesProvince;
const LATITUDE_DELTA = 1;
const LONGITUDE_DELTA = ASPECT_RATIO * LATITUDE_DELTA;
const listDisplayLabel = [
  "huyen",
  "xa",
  "churung",
  "tk",
  "khoanh",
  "lo",
  "ldlr",
  "maldlr",
  "sldlr",
  "malr3",
];
const listDisplayLabelExplant = [
  "Huyện",
  "Xã",
  "Chủ rừng",
  "Tiểu khu",
  "Khoảnh",
  "Lô",
  "Trạng thái",
  "Mã trạng thái",
  "Loài cây",
  "Quy hoạch",
];
const listDisplayLabelFireMap = [
  "huyen",
  "xa",
  "churung",
  "tk",
  "khoanh",
  "lo",
  "ldlr",
  "maldlr",
  "sldlr",
  "malr3",
  "capchay",
  "chiso_p",
  "nhietdo",
  "doam",
  "luongmua",
];
const listDisplayLabelFireMapExplant = [
  "Huyện",
  "Xã",
  "Chủ rừng",
  "Tiểu khu",
  "Khoảnh",
  "Lô",
  "Trạng thái",
  "Mã trạng thái",
  "Loài cây",
  "Quy hoạch",
  "Cấp cháy",
  "Chỉ số P",
  "Nhiệt độ",
  "Độ ẩm",
  "Lượng mưa",
];

const fullLabel = {
  tt: "Thứ tự",
  id: "ID",
  matinh: "Mã tỉnh",
  mahuyen: "Mã huyện",
  maxa: "Mã xã",
  xa: "Xã",
  tk: "Tiểu khu",
  khoanh: "khoảnh",
  lo: "lô",
  thuad: "Thửa đất",
  tobando: "Tờ bản đồ",
  ddanh: "Địa danh",
  dtich: "Diện tích",
  dientichch: "dientichch",
  nggocr: "Nguồn gốc rừng",
  ldlr: "Loại đất loại rừng",
  maldlr: "Mã loại đất loại rừng",
  sldlr: "Loài cây trồng",
  namtr: "Năm trồng",
  captuoi: "Cấp tuổi",
  ktan: "Khép tán",
  nggocrt: "Nguồn gốc rừng trồng",
  thanhrung: "Tình trạng thành rừng",
  mgo: "Trữ lượng/ha",
  mtn: "Mật độ tre nứa/ha",
  mgolo: "Trữ lượng/lô",
  mtnlo: "Mật độ tre nứa",
  malr3: "Mã loại rừng 3",
  mdsd: "Mục đích sử dụng",
  mamdsd: "Mã mục đích sử dụng",
  dtuong: "Đối tượng",
  churung: "Chủ rừng",
  machur: "Mã chủ rừng",
  trchap: "Tranh chấp",
  quyensd: "Quyền sử dụng",
  thoihansd: "Thời hạn sử dụng",
  khoan: "Tình trạng khoán",
  nqh: "Ngoài quy hoạch",
  nguoink: "Người nhận khoán",
  nguoitrch: "Người tranh chấp",
  mangnk: "Mã người nhận khoán",
  mangtrch: "Mã người tranh chấp",
  ngsinh: "Tình trạng nguyên sinh",
  kd: "Kinh độ",
  vd: "Vĩ độ",
  capkd: "Cấp kinh độ",
  capvd: "Cấp vĩ độ",
  locu: "Lô cũ",
  vitrithua: "Vị trí thửa",
  tinh: "Tỉnh",
  huyen: "Huyện",
  capchay: "Cấp cháy",
  lapdia: "Lập địa",
};

let id = 0;

const Contact = ["Huỷ", "Gọi điện", "Gửi SMS", "Gửi Email"];

const DESTRUCTIVE_INDEX_Contact = 4;

export default class MapScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      moveToLocation: true,
      openPoint: null,
      type_map: 3,
      show_info_window: true,
      //dung cho hien thi he toa do
      myLocation: null,
      mylocationWGS84: null,
      forceRefresh: -1,
      onlyView: false,
      listWMS: [],
      centerPointWMS: null,
      centerPointOpen: null,
      show_wms: true,
      showFirePoint: true,
      transparencyWMS: 1,
      mapViewHeight: null,
      mapViewWidth: null,
      listFirePoint: [],
      selectTypeMapCode: "",
    };
  }

  componentWillMount() {
    if (Platform.OS === "android") {
      requestMultiple([
        PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ]).then((result) => {
        this._startUpdatingLocation();
      });
    } else {
      request(PERMISSIONS.IOS.LOCATION_ALWAYS).then((result) => {
        this._startUpdatingLocation();
      });
    }
    this._startUpdatingLocation();
  }

  _showOptions() {
    this.ActionSheet.show();
  }

  AccessIndex_Contact = (index) => {
    const { navigation } = this.props;
    if (this.state.location) {
      if (index == 1) {
        navigation.navigate("callRangers");
      }
      if (index == 2) {
        navigation.navigate("contactSMS", {
          myLocation: this.state.myLocation,
        });
      }
      if (index == 3) {
        navigation.navigate("contactEmail", {
          myLocation: this.state.myLocation,
        });
      }
    } else {
      Toast.show({
        text: "Chưa lấy được vị trí người dùng",
        type: "warning",
        position: "bottom",
        textStyle: {
          fontSize: 13,
          textAlign: "center",
        },
        duration: 2000,
      });
    }
  };

  _onMapPress(e) {
    console.log("_onlyShow_onMapPress 1: ");
  }

  _onlyShow_onMapPress(e) {
    let position = e.nativeEvent.position;
    if (Platform.OS === "android") {
      position.x = position.x / PixelRatio.get();
      position.y = position.y / PixelRatio.get();
    }
    let linkAPIgetFeatureInfo = this._getWMSInfoAPILink(
      Math.round(position.x),
      Math.round(position.y)
    );
    this._getWMSFeatureInfo(linkAPIgetFeatureInfo);
  }

  _startUpdatingLocation = () => {
    RNLocation.subscribeToLocationUpdates((locations) => {
      console.log("myLocation raw: ", locations);
      let point = transformLatLng(
        locations[0].latitude,
        locations[0].longitude,
        49
      );
      let poit_X = Math.floor(point.lat * 100) / 100;
      let poit_Y = Math.floor(point.long * 100) / 100;
      this.setState({
        location: locations[0],
        myLocation: {
          point: {
            lat: poit_X,
            long: poit_Y,
          },
          accuracy: Math.floor(locations[0]?.accuracy * 10) / 10,
        },
      });
    });
  };

  _onSelectWMS = (data) => {
    this.setState(
      {
        forceRefresh: id++,
      },
      function () {
        this.setState(data);
      }
    );
  };

  // ham lay link api quyery data tu WMS
  _getWMSInfoAPILink = (x, y) => {
    let { region, linkRootQueryInfo, mapViewHeight, mapViewWidth } = this.state;
    //Tinh bbbox
    let minX = region.longitude - region.longitudeDelta / 2; // westLng - min lng
    let minY = region.latitude - region.latitudeDelta / 2; // southLat - min lat
    let maxX = region.longitude + region.longitudeDelta / 2; // eastLng - max lng
    let maxY = region.latitude + region.latitudeDelta / 2; // northLat - max lat
    let linkAPIGetInfoFull = `${linkRootQueryInfo}&bbox=${minX},${minY},${maxX},${maxY}&width=${Math.round(
      mapViewWidth
    )}&height=${Math.round(mapViewHeight)}&x=${x}&y=${y}`;
    return linkAPIGetInfoFull;
  };

  async _getWMSFeatureInfo(linkAPIGetInfoFull) {
    try {
      this.setState({ loadingWMSGetInfo: true, viewFullInfo: false });
      const ApiCall = await fetch(linkAPIGetInfoFull);
      const regionFeatureInfo = await ApiCall.json();
      let disPlayData = "";
      let disPlayDataFull = "";
      if (this.state.selectTypeMapCode == "ChayIfee") {
        for (let [key, value] of Object.entries(
          regionFeatureInfo.features[0].properties
        )) {
          for (var i = 0; i < listDisplayLabelFireMap.length; i++) {
            if (
              key.toLowerCase() === listDisplayLabelFireMap[i].toLowerCase()
            ) {
              disPlayData =
                disPlayData +
                listDisplayLabelFireMapExplant[i] +
                ": " +
                value +
                "\n";
            }
          }
        }
      } else {
        for (let [key, value] of Object.entries(
          regionFeatureInfo.features[0].properties
        )) {
          for (var i = 0; i < listDisplayLabel.length; i++) {
            if (key.toLowerCase() === listDisplayLabel[i].toLowerCase()) {
              disPlayData =
                disPlayData + listDisplayLabelExplant[i] + ": " + value + "\n";
            }
          }
        }
      }

      for (let [key, value] of Object.entries(
        regionFeatureInfo.features[0].properties
      )) {
        console.log(key);
        disPlayDataFull =
          disPlayDataFull + fullLabel[key] + ": " + value + "\n";
      }
      console.log("Thong tin sau chuyen doi: ", disPlayData);
      this.setState(
        {
          regionFeatureInfo: regionFeatureInfo.features[0].properties,
          loadingWMSGetInfo: false,
        },
        function () {
          Alert.alert(
            "Thông tin đối tượng",
            disPlayData,
            [
              {
                text: "Xem thông tin đầy đủ",
                onPress: () =>
                  Alert.alert(
                    "Thông tin đối tượng",
                    disPlayDataFull,
                    [
                      {
                        text: "Ok",
                        onPress: () =>
                          this.setState({ loadingWMSGetInfo: false }),
                      },
                    ],
                    { cancelable: false }
                  ),
              },
              {
                text: "Ok",
                onPress: () => this.setState({ loadingWMSGetInfo: false }),
              },
            ],
            { cancelable: false }
          );

          this.setState({
            viewGroupButtonHandEdit: false,
            viewGroupButtonGPSEdit: false,
            current_action: 0,
            editing: null,
          });
        }
      );
      // return data
    } catch (err) {
      Alert.alert(
        "Thông tin đối tượng",
        "Không lấy được thông tin đối tượng",
        [
          {
            text: cs_string.cancel,
            onPress: () => this.setState({ loadingWMSGetInfo: false }),
          },
        ],
        { cancelable: false }
      );
    }
  }

  _gotoLocation(lat, long, latDelta, longDelta) {
    if (this.map != undefined) {
      this.map.animateToRegion(
        {
          latitude: lat,
          longitude: long,
          latitudeDelta: latDelta,
          longitudeDelta: longDelta,
        },
        1000
      );
    }
  }

  _onMapReady = () => {
    if (this.state.moveToLocation && this.state.openPoint !== null) {
      this.setState({ moveToLocation: false });
    } else {
      const pointVST = { lat: LATITUDE, lng: LONGITUDE };
      this._gotoLocation(pointVST.lat, pointVST.lng, 0.1, 0.1);
    }
  };

  _gotoCurrentLocation() {
    if (this.state.location) {
      console.log(this.state.location);
      this.map.animateToRegion({
        latitude: this.state.location.latitude,
        longitude: this.state.location.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      });
    } else {
      Toast.show({
        text: "Chưa lấy được vị trí người dùng",
        type: "warning",
        position: "bottom",
        textStyle: {
          fontSize: 13,
          textAlign: "center",
        },
        duration: 2000,
      });
    }
  }

  _gotoSelectLayout = () => {
    this.setState({
      listWMS: [],
    });
    this.props.navigation.navigate("SelectWMSLayer", {
      _onSelectWMS: this._onSelectWMS,
    });
  };

  _gotoSelectFirePoint = () => {
    this.props.navigation.navigate("firepoint");
    this.setState({ showFirePoint: true, listFirePoint: [] });
  };

  //Ham lay width ei cua man hinh
  onLayout = (event) => {
    const { height, width } = event.nativeEvent.layout;
    this.setState({ mapViewWidth: width, mapViewHeight: height });
  };

  render() {
    const { navigation } = this.props;
    const listFirePointRc = navigation.getParam("listFirePoint", []);
    let {
      type_map,
      show_wms,
      transparencyWMS,
      onlyView,
      type_view,
      region,
      showFirePoint,
      selectTypeMapCode,
      listFirePoint,
    } = this.state;
    if (type_map === 0) {
      type_view = MapView.MAP_TYPES.STANDARD;
    } else if (type_map === 1) {
      type_view = MapView.MAP_TYPES.SATELLITE;
    } else if (type_map === 2) {
      type_view = MapView.MAP_TYPES.TERRAIN;
    } else if (type_map === 3) {
      type_view = MapView.MAP_TYPES.HYBRID;
    }
    let reselactFirePoint = navigation.getParam("reselactFirePoint", false);
    if (reselactFirePoint && listFirePointRc != listFirePoint) {
      this._gotoLocation(LATITUDE, LONGITUDE, 2.2, 2.2);
      this.setState({ listFirePoint: listFirePointRc });
    }
    let view_wms = [];
    let mapOptions = {};
    let listLocation = [];
    if (show_wms) {
      let centerPointWMS = this.state.centerPointWMS;
      var links = this.state.listWMS;
      if (links.length > 0) {
        view_wms.push(
          links.map((WMSLayerLink) => {
            return (
              <WMSTile
                key={this.state.forceRefresh}
                urlTemplate={WMSLayerLink}
                opacity={transparencyWMS}
                zIndex={1}
                tileSize={512}
              />
            );
          })
        );
      }
      if (centerPointWMS !== null) {
        this._gotoLocation(centerPointWMS.lat, centerPointWMS.long, 0.07, 0.07);
        this.setState({ centerPointWMS: null });
      }
    }

    if (onlyView) {
      mapOptions.onPress = (e) => this._onlyShow_onMapPress(e);
    }

    if (showFirePoint) {
      listLocation.push(
        listFirePoint.map((marker) => {
          return (
            <Marker
              title={marker.properties.ACQ_DATE}
              coordinate={{
                latitude: Number(marker.geometry.coordinates[1]),
                longitude: Number(marker.geometry.coordinates[0]),
              }}
              zIndex={10}
            >
              {marker.properties.XACMINH == 1 && (
                <Image
                  style={{ width: 48, height: 48 }}
                  source={require("../images/fire_notconfirmed.png")}
                  resizeMode="cover"
                />
              )}
              {marker.properties.XACMINH == 2 && (
                <Image
                  style={{ width: 48, height: 48 }}
                  source={require("../images/confirmed_fire_forest.png")}
                  resizeMode="cover"
                />
              )}
              {marker.properties.XACMINH == 3 && (
                <Image
                  style={{ width: 48, height: 48 }}
                  source={require("../images/confirmed_not_fire.png")}
                  resizeMode="cover"
                />
              )}
              {marker.properties.XACMINH == 4 && (
                <Image
                  style={{ width: 48, height: 48 }}
                  source={require("../images/confirmed_fire_not_forest.png")}
                  resizeMode="cover"
                />
              )}
              <Callout
                style={{ padding: 5 }}
                onPress={() =>
                  this.props.navigation.navigate("detailFirePoint", {
                    item: marker,
                  })
                }
              >
                <View style={styles.bubble}>
                  <View>
                    <Text style={styles.name}>
                      Ngày: {marker.properties.ACQ_DATE}
                    </Text>
                    <Text style={styles.name}>
                      Giờ: {marker.properties.ACQ_TIME}
                    </Text>
                    <Text style={styles.name}>
                      Tên chủ rừng: {marker.properties.CHURUNG}
                    </Text>
                    <Text style={styles.name}>
                      Huyện: {marker.properties.HUYEN}
                    </Text>
                    <Text style={styles.name}>Xã: {marker.properties.XA}</Text>
                    <Text style={styles.name}>Lô: {marker.properties.LO}</Text>
                  </View>
                </View>
              </Callout>
            </Marker>
          );
        })
      );
    }

    return (
      <Root>
        <MenuProvider>
          <View style={styles.container}>
            <Header
              style={{
                backgroundColor: colors.head_bg,
                barStyle: "light-content",
              }}
              androidStatusBarColor={colors.head_bg}
            >
              <Left
                style={{
                  flex: 0.1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button transparent>
                  <FontAwesome5
                    name="angle-left"
                    size={24}
                    color={"white"}
                    onPress={() => this.props.navigation.goBack()}
                  />
                </Button>
              </Left>
              <Body
                style={{
                  flex: 0.8,
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <Title style={{ color: "white" }}>Bản đồ</Title>
              </Body>
              <Right
                style={{
                  flex: 0.1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Menu>
                  <MenuTrigger>
                    <MaterialIcons
                      name="more-horiz"
                      size={28}
                      color={"white"}
                    />
                  </MenuTrigger>
                  <MenuOptions>
                    <MenuOption disabled={true}>
                      <TouchableOpacity
                        style={{ flexDirection: "row" }}
                        onPress={() =>
                          this.setState({
                            showFirePoint: !this.state.showFirePoint,
                          })
                        }
                      >
                        <Text style={{ flex: 0.9 }}>Hiển thị điểm cháy</Text>
                        {this.state.showFirePoint && (
                          <Image
                            style={{ width: 20, height: 20, marginRight: -10 }}
                            source={require("../images/checked_checkbox.png")}
                          ></Image>
                        )}
                        {!this.state.showFirePoint && (
                          <View
                            style={{
                              width: 20,
                              height: 20,
                              borderWidth: 1,
                              borderColor: "grey",
                              marginRight: -10,
                            }}
                          ></View>
                        )}
                      </TouchableOpacity>
                    </MenuOption>
                    <MenuOption disabled={true}>
                      <TouchableOpacity
                        style={{ flexDirection: "row" }}
                        onPress={() =>
                          this.setState({ show_wms: !this.state.show_wms })
                        }
                      >
                        <Text style={{ flex: 0.9 }}>{cs_string.dbr_wms}</Text>

                        {this.state.show_wms && (
                          <Image
                            style={{ width: 20, height: 20, marginRight: -10 }}
                            source={require("../images/checked_checkbox.png")}
                          ></Image>
                        )}
                        {!this.state.show_wms && (
                          <View
                            style={{
                              width: 20,
                              height: 20,
                              borderWidth: 1,
                              borderColor: "grey",
                              marginRight: -10,
                            }}
                          ></View>
                        )}
                      </TouchableOpacity>
                      <Slider
                        style={{
                          marginTop: 5,
                          height: 10,
                          width: 120,
                          step: 0.1,
                        }}
                        value={this.state.transparencyWMS}
                        onValueChange={(value) =>
                          this.setState({ transparencyWMS: value })
                        }
                        disabledHoverEffect={false}
                      />
                    </MenuOption>
                  </MenuOptions>
                </Menu>
              </Right>
            </Header>
            <View style={{ flex: 1 }}>
              <MapView
                style={{ flex: 1 }}
                provider={PROVIDER_GOOGLE}
                showsUserLocation
                mapType="hybrid"
                showsMyLocationButton={false}
                showsCompass={true}
                mapPadding={{ bottom: 0 }}
                onMapReady={this._onMapReady}
                ref={(ref) => {
                  this.map = ref;
                }}
                onRegionChangeComplete={(Region) =>
                  this.setState({ region: Region })
                }
                initialRegion={{
                  latitude: LATITUDE,
                  longitude: LONGITUDE,
                  latitudeDelta: 0.02,
                  longitudeDelta: 0.02,
                }}
                onLayout={(event) => this.onLayout(event)}
                {...mapOptions}
              >
                {listLocation}
                {view_wms}
              </MapView>
              <Button
                transparent
                onPress={() => this._gotoCurrentLocation()}
                style={{
                  right: 10,
                  borderRadius: 50,
                  width: 48,
                  height: 48,
                  backgroundColor: "white",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  bottom: 10,
                  flexDirection: "column",
                }}
              >
                <Image
                  source={require("../images/mylocation.png")}
                  style={{ width: 24, height: 24, tintColor: "#606060" }}
                />
              </Button>
              <View
                style={{
                  position: "absolute",
                  justifyContent: "center",
                  borderBottomRightRadius: 20,
                  paddingTop: 5,
                  paddingLeft: 5,
                  top: 0,
                  flexDirection: "column",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    backgroundColor: "rgba(25,11,61,0.3)",
                  }}
                >
                  {this.state.show_info_window && (
                    <View>
                      <Text style={{ color: "white" }}>
                        {cs_string.projection + array_name_projection[33]}
                      </Text>
                      {this.state.myLocation != null && (
                        <View>
                          <Text style={{ color: "white" }}>
                            X: {this.state.myLocation.point.lat}
                          </Text>
                          <Text style={{ color: "white" }}>
                            Y: {this.state.myLocation.point.long}
                          </Text>
                          <Text style={{ color: "white" }}>
                            Sai số vệ tinh: {this.state.myLocation.accuracy} m
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                  <TouchableOpacity
                    style={{
                      backgroundColor: "rgba(25,11,61,0.2)",
                      width: 30,
                      borderRadius: 20,
                    }}
                    onPress={() => {
                      this.setState({
                        show_info_window: !this.state.show_info_window,
                      });
                    }}
                  >
                    {this.state.show_info_window && (
                      <Image
                        style={{ width: 25, height: 25, marginTop: "50%" }}
                        source={require("../images/back_view.png")}
                      ></Image>
                    )}
                    {!this.state.show_info_window && (
                      <Image
                        style={{ width: 30, height: 30 }}
                        source={require("../images/maximize.png")}
                      ></Image>
                    )}
                  </TouchableOpacity>
                </View>

                <Button
                  transparent
                  onPress={() => {
                    if (this.state.listWMS.length > 0) {
                      this.setState({
                        onlyView: !onlyView,
                      });
                      console.log("PressShowInfo: ", onlyView);
                      if (onlyView) {
                        Toast.show({
                          text: "Chế độ xem thông tin đã tắt",
                          type: "danger",
                          position: "bottom",
                          textStyle: {
                            fontSize: 13,
                            textAlign: "center",
                          },
                          duration: 2000,
                        });
                      } else {
                        Toast.show({
                          text: "Chế độ xem thông tin đã bật",
                          type: "success",
                          position: "bottom",
                          textStyle: {
                            fontSize: 13,
                            textAlign: "center",
                          },
                          duration: 2000,
                        });
                      }
                    } else {
                      Toast.show({
                        text: "Chưa chọn lớp bản đồ",
                        type: "warning",
                        position: "bottom",
                        textStyle: {
                          fontSize: 13,
                          textAlign: "center",
                        },
                        duration: 2000,
                      });
                    }
                  }}
                >
                  {this.state.onlyView && (
                    <Image
                      style={{ width: 30, height: 30 }}
                      source={require("../images/info_on.png")}
                    ></Image>
                  )}
                  {!this.state.onlyView && (
                    <Image
                      style={{ width: 30, height: 30 }}
                      source={require("../images/info.png")}
                    ></Image>
                  )}
                </Button>
              </View>
            </View>
            <View style={{ alignItems: "flex-start" }}>
              <ActionSheet
                ref={(o) => (this.ActionSheet = o)}
                title={
                  <Text style={{ color: "#000", fontSize: 18 }}>
                    Chọn phương thức liên hệ
                  </Text>
                }
                options={Contact}
                cancelButtonIndex={0}
                destructiveButtonIndex={DESTRUCTIVE_INDEX_Contact}
                onPress={(index) => this.AccessIndex_Contact(index)}
              />
            </View>
            {selectTypeMapCode == "ChayIfee" && (
              <View
                style={{
                  left: 10,
                  padding: 5,
                  width: 100,
                  height: 150,
                  flexDirection: "column",
                  alignContent: "center",
                  position: "absolute",
                  bottom: 120,
                  backgroundColor: "rgba(25,11,61,0.50)",
                }}
              >
                <Text style={{ fontSize: 14, color: "white" }}>Ghi chú:</Text>
                <View
                  style={{
                    alignContent: "center",
                    flexDirection: "row",
                    marginBottom: 3,
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#0000FF",
                      width: 25,
                      height: 20,
                      marginRight: 3,
                      justifyContent: "center",
                      borderRadius: 5,
                    }}
                  />
                  <Text
                    style={{
                      alignContent: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: 12,
                    }}
                  >
                    Cấp cháy 1
                  </Text>
                </View>
                <View
                  style={{
                    alignContent: "center",
                    flexDirection: "row",
                    marginBottom: 3,
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#33CC33",
                      width: 25,
                      height: 20,
                      marginRight: 3,
                      justifyContent: "center",
                      borderRadius: 5,
                    }}
                  />
                  <Text
                    style={{
                      alignContent: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: 12,
                    }}
                  >
                    Cấp cháy 2
                  </Text>
                </View>
                <View
                  style={{
                    alignContent: "center",
                    flexDirection: "row",
                    marginBottom: 3,
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#FFFF00",
                      width: 25,
                      height: 20,
                      marginRight: 3,
                      justifyContent: "center",
                      borderRadius: 5,
                    }}
                  />
                  <Text
                    style={{
                      alignContent: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: 12,
                    }}
                  >
                    Cấp cháy 3
                  </Text>
                </View>
                <View
                  style={{
                    alignContent: "center",
                    flexDirection: "row",
                    marginBottom: 3,
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#FF0000",
                      width: 25,
                      height: 20,
                      marginRight: 3,
                      justifyContent: "center",
                      borderRadius: 5,
                    }}
                  />
                  <Text
                    style={{
                      alignContent: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: 12,
                    }}
                  >
                    Cấp cháy 4
                  </Text>
                </View>
                <View
                  style={{
                    alignContent: "center",
                    flexDirection: "row",
                    marginBottom: 3,
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#C00000",
                      width: 25,
                      height: 20,
                      marginRight: 3,
                      justifyContent: "center",
                      borderRadius: 5,
                    }}
                  />
                  <Text
                    style={{
                      alignContent: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: 12,
                    }}
                  >
                    Cấp cháy 5
                  </Text>
                </View>
              </View>
            )}

            <Footer style={{ height: 60 }}>
              <FooterTab style={{ backgroundColor: "#FFFF" }}>
                <Button vertical onPress={this._gotoSelectLayout}>
                  <View style={styles.bottomMapNoneColor}>
                    <Image
                      style={{ width: 26, height: 26 }}
                      source={require("../images/map_offline.png")}
                    ></Image>
                  </View>
                  <Text>Bản đồ</Text>
                </Button>

                <Button
                  vertical
                  onPress={() => {
                    this._gotoSelectFirePoint();
                  }}
                >
                  <View style={styles.bottomMapNoneColor}>
                    <Image
                      style={{ width: 32, height: 32 }}
                      source={require("../images/firepoint.png")}
                    ></Image>
                  </View>
                  <Text>Điểm cháy</Text>
                </Button>

                <Button vertical onPress={() => this._showOptions()}>
                  <View style={styles.bottomMapNoneColor}>
                    <Image
                      style={{ width: 32, height: 32 }}
                      source={require("../images/communicate.png")}
                    ></Image>
                  </View>
                  <Text>Liên hệ</Text>
                </Button>
              </FooterTab>
            </Footer>
          </View>
        </MenuProvider>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container1: {
    flexDirection: "column",
    alignSelf: "flex-start",
  },
  // Callout bubble
  bubble: {
    flexDirection: "row",
    backgroundColor: "#fff",
    width: 150,
  },
  // Arrow below the bubble
  arrow: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: "#fff",
    borderWidth: 16,
    alignSelf: "center",
    marginTop: -32,
  },
  arrowBorder: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: "#007a87",
    borderWidth: 16,
    alignSelf: "center",
    marginTop: -0.5,
  },
  // Character name
  name: {
    fontSize: 10,
    marginBottom: 2,
    marginLeft: 10,
  },
  // Character image
  image: {
    width: 120,
    height: 80,
  },
});
