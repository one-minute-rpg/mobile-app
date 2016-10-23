import React, { Component, PropTypes } from 'react';
import { Animated, View, Image, InteractionManager, TouchableOpacity } from 'react-native';
import {DeviceService} from 'omr-services';
import {OmrStyle} from 'omr-ui-utils';

let imgPath = '../../resources/images';

let dimensions = DeviceService.getInstance().getDimensions();
let imgMetalicLine = require('../../resources/images/metalic-line.png');
let imgSoundOn = require('../../resources/images/icon-sound-on.png');
let imgSoundOff = require('../../resources/images/icon-sound-off.png');
let imgSettings = require('../../resources/images/icon-settings.png');

export class ActionBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            soundState: false
        };
    }

    componentDidMount() {
        
    }

    _toggleSound() {
        this.setState({
            soundState: !this.state.soundState
        });
    }

    _settings() {
        alert('settings');
    }

    render() {
        let soundImage = this.state.soundState ? imgSoundOn : imgSoundOff;

        return (
            <View style={[style.container, this.props.style.container]}>
                <Image source={imgMetalicLine} style={style.metalic_line}/>
                <View style={style.content}>
                    <TouchableOpacity style={style.icon} onPress={() => this._settings()}>
                        <Image source={imgSettings} style={[style.icon__image]} />
                    </TouchableOpacity>
                    <TouchableOpacity style={style.icon} onPress={() => this._toggleSound()}>
                        <Image source={soundImage} style={[style.icon__image, {height: 50, width: 50, marginTop: -6}]} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

ActionBar.HEIGHT = 70;

const style = OmrStyle.create({
    container: {
        backgroundColor: OmrStyle.COLORS.COLOR_1,
        width: dimensions.width,
        height: ActionBar.HEIGHT,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingRight: 6
    },  
    metalic_line: {
        width: dimensions.width,
        height: 3
    },
    icon: {
        paddingTop: 3,
        width: 50,
        height: 50
    },
    icon__image: {
        width: 35,
        height: 35
    }
});