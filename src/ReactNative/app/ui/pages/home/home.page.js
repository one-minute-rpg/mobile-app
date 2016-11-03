import React, { Component } from 'react';
import { Animated, View, Image, InteractionManager, TouchableOpacity, Text } from 'react-native';

import {OmrStyle} from 'omr-ui-utils';
import {DeviceService} from 'omr-services';
import {OmrText} from 'omr-components';

import {BaseHomePage} from './_base.page';

const LOGO = require('../../resources/images/logo.png');

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
                <TouchableOpacity style={style.play_button}>
                    <OmrText style={style.play_button__text}>Jogar</OmrText>
                </TouchableOpacity>
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
        height: 230,
        width: 230
    },
    play_button: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 30,
        left: 0,
        height: 80,
        width: OmrStyle.SIZES.WINDOW.WIDTH,
        backgroundColor: OmrStyle.COLORS.BLACK,
    },
    play_button__text: {
        color: OmrStyle.COLORS.WHITE,
        fontSize: 30,
    }
})