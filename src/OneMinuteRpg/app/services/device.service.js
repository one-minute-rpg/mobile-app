import {Dimensions} from 'react-native';

let _instance = null;

export class DeviceService {
    static getInstance() {
        if(_instance === null) {
            _instance = new DeviceService();
        }

        return _instance;
    }    

    getDimensions() {
        var {height, width} = Dimensions.get('window');

        return {
            height,
            width
        };
    }
}