import React, { Component } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Content, ListItem, Body, List, Label, Separator } from "native-base";
import CusHeader from "../layout/header";
import { mainURL } from "../untils/Variable";

export default class ListFireLevel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      loading: false,
      FireLevels: [],
    };
  }

  componentDidMount() {
    fetch(`${mainURL}/api/capchayIFEE`)
      .then((res) => res.json())
      .then((resJSON) => {
        const Data = resJSON;
        const DataTemp = this.getUnique(Data, "MAHUYEN");
        const listHuyen = [];
        for (var i = 0; i < DataTemp.length; i++) {
          const ListData = [];
          for (var j = 0; j < Data.length; j++) {
            if (DataTemp[i].MAHUYEN == Data[j].MAHUYEN) {
              ListData.push(Data[j]);
            }
          }
          const temp = {
            mahuyen: DataTemp[i].MAHUYEN,
            huyen: DataTemp[i].HUYEN,
            Data: ListData,
          };
          listHuyen.push(temp);
        }

        const detail = [];
        for (var i = 0; i < listHuyen.length; i++) {
          var fireLv1 = 0;
          var fireLv2 = 0;
          var fireLv3 = 0;
          var fireLv4 = 0;
          var fireLv5 = 0;
          for (var j = 0; j < listHuyen[i].Data.length; j++) {
            if (listHuyen[i].Data[j].CAPCHAY == 1) {
              fireLv1++;
            }
            if (listHuyen[i].Data[j].CAPCHAY == 2) {
              fireLv2++;
            }
            if (listHuyen[i].Data[j].CAPCHAY == 3) {
              fireLv3++;
            }
            if (listHuyen[i].Data[j].CAPCHAY == 4) {
              fireLv4++;
            }
            if (listHuyen[i].Data[j].CAPCHAY == 5) {
              fireLv5++;
            }
          }
          const listtemp = {
            mahuyen: listHuyen[i].mahuyen,
            huyen: listHuyen[i].huyen,
            tongxa: listHuyen[i].Data.length,
            capI: fireLv1,
            capII: fireLv2,
            capIII: fireLv3,
            capIV: fireLv4,
            capV: fireLv5,
            listXa: listHuyen[i].Data,
          };
          detail.push(listtemp);
        }

        this.setState({
          FireLevels: detail,
        });
      });
  }

  getUnique(arr, index) {
    const unique = arr
      .map((e) => e[index])
      .map((e, i, final) => final.indexOf(e) === i && i)
      .filter((e) => arr[e])
      .map((e) => arr[e]);
    return unique;
  }

  _renderItem(item) {
    const { navigation } = this.props;
    return (
      <List>
        <ListItem
          button
          onPress={() =>
            navigation.navigate("communeListFireLevel", { item: item.listXa })
          }
        >
          <Body>
            <Label style={{ fontSize: 14, fontWeight: "bold" }}>
              {item.mahuyen} - {item.huyen}
            </Label>
            <Text style={{ fontSize: 12 }}>Tổng số xã: {item.tongxa}</Text>
            <Text style={{ fontSize: 12 }}>Số xã ở các cấp cháy:</Text>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontSize: 12 }}>Cấp V: {item.capV}, </Text>
              <Text style={{ fontSize: 12 }}>Cấp IV: {item.capIV}, </Text>
              <Text style={{ fontSize: 12 }}>Cấp III: {item.capIII}, </Text>
              <Text style={{ fontSize: 12 }}>Cấp II: {item.capII}, </Text>
              <Text style={{ fontSize: 12 }}>Cấp I: {item.capI}</Text>
            </View>
          </Body>
        </ListItem>
      </List>
    );
  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1, flexDirection: "column" }}>
        <CusHeader title="Danh sách cấp cháy huyện" navigation={navigation} />
        <FlatList
          data={this.state.FireLevels}
          renderItem={({ item }) => this._renderItem(item)}
          keyExtractor={(item) => item.huyen.toString()}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  lable: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  content: {
    paddingLeft: 10,
  },
});
