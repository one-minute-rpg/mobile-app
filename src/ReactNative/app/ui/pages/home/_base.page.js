import React, { Component } from 'react';
import { Animated, View, Image, InteractionManager } from 'react-native';

import {OmrStyle} from 'omr-ui-utils';

export class BaseHomePage extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        return (
            <View style={style.container}>
                <View style={style.content}>
                    {this.renderContent()}
                </View>
            </View>
        );
    }
}

const style = OmrStyle.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1
    }
})