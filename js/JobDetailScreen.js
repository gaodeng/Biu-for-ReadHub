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
import { styles as themeStyles } from 'react-native-theme';
import axios from 'axios'
import Browser from './Browser';
import Swipeout from 'react-native-swipeout';
import moment from 'moment'
import bus from './bus'
import store from './store'

var JOB_DETAIL_API = 'https://api.readhub.me/jobs';


export default class TechArticlesScreen extends React.Component {



    constructor(props) {
        super(props);
        // const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            chartData: [],
            refreshing: false,
            error: false,
        };
        this.themeUpdateHandler = this.themeUpdateHandler.bind(this);
    }

    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.job.jobTitle,

    });

    themeUpdateHandler() {

        this.props.navigation.setParams({});
    }

    componentDidMount() {

        // this.fetchData();

        bus.on("ThemeUpdate", this.themeUpdateHandler)
    }

    componentWillUnmount() {

        bus.removeListener("ThemeUpdate", this.themeUpdateHandler)

    }



    fetchData() {

        this.setState({ refreshing: true })
        axios.get(`${JOB_DETAIL_API}/${this.props.navigation.state.params.job.id}/chart`)
            .then((response) => {

                console.log(response);
                this.setState({ chartData: response.data, refreshing: false, error: false })



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

    getSalaryText(item){
        if(item.salaryLower<=0&&item.salaryUpper<=0){
            return '薪水面议'
        }

        if(item.salaryLower>0&&item.salaryUpper>0){
            return  `${item.salaryLower}-${item.salaryUpper}k`
        }
        return Math.max(item.salaryLower,item.salaryUpper)+'k';
    }

    getExperienceText(item){
        if(item.experienceLower<=0&&item.experienceUpper<=0){
            return '经验面议'
        }

        if(item.experienceLower>0&&item.experienceUpper>0){
            return  `${item.experienceLower}-${item.experienceUpper}年`
        }
        return Math.max(item.experienceLower,item.experienceUpper)+'年';
    }

    _renderJobsSource() {

       

        let job=this.props.navigation.state.params.job;

        var list = job.jobsArray.map((source, index, arr) => {
                return (
                    <TouchableOpacity key={source.id} activeOpacity={.4}
                        onPress={() => {
                            Browser.show(source.url, source.title, false);
                        }}

                    >
                        <View style={[styles.listRow, index % 2 && styles.listRowAlt, arr.length == index + 1 && styles.lastRowBorderRadius, themeStyles.listRow, index % 2 == 0 && themeStyles.listRowAlt,{flexDirection:'column',alignItems:'stretch'}]}>
                            <View style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                            <Text style={[styles.title, themeStyles.title]}>{source.company}</Text>
                            <Text ellipsizeMode="tail" numberOfLines={1} style={[styles.summary, { flex: 1, marginLeft: 10 }, themeStyles.summary]}>{source.title}</Text>
                            </View>
                            <View style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'flex-start',marginTop:5}}>
                                <Text style={[styles.summary, themeStyles.summary]}>
                                    {this.getSalaryText(source)}
                                </Text>
                                
                                <Text style={[styles.summary, themeStyles.summary]}>
                                    {this.getExperienceText(source)}
                                </Text>

                                <Text style={[styles.summary, themeStyles.summary]}>
                                    {source.city}
                                </Text>
                            </View>


                           
                        </View>
                    </TouchableOpacity >
                )
            })

        return (
            <View style={[styles.roundPane]}>
                <View style={[styles.listRow, styles.firstRowBorderRadius, themeStyles.listRow,]}>
                    <Icon name="link-2" size={16} style={[styles.icon, { color: '#00aaff' }]}></Icon>
                    <Text style={[{ marginLeft: 10 }, styles.summary, themeStyles.summary]}>热门「 {this.props.navigation.state.params.job.jobTitle} 」招聘</Text>
                </View>
                {list}
            </View>
        )
    }

    

    _renderContent() {

        if(this.state.refreshing||this.state.error){
            return null;
        }

        return (
            <ScrollView
                style={[styles.listView, themeStyles.listView,themeStyles.darkBG,]}
            >
               

                {this._renderJobsSource()}

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
        lineHeight: 18,
        marginRight:20,

    },
    roundPane: {
        borderRadius: 15,
        margin: 15,


    }
});