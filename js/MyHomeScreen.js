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

import { StackNavigator } from 'react-navigation'
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/Ionicons';


import axios from 'axios'
import Browser from './Browser';
import Swipeout from 'react-native-swipeout';
import moment from 'moment'
import bus from './bus'
import { styles as themeStyles } from 'react-native-theme';
import store from './store'
import { StateUtils } from 'react-navigation';

import TopicDetailScreen from './TopicDetailScreen'

var swipeoutBtns = [
    {
        component: <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}><Icon2 name="ios-star" size={36} style={{ color: '#ffffff' }}></Icon2></View>,
        type: 'primary',
    },
    {
        component: <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}><Icon2 name="ios-trash" size={36} style={{ color: '#ffffff' }}></Icon2></View>,
        type: 'delete'
    }

]

var TOPIC_API = 'https://api.readhub.me/topic';




class MyHomeScreen extends React.Component {
    

    static navigationOptions = ({ navigation }) => ({

        headerTitle: (<View style={[{ backgroundColor: 'white', position: 'absolute', left: Platform.OS === 'ios' ? -50 : 20, top: Platform.OS === 'ios' ? 8 : 14, flex: 1, flexDirection: 'row', alignItems: 'center' }, themeStyles.headerStyle]}>
            <Text numberOfLines={1} style={{ color: '#20A0FF', fontWeight: '600', fontSize: 22, textAlign: 'left' }}>READ</Text><Text style={{ fontSize: 22, color: '#D3DCE6', }}>HUB</Text>
        </View>),
        // header:null,
        headerRight: (<TouchableOpacity activeOpacity={.65}
            onPress={() => {
                console.log(navigation.state)
                navigation.navigate('Setting')
            }}

        ><View style={{ margin: 10, marginRight: 15 }}><Icon2 name="md-settings" size={22} style={{ color: '#8492A6' }}></Icon2></View></TouchableOpacity>),
        headerStyle: { backgroundColor: '#ffffff', borderBottomColor: "transparent", shadowColor: 'transparent', elevation: 0, ...StyleSheet.flatten(themeStyles.headerStyle) },
        headerTitleStyle: { ...StyleSheet.flatten(themeStyles.headerTitleStyle) },
        headerBackTitleStyle: { ...StyleSheet.flatten(themeStyles.headerTitleStyle) },
        headerTintColor: StyleSheet.flatten(themeStyles.headerTitleStyle).color,

        tabBarLabel: '热门话题',
        // Note: By default the icon is only shown on iOS. Search the showIcon option below.
        tabBarIcon: ({ tintColor }) => (

            <Icon name="globe" size={22} style={[styles.icon, { color: tintColor }]}></Icon>
        ),

    })


    constructor(props) {
        super(props);
        // const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataList: [],
            refreshing: false,
        };
    }

    componentDidMount() {

        this.fetchData();
        bus.on('ShowBrowser', (data) => {
            this.props.navigation.navigate('Browser', data)

        })


        bus.on("ThemeUpdate", () => {


            //console.log(this.props.navigation.state)
            this.props.navigation.setParams({});




        })

    }



    onPressItem(item) {

        // Browser.show(item.newsArray[0].url, item.title, store.readerMode);
      
      

        this.props.navigation.navigate('TopicDetail',{topic:item});
        
    }

    fetchData() {

        this.setState({ refreshing: true })
        axios.get(TOPIC_API)
            .then((response) => {

                console.log(response);
                this.setState({ dataList: response.data.data, refreshing: false })



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

        this.setState({ loading: true });

        var cursor = this.state.dataList[this.state.dataList.length - 1].order;


        axios.get(TOPIC_API, { params: { lastCursor: cursor } })
            .then((response) => {

                console.log(response);

                this.setState({ dataList: [...this.state.dataList, ...response.data.data], loading: false })


            }).catch((error) => {
                console.log(error);
                this.setState({ loading: false })

            });
    }

    _allowScroll(scrollEnabled) {
        this.setState({ scrollEnabled: scrollEnabled })
    }

    _handleSwipeout(rowID) {
        var rows = this.state.dataList;
        for (var i = 0; i < rows.length; i++) {
            if (i != rowID) rows[i].active = false
            else rows[i].active = true
        }
        this.setState({ dataList: this.state.dataList })
    }



    _keyExtractor = (item, index) => item.id;
    _renderRow = ({ item, index }) => {

        var firstRow = index == 0;
        var lastRow = index == this.state.dataList.length - 1;
        return (


            <Swipeout
                autoClose={true}
                scroll={event => this._allowScroll(event)}
                sensitivity={5}

                /* style={{ borderWidth: 2, borderColor: 'red' }} */
                close={!item.active}
                onOpen={(item) => this._handleSwipeout(index)}
            >

                <TouchableHighlight activeOpacity={.95}
                    onPress={() => {
                        console.log("You tapped the button!");
                        this.onPressItem(item)
                    }}

                >
                    <View style={[styles.listRow, index % 2 == 0 && styles.listRowAlt, themeStyles.listRow, index % 2 == 0 && themeStyles.listRowAlt]}>

                        <View style={styles.rightContainer}>

                            <Text ellipsizeMode="tail" numberOfLines={2} style={[styles.title, themeStyles.title]}>{item.title}</Text>
                            <View style={{ height: 5 }}></View>
                            <Text ellipsizeMode="tail" numberOfLines={3} style={[styles.summary, themeStyles.summary]}>{moment(item.publishDate).fromNow()}</Text>

                        </View>
                    </View>

                </TouchableHighlight >

            </Swipeout>

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
                {/* <Button
                    
                    onPress={() => {
                        console.log(this.props.navigation.state);
                        this.props.navigation.setParams({ isHeaderShow: Math.random().toString() });
                    }}
                    title={"set"}

                />

                <Button
                    
                    onPress={() => {
                        console.log(this.props.navigation.state)

                    }}
                    title={"log"}

                /> */}
                <FlatList
                    data={this.state.dataList}
                    renderItem={this._renderRow}
                    style={[styles.listView, themeStyles.listView]}
                    keyExtractor={this._keyExtractor}
                    onEndReached={() => this.handleLoadMore()}
                    refreshing={this.state.refreshing}
                    onRefresh={() => this.fetchData()}
                    scrollEnabled={this.state.scrollEnabled}
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

        backgroundColor: '#f5f5f5'


    },

    listRow: {

        padding: 15,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        flex: 1,



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


export default StackNavigator({

    Topic: {
        screen: MyHomeScreen,
    },

    TopicDetail: {
        screen: TopicDetailScreen
    }


}, {

        cardStyle: {
            shadowColor: 'transparent',

        },
        navigationOptions: ({ navigation }) => {
            return ({
                // title:'coool',
                headerStyle: { backgroundColor: '#ffffff', borderBottomColor: "transparent", shadowColor: 'transparent', elevation: 0, ...StyleSheet.flatten(themeStyles.headerStyle) },
                headerTitleStyle: { ...StyleSheet.flatten(themeStyles.headerTitleStyle) },
                tabBarLabel: '热门话题',
                headerTintColor: StyleSheet.flatten(themeStyles.headerTitleStyle).color,
                // Note: By default the icon is only shown on iOS. Search the showIcon option below.
                tabBarIcon: ({ tintColor }) => (

                    <Icon name="globe" size={22} style={[styles.icon, { color: tintColor }]}></Icon>
                ),
            })
        }

    });

