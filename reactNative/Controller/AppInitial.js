import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import firebase from '../components/Firebase';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import config from '../config.json';

class AppInitialController extends React.Component {
  constructor(props) {
    super(props);


    this._getLocationAsync();
    this._bootstrapAsync();

  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }
  }
  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.

    try {
      let response = await fetch(config.apiURL + 'LoginByCookie' + '/', { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json', } });
      let json = await response.json();
      if (json.username != null) {
        this.props.navigation.navigate(json.userType == 'driver' ? 'AppDriver' : 'App');
      }
      else {
        this.props.navigation.navigate('Auth');
      }
    } catch (error) {
      return alert('Sunucuya bağlantı aşamasında sorun çıktı. İnternet bağlantınızı kontrol edin' + error);
    }


   

    //this.props.navigation.navigate('Auth');
  };



  // Render any loading content that you like here
  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}
export default AppInitialController;