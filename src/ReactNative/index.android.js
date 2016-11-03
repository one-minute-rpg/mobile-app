/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View
} from 'react-native';

import {MainPage} from './app/app';

export default class OneMinuteRpg extends Component {
    render() {
        return (
            <MainPage />
        );
    }
}

AppRegistry.registerComponent('OneMinuteRpg', () => OneMinuteRpg);
