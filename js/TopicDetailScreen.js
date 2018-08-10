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
import Share, { ShareSheet } from 'react-native-share';
import { StackNavigator, TabNavigator, TabBarBottom, NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/Ionicons';
import { isIphoneX } from './device_utils'
import { styles as themeStyles } from 'react-native-theme';
import axios from 'axios'
import Browser from './Browser';
import Swipeout from 'react-native-swipeout';
import moment from 'moment'
import bus from './bus'
import store from './store'
import TouchableItem from './TouchableItem'

var TOPIC_DETAIL_API = 'https://api.readhub.cn/topic';


export default class TechArticlesScreen extends React.Component {



    constructor(props) {
        super(props);
        // const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataList: [],
            topicData: {},
            refreshing: false,
            error: false,
        };
        this.themeUpdateHandler = this.themeUpdateHandler.bind(this);
    }

    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.topic.title,

    });

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
        axios.get(`${TOPIC_DETAIL_API}/${this.props.navigation.state.params.topic.id}`)
            .then((response) => {

                console.log(response);
                this.setState({ topicData: response.data, refreshing: false, error: false })



            }).catch((error) => {
                console.log(error);
                this.setState({ refreshing: false, error: true, errorMsg: 'network error' })

            });
    }









    _renderLoading = () => {
        if (!this.state.refreshing) return null;
        return (

            <View style={{ width: '100%', height: 60, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator animating={this.state.loading} />
            </View>

        );
    };

    _renderErrorMsg = () => {
        if (!this.state.error) return null;
        return (

            <View style={{ width: '100%', height: 60, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={[styles.summary, themeStyles.summary]}>{this.state.errorMsg}</Text>
            </View>

        );
    };

    _renderNewsSource() {

        if (!this.state.topicData || !this.state.topicData.newsArray || this.state.topicData.newsArray.length == 0) {
            return null;
        }

        var list = this.state.topicData
            && this.state.topicData.newsArray
            && this.state.topicData.newsArray.map((source, index, arr) => {
                return (
                    <TouchableOpacity key={source.id} activeOpacity={.4}
                        onPress={() => {
                            Browser.show(source.url, source.title, store.readerMode);
                        }}

                    >
                        <View style={[styles.listRow, index % 2 && styles.listRowAlt, arr.length == index + 1 && styles.lastRowBorderRadius, themeStyles.listRow, index % 2 == 0 && themeStyles.listRowAlt]}>
                            <Text style={[styles.summary, themeStyles.summary]}>{source.siteName}</Text>
                            <Text ellipsizeMode="tail" numberOfLines={1} style={[styles.summary, { flex: 1, marginLeft: 10 }, themeStyles.summary]}>{source.title}</Text>
                        </View>
                    </TouchableOpacity >
                )
            })

        return (
            <View style={[styles.roundPane]}>
                <View style={[styles.listRow, styles.firstRowBorderRadius, themeStyles.listRow,]}>
                    <Icon name="link-2" size={16} style={[styles.icon, { color: '#00aaff' }]}></Icon>
                    <Text style={[{ marginLeft: 10 }, styles.summary, themeStyles.summary]}>新闻来源</Text>
                </View>
                {list}
            </View>
        )
    }

    _renderTimeline() {


        if (!this.state.topicData || !this.state.topicData.timeline || !this.state.topicData.timeline.topics || this.state.topicData.timeline.topics.length == 0) {
            return null;
        }

        var list = this.state.topicData
            && this.state.topicData.timeline
            && this.state.topicData.timeline.topics
            && this.state.topicData.timeline.topics.map((topic, index, arr) => {
                return (
                    <TouchableOpacity key={topic.id} activeOpacity={.4}
                        onPress={() => {
                            this.props.navigation.navigate('TopicDetail', { topic: topic });
                        }}

                    >
                        <View style={[styles.listRow, index % 2 && styles.listRowAlt, arr.length == index + 1 && styles.lastRowBorderRadius, themeStyles.listRow, index % 2 == 0 && themeStyles.listRowAlt]}>

                            <Text style={[styles.summary, themeStyles.summary]}>{moment(topic.createdAt).fromNow()}</Text>
                            <Text ellipsizeMode="tail" numberOfLines={1} style={[styles.summary, { flex: 1, marginLeft: 10 }, themeStyles.summary]}>{topic.title}</Text>
                        </View>
                    </TouchableOpacity >
                )
            })

        return (
            <View style={[styles.roundPane]}>
                <View style={[styles.listRow, styles.firstRowBorderRadius, themeStyles.listRow,]}>
                    <Icon name="activity" size={16} style={[styles.icon, { color: '#00aaff' }]}></Icon>
                    <Text style={[{ marginLeft: 10 }, styles.summary, themeStyles.summary]}>事件追踪</Text>
                </View>
                {list}
            </View>
        )
    }

    _renderShareButton() {
        return (
            <TouchableItem
                pressColor={StyleSheet.flatten(themeStyles['touchablePressColor']).color}
                borderless={false}
                useForeground={true}
                style={[themeStyles.listRow,{ borderRadius: 15,  margin: 15, }]}
                onPress={() => {
                    console.log("You tapped the button!");
                    let item = this.state.topicData
                    var url = `https://readhub.cn/topic/${item.id}`;
                    let shareOptions = {
                        title: item.title,
                        message: `${item.title} - ${url}`,
                        url: url,
                        subject: "Share Link" //  for email
                    };


                    Share.open(shareOptions).catch((err) => { err && console.log(err); });
                }}


            >

                <View style={{ flexDirection: 'row', alignItems: 'center', margin: 15, justifyContent: "center" }}>
                    <Icon name="share" size={16} style={[styles.icon, { color: '#99A9BF', }]}></Icon>
                    <Text style={{color:'#20A0FF'}}> 分享</Text>
                </View>
            </TouchableItem>
        )
    }


    _renderContent() {

        if (this.state.refreshing || this.state.error) {
            return null;
        }

        return (
            <ScrollView
                style={[styles.listView, themeStyles.listView, themeStyles.darkBG,]}
            >
                <Text style={[{ padding: 20, lineHeight: 24, fontSize: 18 }, themeStyles.title]}>{this.state.topicData.title}</Text>
                <Text style={[{ paddingLeft: 20, paddingRight: 15, lineHeight: 24 }, themeStyles.summary]}>{this.state.topicData.summary}</Text>
                {this._renderNewsSource()}
                {this._renderTimeline()}
                {this._renderShareButton()}
            </ScrollView>
        )
    }

    render() {
        return (
            <View style={[themeStyles.darkBG, { flex: 1 }]}>
                {this._renderLoading()}
                {this._renderErrorMsg()}
                {this._renderContent()}
            </View>
        );
    }

}



const styles = StyleSheet.create({
    icon: {
        marginBottom: Platform.OS === 'ios' ? 2 : 0,

    },
    listView: {

        flex: 1


    },

    listRow: {

        padding: 15,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        flex: 1,
        display: 'flex',

        alignItems: 'center',


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
    roundPane: {
        borderRadius: 15,
        margin: 15,


    }
});