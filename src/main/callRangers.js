import React, { Component } from "react";
import { View, FlatList } from "react-native";
import {
  Content,
  ListItem,
  Body,
  Root,
  List,
  Left,
  Thumbnail,
  Label,
  Text,
} from "native-base";
import CusHeader from "../layout/header";
import call from "react-native-phone-call";
import { mainURL } from "../untils/Variable";

export default class callRangers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
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

  CallRanger(phone) {
    const args = {
      number: phone,
      prompt: false,
    };
    call(args).catch(console.error);
  }

  _renderItem(item) {
    const { navigation } = this.props;
    return (
      <List>
        <ListItem button onPress={() => this.CallRanger(item.phone)}>
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

  render() {
    const { navigation } = this.props;
    return (
      <Root>
        <View style={{ flex: 1, flexDirection: "column" }}>
          <CusHeader title="Danh sách liên hệ" navigation={navigation} />
          <Content>
            <FlatList
              data={this.state.listPhone}
              renderItem={({ item }) => this._renderItem(item)}
              keyExtractor={(item) => item.id.toString()}
            />
          </Content>
        </View>
      </Root>
    );
  }
}
