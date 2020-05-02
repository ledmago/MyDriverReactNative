import React from 'react';
import { AsyncStorage, View, Text, ScrollView, Platform, Alert } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import config from '../config.json';
import * as UserRequest from '../Controller/UserRequest';

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
      
        // return json.InboxList;

       var returnObject = json.InboxList.map(async (item)=>{
          item.profilePicture = await UserRequest.getProfilePicture(item.username,item.userType);
        });
       
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

export const getAllMessages = async (senderUsername) => {
  try {
    let response = await fetch(config.apiURL + 'Message/getMessages', { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json', },
  body:JSON.stringify({senderUsername:senderUsername}), });
    let json = await response.json();
    if (json.status == 'ok') {
      

    
        return json.return;
        
    }
    else {
     
      return false;
    }
  } catch (error) {
    // return alert('Sunucuya bağlantı aşamasında sorun çıktı. İnternet bağlantınızı kontrol edin' + error);
    return false;
  }

}

export const sendMesage = async (receiverUsername, message, receiverUserType) => {
  try {
    let response = await fetch(config.apiURL + 'Message/sendMessage', { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json', },
  body:JSON.stringify({receiverUsername:receiverUsername, message:message, receiverUserType:receiverUserType}), });
    let json = await response.json();
    if (json.status == 'ok') {
      

    
        return json.return;
        
    }
    else {
     
      return false;
    }
  } catch (error) {
    // return alert('Sunucuya bağlantı aşamasında sorun çıktı. İnternet bağlantınızı kontrol edin' + error);
    return false;
  }

}
export const setReadAllMessages = async (senderUsername) => {
  try {
    let response = await fetch(config.apiURL + 'Message/setReadedAllMessage', { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json'},
  body:JSON.stringify({senderUsername:senderUsername}) });
    let json = await response.json();
    if (json.status == 'ok') {
      

    
        return json.return;
        
    }
    else {
     
      return false;
    }
  } catch (error) {
    // return alert('Sunucuya bağlantı aşamasında sorun çıktı. İnternet bağlantınızı kontrol edin' + error);
    return false;
  }

}