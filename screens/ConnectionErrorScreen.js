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
    AsyncStorage,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from 'react-native-elements';
import config from '../config.json';
import { MonoText } from '../components/StyledText';

class SplashPage extends React.Component {
    constructor(props) {
        super(props);

    }

    state = {
        buttonLoading: false,
    }
    _bootstrapAsync = async () => {
        this.setState({ buttonLoading: true })
        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.

        try {
            let response = await fetch(config.apiURL + 'LoginByCookie' + '/', { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json', } });
            let json = await response.json();
            if (json.username != null) {
                await AsyncStorage.setItem('userDetails',JSON.stringify(json));
                this.props.navigation.navigate(json.userType == 'driver' ? 'AppDriver' : 'App');
            }
            else {
                this.props.navigation.navigate('Auth');
            }
        } catch (error) {
            // return alert('Sunucuya bağlantı aşamasında sorun çıktı. İnternet bağlantınızı kontrol edin' + error);
            this.setState({ buttonLoading: false })
        }




        //this.props.navigation.navigate('Auth');
    };

    render() {
        return (
            <View style={styles.mainContaier}>
                <View style={{ alignSelf: 'center', height: 20, width: 80 + '%', height: 300, justifyContent: 'center'}}>


                    <Text style={{ fontSize: 15, color: '#FFC541', fontFamily: 'airbnbCereal-bold', fontSize: 28, textAlign: 'center' }}>BAĞLANTI  HATASI</Text>
                    <View style={{alignItems:'center',marginTop:20}}><Ionicons name="ios-wifi" size={100} color="#FFF" style={{ marginRight: 5 }} /></View>
                    <Text style={{ fontSize: 15, color: '#CCC', fontFamily: 'airbnbCereal-light', fontSize: 16, marginTop: 15 }}>İnternet bağlantısında sorun yaşadık. Lütfen internet bağlantısını kontrol edin ve tekrar deneyin.</Text>
                    <View style={styles.PressButton}>
                        <Button loading={this.state.buttonLoading} title="Tekrar Dene" loadingProps={{color:'#161a1e',size:30}} buttonStyle={{ backgroundColor: '#FFC541', marginTop: 30, height: 50 }} titleStyle={{ color: '#161a1e', fontSize: 18 }} onPress={
                            async () => await this._bootstrapAsync()

                        }></Button></View>
                </View>
            </View>
        )


    }

}
var styles = StyleSheet.create({
    mainContaier: {
        backgroundColor: '#161a1e',
        flex: 1,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },

    PressButtonContainer: {},
})
export default SplashPage;