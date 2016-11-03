import React, {Component} from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import {OmrStyle} from 'omr-ui-utils';

import {OmrConfigurationModal} from './modal';

const IMG_ICON = require('./images/icon-settings.png');

export class OmrConfiguration extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false
        };
    }

    _showModal() {
        this.setState({
            modalVisible: true
        });
    }

    render() {
        return (
            <TouchableOpacity 
                style={[style.container, this.props.style.container]}
                onPress={() => this._showModal()}
            >
                <OmrConfigurationModal visible={this.state.modalVisible} />
                <Image source={IMG_ICON} style={style.icon}></Image>
            </TouchableOpacity>
        );
    }
}

const BUTTON_SIZE = 40;
const style = OmrStyle.create({
   container: {
       height: BUTTON_SIZE,
       width: BUTTON_SIZE
   },
   icon: {
       resizeMode: 'contain',
       height: BUTTON_SIZE - 5,
       width: BUTTON_SIZE - 5
   }
});