import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native';
import CusHeader from '../layout/header';
import { Content, Body, Toast, Root, Left, ListItem, Label } from 'native-base';

export default class DetailInfoCommune extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        const { navigation } = this.props;
        const item = navigation.getParam('item', '');
        return (
            <View style={{ flex: 1, flexDirection: 'column', marginBottom: 10 }}>
                <CusHeader title="Thông tin chi tiết" navigation={navigation} />
                <Content>
                    <ListItem style={styles.listStyle}>
                        <Left style={{ flex: 4 }}>
                            <Label style={{ fontSize: 14, fontWeight: 'bold' }}>
                                Mã tỉnh:
                            </Label>
                        </Left>
                        <Body style={{ flex: 6 }}>
                            <Text>
                                {item.MATINH}
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
                                {item.TINH}
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
                                {item.MAHUYEN}
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
                                {item.HUYEN}
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
                                {item.MAXA}
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
                                {item.XA}
                            </Text>
                        </Body>
                    </ListItem>
                    <ListItem style={styles.listStyle}>
                        <Left style={{ flex: 4 }}>
                            <Label style={{ fontSize: 14, fontWeight: 'bold' }}>
                                Lượng mưa:
                            </Label>
                        </Left>
                        <Body style={{ flex: 6 }}>
                            <Text>
                                {item.RAIN} mm
                            </Text>
                        </Body>
                    </ListItem>
                    <ListItem style={styles.listStyle}>
                        <Left style={{ flex: 4 }}>
                            <Label style={{ fontSize: 14, fontWeight: 'bold' }}>
                                Cấp cháy:
                            </Label>
                        </Left>
                        <Body style={{ flex: 6 }}>
                            <Text>
                                {item.CAPCHAY}
                            </Text>
                        </Body>
                    </ListItem>
                    <ListItem style={styles.listStyle}>
                        <Left style={{ flex: 4 }}>
                            <Label style={{ fontSize: 14, fontWeight: 'bold' }}>
                                Chỉ số P:
                            </Label>
                        </Left>
                        <Body style={{ flex: 6 }}>
                            <Text>
                                {item.CHISOP}
                            </Text>
                        </Body>
                    </ListItem>
                    <ListItem style={styles.listStyle}>
                        <Left style={{ flex: 4 }}>
                            <Label style={{ fontSize: 14, fontWeight: 'bold' }}>
                                Nhiệt độ:
                            </Label>
                        </Left>
                        <Body style={{ flex: 6 }}>
                            <Text>
                                {item.TEMP}°C
                            </Text>
                        </Body>
                    </ListItem>
                    <ListItem style={styles.listStyle}>
                        <Left style={{ flex: 4 }}>
                            <Label style={{ fontSize: 14, fontWeight: 'bold' }}>
                                Độ ẩm:
                            </Label>
                        </Left>
                        <Body style={{ flex: 6 }}>
                            <Text>
                                {item.HUMIDITY}%
                            </Text>
                        </Body>
                    </ListItem>
                    <ListItem style={styles.listStyle}>
                        <Left style={{ flex: 4 }}>
                            <Label style={{ fontSize: 14, fontWeight: 'bold' }}>
                                Tốc độ gió:
                            </Label>
                        </Left>
                        <Body style={{ flex: 6 }}>
                            <Text>
                                {item.WIN_SPEED} m/s
                            </Text>
                        </Body>
                    </ListItem>
                    <ListItem style={styles.listStyle}>
                        <Left style={{ flex: 4 }}>
                            <Label style={{ fontSize: 14, fontWeight: 'bold' }}>
                                Hướng gió:
                            </Label>
                        </Left>
                        <Body style={{ flex: 6 }}>
                            <Text>
                                {item.WIN_DEG}°
                            </Text>
                        </Body>
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
    }
});