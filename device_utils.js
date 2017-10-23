import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const isIphoneX = () => {
    return (
        Platform.OS === 'ios' &&
        !Platform.isPad &&
        !Platform.isTVOS &&
        (height === 812 || width === 812)
    );
};

export const isLandscape = (d) => {
    if (d) return d.window.width > d.window.height;
    return width > height;
};

export const HOME_ACTIVITY_INDICATOR = isIphoneX() ? 34 : 0;
// export const TATUSBAR_HEIGHT = getStatusBarHeight();

export const getStatusBarHeight = (dimensions) => {
    if (Platform.OS === 'android' || isLandscape(dimensions)) {
        return 0;
    }

    if (isIphoneX()) {
        return 44;
    }

    return 20;
};


