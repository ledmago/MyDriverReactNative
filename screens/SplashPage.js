import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Button,
} from 'react-native';

import { MonoText } from '../components/StyledText';

class SplashPage extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <View style={styles.mainContaier}>

                <Text>Burası Splash Screen</Text>
                <View style={styles.PressButton}><Button title="Press me" color='#1E1324' onPress={
                    () => this.props.navigation.navigate('Main')

                }></Button></View>
            </View>
        )


    }

}
var styles = StyleSheet.create({
    mainContaier: {
        backgroundColor: '#FFC541',
        flex: 1,
    },
    PressButton: {
        width: 200,
        padding: 5,
        alignSelf: 'center',
        position: 'absolute',
        bottom: 100,


    },
})
export default SplashPage;