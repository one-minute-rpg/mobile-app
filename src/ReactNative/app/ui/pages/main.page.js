import React, { Component } from 'react';
import { View, Text, Navigator, Image } from 'react-native';

import {DeviceService} from 'omr-services';
import {OmrStyle} from 'omr-ui-utils';
import {HomePage} from './home/home.page';
import {OmrConfiguration} from 'omr-components';

const imgBackground = require(`../resources/images/background.png`);

const routes = {
    'home': {
        title: ''
    }
};

export class MainPage extends Component {

    _renderScene(route, navigator) {
        if(route.name === 'home') return (<HomePage />);


        return null;
    }

    _renderNavigationLeftButton(route, navigator, index, navState) {
        if(index == 0) {
            return null;
        }

        return (
            <Text style={style.navbar__button}>Voltar</Text>
        );
    }

    _renderNavigationRightButton(route, navigator, index, navState) {
        return (
            <OmrConfiguration 
                style={{container: {
                    marginTop: 10
                }}} />
        );
    }

    _renderNavigationTitle (route, navigator, index, navState) {
        return <Text style={style.navbar__button}>{routes[route.name].title}</Text>;
    }

    _renderNavigationbar() {
        return (
            <Navigator.NavigationBar
                routeMapper={{
                    LeftButton: this._renderNavigationLeftButton,
                    RightButton: this._renderNavigationRightButton,
                    Title: this._renderNavigationTitle
                }}
                style={style.navbar}
                />
        );
    }

    render() {
        return (
            <View style={style.container}>
                <Image source={imgBackground} style={style.background}>
                    <Navigator
                        initialRoute={{ name: 'home' }}
                        renderScene={(route, navigator) => this._renderScene(route, navigator)}
                        navigationBar={this._renderNavigationbar()}
                        style={style.navigator}/>
                </Image>
            </View>
        );
    }
}

const style = OmrStyle.create({
    container: {
        flex: 1,
        minWidth: OmrStyle.SIZES.WINDOW.WIDTH,
        minHeight: OmrStyle.SIZES.WINDOW.HEIGHT
    },
    background: {
        flex: 1,
        resizeMode: 'cover',
        width: OmrStyle.SIZES.WINDOW.WIDTH,
        height: OmrStyle.SIZES.WINDOW.HEIGHT
    },  
    navigator: {
        flex: 1,
        paddingTop: 80
    },
    navbar: {
        backgroundColor: OmrStyle.COLORS.BLACK
    },
    navbar__button: {
        color: OmrStyle.COLORS.COLOR_WHITE
    }
});