import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Content, ListItem, Separator, Body, List, Label } from 'native-base';
import CusHeader from '../layout/header';

export default class CommuneListFireLevel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            disabled: false,
            loading: false,
            ListData: [],
        };
    }

    componentDidMount() {

    }



    _renderItem(item) {
        const { navigation } = this.props;
        return (
            <List>
                <ListItem button onPress={() => navigation.navigate('detailInfoCommune', {item: item})}>
                    <Body>
                        <Label style={{ fontSize: 14, fontWeight: 'bold' }}>
                            {item.MAXA} - {item.XA}
                        </Label>
                        <Text style={{ fontSize: 12 }}>Huyện: {item.HUYEN}</Text>
                        <Text style={{ fontSize: 12 }}>Cấp cháy: {item.CAPCHAY}</Text>
                    </Body>
                </ListItem>
            </List>
        );
    }

    render() {
        const { navigation } = this.props;
        const listData = navigation.getParam('item', '');
        return (
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <CusHeader title="Danh sách cấp cháy" navigation={navigation} />
                <Content>
                    <View style={{ flex: 1 }}>
                        <Separator bordered style={{ height: 50 }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Danh sách xã</Text>
                        </Separator>
                    </View>
                    <FlatList
                        data={listData}
                        renderItem={({ item }) => this._renderItem(item)}
                        keyExtractor={item => item._id.toString()}
                    />

                </Content>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    lable: {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16
    },
    content: {
        paddingLeft: 10
    },
});