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
    FlatList
} from 'react-native';

import { StackNavigator, TabNavigator, TabBarBottom, NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/Ionicons';
import { isIphoneX } from './device_utils'

import axios from 'axios'
import Browser from './Browser';
import Swipeout from 'react-native-swipeout';
import moment from 'moment'
import { styles as themeStyles } from 'react-native-theme';
import bus from './bus'
import store from './store'
import Share, { ShareSheet } from 'react-native-share';

var DEV_ARTICLES = 'https://api.readhub.cn/technews';

var loadErrorCount = 0;
export default class DevArticlesScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        tabBarLabel: '开发者资讯',
        tabBarIcon: ({ tintColor }) => (
            <Icon name="layers" size={22} style={[styles.icon, { color: tintColor }]}></Icon>
        ),
        title: '开发者资讯',
        tabBarOptions: {
            activeTintColor: StyleSheet.flatten(themeStyles['tab.activeTintColor']).color,
            inactiveTintColor: StyleSheet.flatten(themeStyles['tab.inactiveTintColor']).color,
            showIcon: true,
            showLabel: false,
            labelStyle: { marginBottom: 5 },
            indicatorStyle: {
                backgroundColor: 'transparent'
            },
            style: {
                backgroundColor: StyleSheet.flatten(themeStyles['tab.backgroundColor']).color, borderTopColor: StyleSheet.flatten(themeStyles['tab.borderTopColor']).color, shadowColor: 'transparent', elevation: 1,
            },

        }
    });

    constructor(props) {
        super(props);
        // const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataList: [],
            refreshing: false,
        };
        this.themeUpdateHandler = this.themeUpdateHandler.bind(this);
    }

    themeUpdateHandler() {

        this.props.navigation.setParams({});
    }

    componentDidMount() {

        this.fetchData();
        bus.on("ThemeUpdate", this.themeUpdateHandler)
    }

    componentWillUnmount() {

        bus.removeListener("ThemeUpdate", this.themeUpdateHandler)

    }

    onPressItem(item) {

        Browser.show(item.url, item.title, store.readerMode);

    }

    fetchData() {

        this.setState({ refreshing: true })
        axios.get(DEV_ARTICLES)
            .then((response) => {

                console.log(response);
                this.setState({ dataList: response.data.data, refreshing: false })
                loadErrorCount = 0;


            }).catch((error) => {
                console.log(error);
                this.setState({ refreshing: false })

            });
    }

    handleLoadMore() {

        if (this.state.loading) return;

        if (this.state.dataList.length == 0) {
            return;
        }

        if (loadErrorCount > 5) {
            return;
        }

        this.setState({ loading: true });

        var cursor = moment(this.state.dataList[this.state.dataList.length - 1].publishDate).unix() * 1000;


        axios.get(DEV_ARTICLES, { params: { lastCursor: cursor } })
            .then((response) => {

                console.log(response);

                this.setState({ dataList: [...this.state.dataList, ...response.data.data], loading: false })
                loadErrorCount = 0;

            }).catch((error) => {
                console.log(error);
                loadErrorCount++;

                this.setState({ loading: false })

            });
    }





    _keyExtractor = (item, index) => item.id + '';
    _renderRow = ({ item, index }) => {

        var firstRow = index == 0;
        var lastRow = index == this.state.dataList.length - 1;
        return (

            <TouchableHighlight activeOpacity={.95}
                onPress={() => {
                    console.log("You tapped the button!");
                    this.onPressItem(item)
                }}

            >
                <View style={[styles.listRow, index % 2 == 0 && styles.listRowAlt, themeStyles.listRow, index % 2 == 0 && themeStyles.listRowAlt]}>

                    <View style={{ flex: 1, marginBottom: -8 }}>

                        <Text ellipsizeMode="tail" numberOfLines={2} style={[styles.title, themeStyles.title]}>{item.title}</Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center', }}>
                            <Text ellipsizeMode="middle" numberOfLines={1} style={[styles.summary, themeStyles.summary]}>{item.siteName}{item.siteName && item.siteName.length > 0 && item.authorName && item.authorName.length > 0 ? ' / ' : ''}{item.authorName}{(item.siteName && item.siteName.length > 0) || (item.authorName && item.authorName.length > 0) ? '   ' : ''}{moment(item.publishDate).fromNow()}</Text>
                            {/* <View style={{flex:1}}></View> */}
                            <TouchableHighlight activeOpacity={.9} underlayColor={'#333333'}
                                style={{ borderRadius: 6 }}
                                onPress={() => {
                                    console.log("You tapped the button!");
                                    // this.onPressItem(item)
                                    var url = item.url;
                                    let shareOptions = {
                                        title: item.title,
                                        message: `${item.title} - ${url}`,
                                        url: url,
                                        subject: "Share Link" //  for email
                                    };


                                    Share.open(shareOptions).catch((err) => { err && console.log(err); });
                                }}

                            >

                                <View style={{ flexDirection: 'row', alignItems: 'center', margin: 8 }}>
                                    <Icon name="share" size={16} style={[styles.icon, { color: '#99A9BF', }]}></Icon>

                                </View>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>

            </TouchableHighlight >

        )


    }


    renderFooter = () => {
        if (!this.state.loading) return null;
        return (

            <View style={{ width: '100%', height: 60, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator animating={this.state.loading} />
            </View>

        );
    };



    render() {
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    data={this.state.dataList}
                    renderItem={this._renderRow}
                    style={[styles.listView, themeStyles.listView]}
                    keyExtractor={this._keyExtractor}
                    onEndReached={() => this.handleLoadMore()}
                    refreshing={this.state.refreshing}
                    onRefresh={() => this.fetchData()}
                    ListFooterComponent={this.renderFooter}
                    extraData={this.state.loading}
                />
            </View>
        );
    }
}




const styles = StyleSheet.create({
    icon: {
        marginBottom: Platform.OS === 'ios' ? 2 : 0,

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
        lineHeight: 18,
        flexGrow: 1,
        flexShrink: 1,

    },
});