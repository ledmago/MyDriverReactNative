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
export const getGelenKutusu = async () => {
  try {
    let response = await fetch(config.apiURL + 'Message/getInbox', { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json', }, });
    let json = await response.json();
    if (json.status == 'ok') {
      
        return json.InboxList;
    }
    else {
      return false;
    }
  } catch (error) {
    // return alert('Sunucuya bağlantı aşamasında sorun çıktı. İnternet bağlantınızı kontrol edin' + error);
    return false;
  }

}

