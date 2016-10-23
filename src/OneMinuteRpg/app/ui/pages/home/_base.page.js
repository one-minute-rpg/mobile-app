import React, { Component } from 'react';
import { Animated, View, Image, InteractionManager } from 'react-native';

import {OmrStyle} from 'omr-ui-utils';
import {ActionBar} from 'omr-components';

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
                
                <ActionBar style={{container: style.action_bar}} />
            </View>
        );
    }
}

const style = OmrStyle.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    content: {
        marginBottom: ActionBar.HEIGHT
    },
    action_bar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
    }
})