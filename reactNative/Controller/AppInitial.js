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
    const userToken = await AsyncStorage.getItem('userToken');
    const userType = await AsyncStorage.getItem('usertype');
   
   

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    
    if(userType == 'driver')
    {
      this.props.navigation.navigate(userToken ? 'AppDriver' : 'Auth');
    }
    else
    {
      this.props.navigation.navigate(userToken ? 'App' : 'Auth');
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