import React, { Component } from 'react';


import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/Ionicons';

import axios from 'axios'
import bus from './bus.js'
import MyStyle from './SharedStyle.js'

import * as Progress from 'react-native-progress';
import SafariView from 'react-native-safari-view';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import menuStyle from './MenuStyle.js'

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
  WebView,
  Clipboard
} from 'react-native';

import theme from 'react-native-theme'

// import WKWebView from 'react-native-wkwebview-reborn';




var DEFAULT_URL = `https://www.moon.fm`;

var WEBVIEW_REF = 'webview';




export class BrowserScreen extends React.Component {



  constructor(props) {
    super(props);

    this.state = {
      url: DEFAULT_URL,
      urlToLoad: '',
      pageTitle: '',
      backButtonEnabled: false,
      forwardButtonEnabled: false,
      loading: true,
      scalesPageToFit: true,
    };

  }


  componentDidMount() {
    this.props.navigation.setParams({ ctx: this })

    this.setState({ urlToLoad: this.props.navigation.state.params.url, pageTitle: this.props.navigation.state.params.title });
  }

  static navigationOptions = ({ navigation }) => {

    //alert(JSON.stringify(navigation.state.params));
    if (navigation.state.params && navigation.state.params.ctx) {
      return ({
        title: navigation.state.params.ctx.state.pageTitle,
        headerTintColor: 'black',
        headerStyle: { borderBottomColor: 'transparent', backgroundColor: '#ffffff', elevation: 0, },
        headerRight: navigation.state.params.ctx.menu(),
        headerMode: 'screen',
      })
    } else {
      return ({
        title: 'Loading',
        headerTintColor: 'black',
        headerStyle: { borderBottomColor: 'transparent', backgroundColor: '#ffffff', elevation: 0, },
        headerMode: 'screen',
        headerRight: (<View style={{
          backgroundColor: 'transparent',
          paddingRight: 20,
          paddingLeft: 20,
          height: '100%',
          justifyContent: 'center'
        }}>

          <Icon2 name="ios-more" size={32} />
        </View>)
      })
    }

  };


  renderTouchable = () => (<TouchableHighlight style={{ backgroundColor: 'blue' }} />);

  menu = () => (
    <Menu style={[MyStyle.menu]}>
      <MenuTrigger customStyles={menuStyle.triggerStyles} >
        <Icon2 name="ios-more" size={32} />
      </MenuTrigger>
      <MenuOptions customStyles={menuStyle.optionsStyles}>
        <MenuOption value={1} customStyles={menuStyle.optionStyles} onSelect={() => this.reloadThePage()}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon2 name="ios-refresh" size={26} style={{ marginLeft: 10, marginRight: 10 }} />
            <Text>Reload</Text>
          </View>
        </MenuOption>
        <MenuOption value={2} customStyles={menuStyle.optionStyles} onSelect={() => this.copyURLToClipboard()}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon2 name="ios-copy-outline" size={24} style={{ marginLeft: 10, marginRight: 10 }} />
            <Text>Copy URL</Text>
          </View>
        </MenuOption>
      </MenuOptions>
    </Menu>
  );


  copyURLToClipboard() {
    Clipboard.setString(this.state.url);
  }

  reloadThePage() {
    WEBVIEW_REF.reload();
  }

  onShouldStartLoadWithRequest = (event) => {
    // Implement any custom loading logic here, don't forget to return!
    return true;
  };

  onNavigationStateChange = (navState) => {

    this.setState({
      backButtonEnabled: navState.canGoBack,
      forwardButtonEnabled: navState.canGoForward,
      url: navState.url,
      pageTitle: (navState.title&&navState.title.length > 0 && navState.title != 'about:blank') ? navState.title : this.props.navigation.state.params.title,
      loading: navState.loading,
      scalesPageToFit: true
    });
  };

  onMessage(event) {

    console.log(event.nativeEvent.data);

  }

  onWKWebViewMessage(e) {

    console.log(e.body);

  }



  renderWebView() {

    if (Platform.OS === 'ios111') {
      return (<WKWebView
        ref={(b) => WEBVIEW_REF = b}
        source={{ uri: this.state.url, headers: {} }}
        renderLoading={() => {
          return (<View style={{ margin: 20, justifyContent: 'center', alignItems: 'center' }}>
            <Progress.CircleSnail size={30} indeterminate={true} style={{ width: 30, height: 30, backgroundColor: '#00ff00' }} color={['#C0CCDA']} />
          </View>)
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        thirdPartyCookiesEnabled={true}
        decelerationRate="normal"
        onNavigationStateChange={this.onNavigationStateChange}
        onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
        startInLoadingState={true}
        onMessage={(event) => this.onWKWebViewMessage(event)}
      />)
    } else {
      return (<WebView
        ref={(b) => WEBVIEW_REF = b}
        source={{ uri: this.state.urlToLoad, headers: {} }}
        renderLoading={() => {
          return (<View style={{ margin: 20, justifyContent: 'center', alignItems: 'center' }}>
            <Progress.CircleSnail size={30} indeterminate={true} style={{ width: 30, height: 30, backgroundColor: '#00ff00' }} color={['#C0CCDA']} />
          </View>)
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        decelerationRate="normal"
        onNavigationStateChange={this.onNavigationStateChange}
        /* onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest} */
        startInLoadingState={true}
        thirdPartyCookiesEnabled={true}
        mixedContentMode={'always'}
      /* onMessage={(event) => this.onMessage(event)} */


      />)
    }

  }


  render() {
    const { goBack } = this.props.navigation;
    return (
      <View style={{ width: '100%', height: '100%', backgroundColor: '#FAFAFA' }}>
        <View style={{ width: '100%', borderBottomColor: '#f0f0f0', borderBottomWidth: 1, backgroundColor: '#ffffff', flexDirection: 'row', alignItems: 'center', paddingTop: 0, paddingBottom: 10 }}>
          <Text ellipsizeMode="tail" numberOfLines={1} style={{ marginLeft: 50, marginRight: 15, color: '#C0CCDA', flex: 1, textAlign: 'center' }}>{this.state.url}</Text>
          <ActivityIndicator animating={this.state.loading} style={{ marginRight: 20 }} />
        </View>
        {this.renderWebView()}
      </View>
    );
  }
}



const styles = StyleSheet.create({

  icon: {
    width: 26,
    height: 26,
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#20A0FF',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 100,
    margin: 10,

  },
});






export default {
  show(url, title, readerMode) {

    
  
    SafariView.isAvailable()
      .then(available => {


        var colors = {}
        if (theme.name === 'dark') {
          colors = {
            tintColor: "#ffffff",
            barTintColor: '#233446',
          }
        }
        SafariView.show({
          url: url,
          readerMode: readerMode,
          // tintColor: "#6c6c6c",
          // barTintColor: "#eee8d5" 
          ...colors

        });

      })
      .catch(error => {
        bus.emit('ShowBrowser', { url: url, title: title });
      });



  }
}


