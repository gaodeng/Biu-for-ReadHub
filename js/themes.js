import {
    StyleSheet,
} from 'react-native';


import theme from 'react-native-theme';




const colors = {
    darkBG1: '#233446',
    darkBG2: '#1b2936',
    darkBG3: '#141d26',
    lightColor1: '#FFFFFF',
    lightColor2: '#8698a6',
}



theme.add({
    headerStyle: {
        backgroundColor: colors.darkBG1,

    },
    headerTitleStyle: {
        color: colors.lightColor1
    },


    settingRow: {
        backgroundColor: colors.darkBG1,

    },
    darkBG: {
        backgroundColor: colors.darkBG2,
    },
    listView: {
        backgroundColor: colors.darkBG3
    },

    listRow: {
        backgroundColor: colors.darkBG1,

    },


    listRowAlt: {
        backgroundColor: '#223244',
    },

    title: {
        color: colors.lightColor1,
    },

    summary: {
        color: '#8492A6',
    },
    'tab.activeTintColor': {
        color: '#20A0FF'
    },
    'tab.inactiveTintColor': {
        color: '#8492A6'
    },
    'tab.backgroundColor': {
        color: colors.darkBG1
    },
    'tab.borderTopColor': {
        color: '#1b2936'
    },

}, 'dark')


theme.add({
    headerStyle: {
        backgroundColor: "#FFFFFF",

    },
    headerTitleStyle: {
        color: "#000000"
    },


    settingRow: {
        // backgroundColor:colors.darkBG1,

    },
    darkBG: {
        // backgroundColor:colors.darkBG2,
    },
    listView: {
        backgroundColor: '#f5f5f5'
    },

    listRow: {
        backgroundColor: '#ffffff',
    },


    listRowAlt: {
        backgroundColor: '#FAFAFA',
    },

    title: {
        color: '#222222',
    },

    summary: {
        color: '#8898AA',
    },
    'tab.activeTintColor': {
        color: '#20A0FF'
    },
    'tab.inactiveTintColor': {
        color: '#8492A6'
    },
    'tab.backgroundColor': {
        color: '#FFFFFF'
    },
    'tab.borderTopColor': {
        color: '#F0F0F0'
    },
})





const styles = StyleSheet.create({

    headerStyle: {
        backgroundColor: colors.darkBG1,

    },
    headerTitleStyle: {
        color: colors.lightColor1
    },


    settingRow: {
        backgroundColor: colors.darkBG1,

    },
    darkBG: {
        backgroundColor: colors.darkBG2,
    },

});

export default styles;



