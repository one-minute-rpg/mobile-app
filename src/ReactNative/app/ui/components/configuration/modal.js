import React, {Component} from 'react';
import {View, Image, TouchableOpacity, Modal} from 'react-native';
import {OmrStyle} from 'omr-ui-utils';
import {OmrText} from 'omr-components';

const IMG_ICON = require('./images/icon-settings.png');
const IMG_LINE = require('./images/metalic-line.png');

export class OmrConfigurationModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: props.visible
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            visible: nextProps.visible
        });
    }

    _closeModal() {
        this.setState({
            visible: false
        });
    }

    _renderHeader() {
        return (
            <View style={style.header}>
                <OmrText style={style.header__text}>Configurações</OmrText>
                <OmrText style={style.header__close} onPress={() => this._closeModal()}>X</OmrText>
                <Image source={IMG_LINE} style={style.header__line} />
            </View>
        );
    }

    render() {
        return (
            <Modal
                animationType={"slide"}
                transparent={false}
                visible={this.state.visible}
                onRequestClose={() => {}}
            >
                <View style={style.container}>
                    {this._renderHeader()}
                </View>
            </Modal>
        );
    }
}

const BUTTON_SIZE = 40;
const style = OmrStyle.create({
   container: {
       flex: 1,
       backgroundColor: OmrStyle.COLORS.BLACK
   },
   header: {
       height: 70,
       alignItems: 'center',
       justifyContent: 'center'
   },
   header__text: {
       fontSize: 20
   },
   header__close: {
       position: 'absolute',
       top: 0,
       right: 0,
       fontSize: 20,
       padding: 15
   },
   header__line: {
       height: 3,
       width: OmrStyle.SIZES.WINDOW.WIDTH,
       marginTop: 10
   }
});