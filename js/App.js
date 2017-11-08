/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
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
  AsyncStorage
} from 'react-native';

import { StackNavigator, TabNavigator, TabBarBottom, NavigationActions, StateUtils } from 'react-navigation';
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/Ionicons';
import { isIphoneX } from './device_utils'

import axios from 'axios'
import SafariView from 'react-native-safari-view';
import Swipeout from 'react-native-swipeout';
import moment from 'moment'
import 'moment/locale/zh-cn';

import MyHomeScreen from './MyHomeScreen'
import TechArticlesScreen from './TechArticlesScreen'
import DevArticlesScreen from './DevArticlesScreen'
import SettingScreen from './SettingScreen'

import { MenuContext } from 'react-native-popup-menu';
import menuStyle from './MenuStyle.js'
import { BrowserScreen } from './Browser'
import Themes from './themes'
import { styles as themeStyles } from 'react-native-theme';
import theme from 'react-native-theme'
moment.locale('zh-cn');
import deepForceUpdate from 'react-deep-force-update';

import bus from './bus'




class CustomTabBar extends React.Component {
  render() {
    return (
      <TabBarBottom
        {...this.props}
        style={{
          backgroundColor: StyleSheet.flatten(themeStyles['tab.backgroundColor']).color, borderTopColor: "transparent", shadowColor: 'transparent', elevation: 1,
        }}
      />
    )
  }
}

const MyApp = TabNavigator({
  
  Home: {
    screen: MyHomeScreen,
  },
  TechArticles: {
    screen: TechArticlesScreen,
  },
  DevArticles: {
    screen: DevArticlesScreen,
  },

}, {
    tabBarPosition: 'bottom',
    // swipeEnabled: false,
    // animationEnabled: true, 
    tabBarComponent: CustomTabBar,
    tabBarOptions: {
      activeTintColor: StyleSheet.flatten(themeStyles['tab.activeTintColor']).color,
      inactiveTintColor: StyleSheet.flatten(themeStyles['tab.inactiveTintColor']).color,
      showIcon: true,
      labelStyle: { marginBottom: 5 },
      indicatorStyle: {
        backgroundColor: 'transparent'
      },
      style: {
        backgroundColor: StyleSheet.flatten(themeStyles['tab.backgroundColor']).color, borderTopColor: "transparent", shadowColor: 'transparent', elevation: 1,
      },

    }

  });






/*



*/

function _renderStatusBarBg() {


  if (Platform.OS === 'ios') {

    return (<View style={{ width: '100%', height: 22, backgroundColor: '#f0f0f0' }}></View>

    )
  }

}





const RootStack = StackNavigator({
  MainTab: {
    screen: MyApp,
    navigationOptions: ({ navigation }) => ({

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

    }),
  },
  Setting: {
    screen: SettingScreen,
  },

  Browser: {
    screen: BrowserScreen
  }


}, {
    // headerMode: 'screen',
    cardStyle: {
      shadowColor: 'transparent',

    },

  });




const defaultGetStateForAction = RootStack.router.getStateForAction;
RootStack.router.getStateForAction = (action, state) => {

  if (action.type === NavigationActions.SET_PARAMS) {

    

      var result = findRouteAndUpdatePath(action, state.routes);
      console.log(result);
      return { ...state, routes: result.routes }

      // state.routes=state.routes.slice();

    

  }

  return defaultGetStateForAction(action, state);
};


function findRouteAndUpdatePath(action, routes, ) {


  var found = false;

  for (var i = 0; i < routes.length; i++) {

    var route = routes[i]

    if (route.routes) {
      result = findRouteAndUpdatePath(action, route.routes)
      found = result.found
    }

    if (found) {

      routes = routes.slice();
      routes[i] = { ...route }
      routes[i].routes = result.routes;
      return { found, routes };
    }

    if (route.key === action.key) {
      routes = routes.slice();
      routes[i] = { ...route, params: action.params }
      found = true;
      break;
    }


  }


  return { found, routes }
}


export default class Root extends React.Component {
  componentDidMount() {
    theme.setRoot(this)

    AsyncStorage.getItem('theme', (err, result) => {

      if (result == 'dark') {

        theme.active('dark');
      } else {

      }

      bus.emit("ThemeUpdate")

    });
  }

  render() {




    return (
      <MenuContext customStyles={menuStyle.menuContextStyles}>
        <View style={[{ borderWidth: 0, borderColor: '#ff0000', height: '100%', width: '100%',}]}>
          <StatusBar

            barStyle={theme.name == 'dark' || Platform.OS === 'android' ? 'light-content' : 'dark-content'}

          />
          <RootStack />
        </View>
      </MenuContext>
    )
  }
}


