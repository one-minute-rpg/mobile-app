import React, { Component } from 'react';
import { Animated, View, Image, InteractionManager, TouchableOpacity, Text } from 'react-native';

import {OmrStyle} from 'omr-ui-utils';
import {DeviceService} from 'omr-services';

import {BaseHomePage} from './_base.page';

const LOGO = require('../../resources/images/logo.png');
const dimensions = DeviceService.getInstance().getDimensions();

export class HomePage extends BaseHomePage {
    constructor(props) {
        super(props);

        this._logoOpacity = new Animated.Value(0);
    }

    componentDidMount() {
        let self = this;

        setTimeout(function() {
            Animated.timing(
                self._logoOpacity,
                {toValue: 1, duration: 1000}
            ).start();
        }, 1000);
    }

    renderContent() {
        return (
            <View style={style.container}>
                <Animated.Image 
                    source={LOGO} 
                    style={[style.logo, {opacity: this._logoOpacity}]} 
                />
                <View style={style.buttons}>
                    <TouchableOpacity style={style.buttons__button}>
                        <Text style={style.buttons__button__text}>Jogar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const style = OmrStyle.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    logo: {
        height: 210,
        width: 210
    },
    buttons: {
        marginTop: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttons__button: {
        backgroundColor: 'rgba(0,0,0, 0.6)',
        borderWidth: 1,
        width: dimensions.width - 80,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 7
    },
    buttons__button__text: {
        color: OmrStyle.COLORS.WHITE,
        fontSize: 20
    }
})