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
export const refreshUserDetails = async () => {
  try {
    let response = await fetch(config.apiURL + 'LoginByCookie' + '/', { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json', }, });
    let json = await response.json();
    if (json.username != null) {
      await AsyncStorage.setItem('userDetails', JSON.stringify(json));

      return json;
    }
    else {
      return false;
    }
  } catch (error) {
    // return alert('Sunucuya bağlantı aşamasında sorun çıktı. İnternet bağlantınızı kontrol edin' + error);
    return false;
  }

}

export const getProfilePicture = async (username, userType,reload = false) => {
  var reloadstatus = reload == true?Date.now():'';
  return config.apiURL + 'UserProfile/getProfilePicture/' + username + '/' + userType + '?twj=' + reloadstatus;
  
  // try { 
  //    let response = await fetch(config.apiURL + 'UserProfile/getProfilePicture/' + username + '/' + userType , { method: 'GET', headers: { Accept: 'application/json', 'Content-Type': 'application/json', },});


  // } catch (error) {
  //   // return alert('Sunucuya bağlantı aşamasında sorun çıktı. İnternet bağlantınızı kontrol edin' + error);
  // return false;
  // }



}

