import React from 'react'
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TextInput,
    Keyboard,
    ListView,
    Image,
    TouchableOpacity,
    TouchableHighlight,
    Button,
    NativeModules,
    ActivityIndicator,
    RefreshControl,
    InteractionManager,
    LayoutAnimation,
    Platform,
    StatusBar,
    FlatList,
    Switch,
    AsyncStorage
} from 'react-native';

import { StackNavigator, TabNavigator, TabBarBottom, NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/Ionicons';
import { isIphoneX } from './device_utils'

import axios from 'axios'
import SafariView from 'react-native-safari-view';
import Swipeout from 'react-native-swipeout';
import moment from 'moment'
import Themes from './themes'
import { styles as themeStyles } from 'react-native-theme';
import theme from 'react-native-theme'


import bus from './bus'


const SRCURL = 'https://github.com/gaodeng/Biu-for-ReadHub'
const ISSUEURL = 'https://github.com/gaodeng/Biu-for-ReadHub/issues'
export default class SettingScreen extends React.Component {



    constructor(props) {
        super(props);
        // const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            readerMode: true,
            nightMode: false,

        };
    }


    componentWillMount() {
        // You don't need to put it here, but this is how I did it in my parent React.Component, as I had styles based on
        // themes throughout my application. If you have styles only in one area, you will have improved performance
        // by setting the root there (though the performance may not be noticable for many applications).

        AsyncStorage.getItem('theme', (err, result) => {

            if (result == 'dark') {

                this.setState({ nightMode: true })
            } else {

            }

        });






    }


    static navigationOptions = {
        title: '设置',
        headerTitleStyle: { ...StyleSheet.flatten(themeStyles.headerTitleStyle) },
        headerBackTitleStyle: { ...StyleSheet.flatten(themeStyles.headerTitleStyle) },
        headerTintColor: StyleSheet.flatten(themeStyles.headerTitleStyle).color,
        headerStyle: { backgroundColor: '#ffffff', borderBottomColor: "transparent", shadowColor: 'transparent', elevation: 0, ...StyleSheet.flatten(themeStyles.headerStyle) },
    };

    handleThemeChange(value) {
        this.setState({ nightMode: !this.state.nightMode });


        if (value) {
            theme.active('dark');
            AsyncStorage.setItem('theme', 'dark', (error, result) => {

            });
        } else {
            theme.active();
            AsyncStorage.setItem('theme', 'default', (error, result) => {

            });
        }

        bus.emit("ThemeUpdate")
    }

    _renderReaderModeRow() {
        if (Platform.OS === 'ios') {

            return (<View
                style={[{ backgroundColor: '#ffffff', flexDirection: 'row', padding: 10, paddingLeft: 15, paddingRight: 15, alignItems: 'center' }, themeStyles.settingRow]}
            >
                <Icon2 name="ios-glasses" size={20} style={{ marginRight: 8, color: '#8492A6' }}></Icon2>
                <Text style={{ color: '#8492A6' }}>阅读模式</Text>
                <View style={{ flexGrow: 1 }}></View>
                <Switch value={this.state.readerMode} tintColor={'#20A0FF'} onTintColor={'#20A0FF'}
                    onValueChange={(value) => this.setState({ readerMode: !this.state.readerMode })} ></Switch>
            </View>)

        }
    }

    _renderNightModeRow() {


        return (

            <View
                style={[{ backgroundColor: '#ffffff', flexDirection: 'row', padding: 10, paddingLeft: 15, paddingRight: 15, alignItems: 'center' }, themeStyles.settingRow]}
            >
                <Icon name="moon" size={18} style={{ marginRight: 10, color: '#8492A6' }}></Icon>
                <Text style={{ color: '#8492A6' }}>夜间模式</Text>
                <View style={{ flexGrow: 1 }}></View>
                <Switch value={this.state.nightMode} tintColor={'#20A0FF'} onTintColor={'#20A0FF'}
                    onValueChange={(value) => this.handleThemeChange(value)} ></Switch>
            </View>
        )
    }

    _renderLineRow() {

        return (

            <View style={[{ paddingLeft: 40, paddingRight: 15, flex: 1, backgroundColor: '#ffffff' }, themeStyles.settingRow]}>
                <View style={[{ backgroundColor: '#EFF2F7', height: 1 }, themeStyles.darkBG]} />
            </View>
        )
    }

    render() {
        return (

            <ScrollView style={[{ backgroundColor: '#f5f5f5' }, themeStyles.darkBG]}>
                {/* <Text style={{ color: '#D3DCE6', padding: 15 }} >阅读设置</Text>

                {this._renderReaderModeRow()}
                {this._renderLineRow()}
                {this._renderNightModeRow()} */}





                <Text style={{ color: '#D3DCE6', padding: 15 }} >问题反馈</Text>
                <View
                    style={[{ backgroundColor: '#ffffff', }, themeStyles.settingRow]}
                >


                    <TouchableOpacity
                        style={{ flexDirection: 'row', alignItems: 'center', padding: 15 }}
                        onPress={() => {
                            SafariView.show({
                                url: ISSUEURL,


                            });
                        }}>

                        <Icon name="message-square" size={18} style={{ marginRight: 10, color: '#8492A6' }}></Icon>
                        <Text ellipsizeMode="tail" numberOfLines={1} style={{ color: '#D3DCE6', flexShrink: 1 }}>{ISSUEURL}</Text>

                    </TouchableOpacity>

                </View>


                <Text style={{ color: '#D3DCE6', padding: 15 }} >源码</Text>
                <View
                    style={[{ backgroundColor: '#ffffff', }, themeStyles.settingRow]}
                >


                    <TouchableOpacity
                        style={{ flexDirection: 'row', alignItems: 'center', padding: 15 }}
                        onPress={() => {
                            SafariView.show({
                                url: SRCURL,


                            });
                        }}>

                        <Icon name="github" size={18} style={{ marginRight: 10, color: '#8492A6' }}></Icon>
                        <Text ellipsizeMode="tail" numberOfLines={1} style={{ color: '#D3DCE6', flexShrink: 1 }}>{SRCURL}</Text>

                    </TouchableOpacity>

                </View>

            </ScrollView>


        );
    }
}




const styles = StyleSheet.create({
    icon: {
        marginBottom: 3,

    },
    listView: {




    },

    listRow: {

        padding: 15,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        flex: 1,



    },

    firstRowBorderRadius: {
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    lastRowBorderRadius: {
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },

    roundRowBorderRadius: {
        borderRadius: 15,
        margin: 7

    },
    listRowAlt: {
        backgroundColor: '#FAFAFA',
    },

    title: {

        fontSize: 16,
        color: '#222222',
        lineHeight: 22


    },

    summary: {
        color: '#8898AA',
        fontSize: 12,
        lineHeight: 18


    },
});