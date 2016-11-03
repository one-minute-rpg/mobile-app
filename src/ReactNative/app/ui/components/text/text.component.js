import React, {Component} from 'react';
import {Text} from 'react-native';
import {OmrStyle} from 'omr-ui-utils';

export class OmrText extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Text {...this.props} style={[style.text, this.props.style]}>
                {this.props.children}
            </Text>
        );
    }
}

const style = OmrStyle.create({
    text: {
        fontFamily: OmrStyle.FONTS.REGULAR,
        color: OmrStyle.COLORS.WHITE
    }
});