import React, { Component } from 'react'
import {
    Header, Button, Left,
    Body, Right, Title
} from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
export default class header extends Component {

    render() {
        let { title, isHome } = this.props;
        return (
            <Header style={{ backgroundColor: '#3f51b5' }}>
                <Left style={{ flex: 0.1, alignItems: 'center', justifyContent: 'center' }}>
                    {
                        isHome ?
                            <Button transparent onPress={() => this.props.navigation.openDrawer()}>
                                <Entypo name='menu' size={24} color={'white'} />
                            </Button>
                            :
                            <Button transparent onPress={() => this.props.navigation.goBack()}>
                                <FontAwesome5 name='angle-left' size={24} color={'white'} />
                            </Button>
                    }
                </Left>
                <Body style={{ flex: 0.8, alignItems: 'center', justifyContent: 'center' }}>
                    <Title style={{ color: 'white' }}>{title}</Title>
                </Body>
                <Right style={{ flex: 0.1 }}>
                </Right>
            </Header>
        );
    }
}

