import React from 'react';
import { AsyncStorage, View, Text, ScrollView, Platform, Alert } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import config from '../config.json';

var jsonData = null;
var HomeProps;


export const Initial = (props) => {

    HomeProps = props;


}

export const getProfilePicture = async (username,userType) => {


  try {
     let response = await fetch(config.apiURL + 'UserProfile/getProfilePicture/' + username + '/' + userType , { method: 'GET', headers: { Accept: 'application/json', 'Content-Type': 'application/json', },});
    
  

 
 return config.apiURL + 'UserProfile/getProfilePicture/' + username + '/' + userType;
  //return response;
    // let json = await response.json();
    // if (json.username != null) {
    //   await AsyncStorage.setItem('userDetails',JSON.stringify(json));
    //   this.props.navigation.navigate(json.userType.userType == 'user' ? 'UploadProfilePhoto' : 'UploadProfilePhoto');
    //   // this.props.navigation.navigate(json.userType == 'driver' ? 'AppDriver' : 'App');
    // }
    // else {
    //   this.props.navigation.navigate('Auth');
    // }
  } catch (error) {
    // return alert('Sunucuya bağlantı aşamasında sorun çıktı. İnternet bağlantınızı kontrol edin' + error);
  return false;
  }



}
