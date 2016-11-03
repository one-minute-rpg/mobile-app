/**
 * @providesModule omr-ui-utils
 */

import {StyleSheet, Dimensions} from 'react-native';

var {height, width} = Dimensions.get('window');

export class OmrStyle {
    static create(style) {
        return StyleSheet.create(style);
    }

    static border(color, width = 1) {
        return {
            borderWidth: width,
            borderColor: color
        };
    }    
}

OmrStyle.COLORS = {
    COLOR_1: '#000',
    BLACK: '#000',
    WHITE: '#fff'
};

OmrStyle.FONTS = {
    REGULAR: 'Cochin',
    BOLD: 'Cochin bold'
};

OmrStyle.SIZES = {
    WINDOW: {
        HEIGHT: height,
        WIDTH: width
    }
};