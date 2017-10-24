import {
  StyleSheet,
  } from 'react-native';
const styles = StyleSheet.create({

    roundPanel: {
      padding:15,
      borderRadius:15,
      margin:15,
      backgroundColor:'#ffffff'
    },
    listView: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    listRow: {
        padding: 15,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems:'center',
    },
    listRowAlt: {
        backgroundColor: '#FAFAFA',
    },
    firstRowBorderRadius: {
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
    },
    lastRowBorderRadius: {
      borderBottomLeftRadius: 15,
      borderBottomRightRadius: 15,
    },
    thumbnail: {
        width: 48,
        height: 48,
        marginRight: 15,
    },
    icon: {
      width: 26,
      height: 26,
      margin:20,
      textAlign: 'center'
    },
    menu:{
      shadowOpacity:.05,
    },
    menuTrigger:{
      paddingLeft:20,
      paddingRight:20,
      shadowOpacity:.05,
    },
    menuOptions:{



    },
    menuOption:{
      padding:20,

    }

});
export default  styles;
