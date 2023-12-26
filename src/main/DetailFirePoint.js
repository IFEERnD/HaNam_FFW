import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import CusHeader from '../layout/header';
import { Content, Body, Toast, Root, Left, ListItem, Label, Right } from 'native-base';
import { transformLatLng } from "../untils/converProject";

export default class DetailFirePoint extends Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: false,
            loading: false,
        };
    }


    onRefesh = () => {
        const { navigation } = this.props;
        navigation.state.params.onRefesh();
        navigation.goBack();
    }

    render() {
        const { navigation } = this.props;
        const item = navigation.getParam('item', '');
        return (
            <View style={{ flex: 1, flexDirection: 'column', marginBottom: 10 }}>
                <CusHeader title="Chi tiết điểm cháy" navigation={navigation} />
                <Content>
                    <View style={{ flex: 1, paddingTop: 15, paddingHorizontal: 20, justifyContent: 'flex-start' }}>
                        <Text style={styles.lable}>Thông tin chi tiết</Text>
                    </View>
                    <ListItem style={styles.listStyle}>
                        <Left style={{ flex: 4 }}>
                            <Label style={{ fontSize: 14, fontWeight: 'bold' }}>
                                Vĩ độ:
                            </Label>
                        </Left>
                        <Body style={{ flex: 6 }}>
                            <Text>
                                {Math.floor(transformLatLng(item.geometry.coordinates[1], item.geometry.coordinates[0], 49).long* 100) / 100} ({item.geometry.coordinates[1]}) 
                            </Text>
                        </Body>
                    </ListItem>
                    <ListItem style={styles.listStyle}>
                        <Left style={{ flex: 4 }}>
                            <Label style={{ fontSize: 14, fontWeight: 'bold' }}>
                                Kinh độ:
                            </Label>
                        </Left>
                        <Body style={{ flex: 6 }}>
                            <Text>
                            {Math.floor(transformLatLng(item.geometry.coordinates[1], item.geometry.coordinates[0], 49).lat* 100) / 100} ({item.geometry.coordinates[0]}) 
                            </Text>
                        </Body>
                    </ListItem>
                    <ListItem style={styles.listStyle}>
                        <Left style={{ flex: 4 }}>
                            <Label style={{ fontSize: 14, fontWeight: 'bold' }}>
                                Độ sáng:
                            </Label>
                        </Left>
                        <Body style={{ flex: 6 }}>
                            <Text>
                                {item.properties.BRIGHTNESS}
                            </Text>
                        </Body>
                    </ListItem>
                    <ListItem style={styles.listStyle}>
                        <Left style={{ flex: 4 }}>
                            <Label style={{ fontSize: 14, fontWeight: 'bold' }}>
                                Scan:
                            </Label>
                        </Left>
                        <Body style={{ flex: 6 }}>
                            <Text>
                                {item.properties.SCAN}
                            </Text>
                        </Body>
                    </ListItem>
                    <ListItem style={styles.listStyle}>
                        <Left style={{ flex: 4 }}>
                            <Label style={{ fontSize: 14, fontWeight: 'bold' }}>
                                Track:
                            </Label>
                        </Left>
                        <Body style={{ flex: 6 }}>
                            <Text>
                                {item.properties.TRACK}
                            </Text>
                        </Body>
                    </ListItem>
                    <ListItem style={styles.listStyle}>
                        <Left style={{ flex: 4 }}>
                            <Label style={{ fontSize: 14, fontWeight: 'bold' }}>
                                Ngày chụp:
                            </Label>
                        </Left>
                        <Body style={{ flex: 6 }}>
                            <Text>
                                {item.properties.ACQ_DATE}
                            </Text>
                        </Body>
                    </ListItem>
                    <ListItem style={styles.listStyle}>
                        <Left style={{ flex: 4 }}>
                            <Label style={{ fontSize: 14, fontWeight: 'bold' }}>
                                Giờ chụp:
                            </Label>
                        </Left>
                        <Body style={{ flex: 6 }}>
                            <Text>
                                {item.properties.ACQ_TIME}
                            </Text>
                        </Body>
                    </ListItem>
                    <ListItem style={styles.listStyle}>
                        <Left style={{ flex: 4 }}>
                            <Label style={{ fontSize: 14, fontWeight: 'bold' }}>
                                Vệ tinh:
                            </Label>
                        </Left>
                        <Body style={{ flex: 6 }}>
                            <Text>
                                {item.properties.SATELLITE}
                            </Text>
                        </Body>
                    </ListItem>
                    <ListItem style={styles.listStyle}>
                        <Left style={{ flex: 4 }}>
                            <Label style={{ fontSize: 14, fontWeight: 'bold' }}>
                                Độ tin cậy:
                            </Label>
                        </Left>
                        <Body style={{ flex: 6 }}>
                            <Text>
                                {item.properties.CONFIDENCE}
                            </Text>
                        </Body>
                    </ListItem>
                    <ListItem style={styles.listStyle}>
                        <Left style={{ flex: 4 }}>
                            <Label style={{ fontSize: 14, fontWeight: 'bold' }}>
                                Phiên bản vệ tinh:
                            </Label>
                        </Left>
                        <Body style={{ flex: 6 }}>
                            <Text>
                                {item.properties.VERSION}
                            </Text>
                        </Body>
                    </ListItem>
                    <ListItem style={styles.listStyle}>
                        <Left style={{ flex: 4 }}>
                            <Label style={{ fontSize: 14, fontWeight: 'bold' }}>
                                Độ sáng kênh 31:
                            </Label>
                        </Left>
                        <Body style={{ flex: 6 }}>
                            <Text>
                                {item.properties.BRIGHT_T31}
                            </Text>
                        </Body>
                    </ListItem>
                    <ListItem style={styles.listStyle}>
                        <Left style={{ flex: 4 }}>
                            <Label style={{ fontSize: 14, fontWeight: 'bold' }}>
                                Thời gian chụp:
                            </Label>
                        </Left>
                        <Body style={{ flex: 6 }}>
                            <Text>
                                {item.properties.DAYNIGHT}
                            </Text>
                        </Body>
                    </ListItem>
                    <ListItem style={styles.listStyle}>
                        <Left style={{ flex: 4 }}>
                            <Label style={{ fontSize: 14, fontWeight: 'bold' }}>
                                Mã tỉnh:
                            </Label>
                        </Left>
                        <Body style={{ flex: 6 }}>
                            <Text>
                                {item.properties.MATINH}
                            </Text>
                        </Body>
                    </ListItem>
                    <ListItem style={styles.listStyle}>
                        <Left style={{ flex: 4 }}>
                            <Label style={{ fontSize: 14, fontWeight: 'bold' }}>
                                Tên tỉnh:
                            </Label>
                        </Left>
                        <Body style={{ flex: 6 }}>
                            <Text>
                                {item.properties.TINH}
                            </Text>
                        </Body>
                    </ListItem>
                    <ListItem style={styles.listStyle}>
                        <Left style={{ flex: 4 }}>
                            <Label style={{ fontSize: 14, fontWeight: 'bold' }}>
                                Mã huyện:
                            </Label>
                        </Left>
                        <Body style={{ flex: 6 }}>
                            <Text>
                                {item.properties.MAHUYEN}
                            </Text>
                        </Body>
                    </ListItem>
                    <ListItem style={styles.listStyle}>
                        <Left style={{ flex: 4 }}>
                            <Label style={{ fontSize: 14, fontWeight: 'bold' }}>
                                Tên huyện:
                            </Label>
                        </Left>
                        <Body style={{ flex: 6 }}>
                            <Text>
                                {item.properties.HUYEN}
                            </Text>
                        </Body>
                    </ListItem>
                    <ListItem style={styles.listStyle}>
                        <Left style={{ flex: 4 }}>
                            <Label style={{ fontSize: 14, fontWeight: 'bold' }}>
                                Mã xã:
                            </Label>
                        </Left>
                        <Body style={{ flex: 6 }}>
                            <Text>
                                {item.properties.MAXA}
                            </Text>
                        </Body>
                    </ListItem>
                    <ListItem style={styles.listStyle}>
                        <Left style={{ flex: 4 }}>
                            <Label style={{ fontSize: 14, fontWeight: 'bold' }}>
                                Tên xã:
                            </Label>
                        </Left>
                        <Body style={{ flex: 6 }}>
                            <Text>
                                {item.properties.XA}
                            </Text>
                        </Body>
                    </ListItem>
                    <ListItem style={styles.listStyle}>
                        <Left style={{ flex: 4 }}>
                            <Label style={{ fontSize: 14, fontWeight: 'bold' }}>
                                Tiểu khu:
                            </Label>
                        </Left>
                        <Body style={{ flex: 6 }}>
                            <Text>
                                {item.properties.TIEUKHU}
                            </Text>
                        </Body>
                    </ListItem>
                    <ListItem style={styles.listStyle}>
                        <Left style={{ flex: 4 }}>
                            <Label style={{ fontSize: 14, fontWeight: 'bold' }}>
                                Khoảnh:
                            </Label>
                        </Left>
                        <Body style={{ flex: 6 }}>
                            <Text>
                                {item.properties.KHOANH}
                            </Text>
                        </Body>
                    </ListItem>
                    <ListItem style={styles.listStyle}>
                        <Left style={{ flex: 4 }}>
                            <Label style={{ fontSize: 14, fontWeight: 'bold' }}>
                                Lô:
                            </Label>
                        </Left>
                        <Body style={{ flex: 6 }}>
                            <Text>
                                {item.properties.LO}
                            </Text>
                        </Body>
                    </ListItem>
                    <ListItem style={styles.listStyle}>
                        <Left style={{ flex: 4 }}>
                            <Label style={{ fontSize: 14, fontWeight: 'bold' }}>
                                Mã LDLR:
                            </Label>
                        </Left>
                        <Body style={{ flex: 6 }}>
                            <Text>
                                {item.properties.MALDLR}
                            </Text>
                        </Body>
                    </ListItem>
                    <ListItem style={styles.listStyle}>
                        <Left style={{ flex: 4 }}>
                            <Label style={{ fontSize: 14, fontWeight: 'bold' }}>
                                LDLR:
                            </Label>
                        </Left>
                        <Body style={{ flex: 6 }}>
                            <Text>
                                {item.properties.LDLR}
                            </Text>
                        </Body>
                    </ListItem>
                    <ListItem style={styles.listStyle}>
                        <Left style={{ flex: 4 }}>
                            <Label style={{ fontSize: 14, fontWeight: 'bold' }}>
                                Chủ rừng:
                            </Label>
                        </Left>
                        <Body style={{ flex: 6 }}>
                            <Text>
                                {item.properties.CHURUNG}
                            </Text>
                        </Body>
                    </ListItem>
                    <ListItem style={styles.listStyle}>
                        <Left style={{ flex: 4 }}>
                            <Label style={{ fontSize: 14, fontWeight: 'bold' }}>
                                Tình trạng xác minh:
                            </Label>
                        </Left>
                        <Body style={{ flex: 6 }}>
                            <Text>
                                {
                                    item.properties.XACMINH == 1 ? " Chưa xác minh" :
                                        item.properties.XACMINH == 2 ? " Xác minh là cháy rừng" :
                                            item.properties.XACMINH == 3 ? " Xác minh không phải cháy rừng" : " Xác minh có cháy nhưng không phải cháy rừng"
                                }
                            </Text>
                        </Body>
                    </ListItem>
                    <ListItem style={styles.listStyle}>
                        <Left style={{ flex: 4 }}>
                            <Label style={{ fontSize: 14, fontWeight: 'bold' }}>
                                Tình trạng kiểm duyệt:
                            </Label>
                        </Left>
                        <Body style={{ flex: 6 }}>
                            <Text>
                                {
                                    item.properties.KIEMDUYET == 1 ? "Đã kiểm duyệt" : "Chưa kiểm duyệt"
                                }
                            </Text>
                        </Body>
                    </ListItem>
                    <ListItem>
                        <Left style={{ flex: 5 }}>
                            <TouchableOpacity disabled={this.state.disabled} style={[styles.comfirm, { backgroundColor: "#007bff" }]} onPress={() => this.props.navigation.navigate('map', { listFirePoint: [item], reselactFirePoint: true, lat: item.geometry.coordinates[0], long: item.geometry.coordinates[1] })}>
                                <Text style={styles.comfirmText}>Xem trên bản đồ</Text>
                            </TouchableOpacity>
                        </Left>
                        {
                            item.properties.KIEMDUYET == 0 ?
                                <Body style={{ flex: 5, marginLeft: 10 }}>
                                    <TouchableOpacity disabled={this.state.disabled} style={[styles.comfirm, { backgroundColor: "green" }]} onPress={() => this.props.navigation.navigate('comfirmFirePoint', { idPoint: item._id, onRefesh: () => this.onRefesh() })}>
                                        <Text style={styles.comfirmText}>Xác minh điểm cháy</Text>
                                    </TouchableOpacity>
                                </Body>
                                : null
                        }

                    </ListItem>
                </Content>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    lable: {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 14
    },
    listStyle: {
        marginRight: 20,
        paddingVertical: 0,
        marginVertical: 0
    },
    comfirm: {
        flex: 1,
        borderRadius: 5,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: 'row'
    },
    comfirmText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    },
});