import React from 'react';
import { AsyncStorage, View, Text, ScrollView, Platform } from 'react-native';
import Constants from 'expo-constants';
import firebase from '../components/Firebase';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

var state = {
}
var NewProps;
export const Initial = (props) => {

  NewProps = props;


}





export const updateUserRealTime = async (driver = false) => {


  var userUid = await AsyncStorage.getItem('userToken');
  const dbhRealtime = firebase.database();
  dbhRealtime.ref(driver?'drivers':'users').child(userUid).update({
    timestamp: Math.floor(Date.now() / 1000),
    userUid: userUid,
    status: 'online',
  })

}


export const updateUserRealTimeLocation = async (driver = false,name = '', lat = '', long = '', address = '') => {

  const dbhRealtime = firebase.database();

  dbhRealtime.ref('.info/connected').on('value', async (e) => {

    var status2 = JSON.stringify(e) ? 'online' : 'offline';
    var userUid = await AsyncStorage.getItem('userToken');

    const dbhRealtime = firebase.database();
    dbhRealtime.ref(driver?'drivers':'users').child(userUid).set({
      lat: lat,
      long: long,
      name: name,
      userUid: userUid,
      address: address,
      status: status2,
      timestamp: Math.floor(Date.now() / 1000),
    })



  })

  var userUid = await AsyncStorage.getItem('userToken');
  dbhRealtime.ref().child(driver?'drivers':'users' + '/' + userUid).onDisconnect().remove()
}










/*
Şimdilik İşe Yaramıyor

export const getUserDetails = async () => {

  return new Promise(async (resolve, reject) => {
    var userUid = await AsyncStorage.getItem('userToken');

    const dbh = firebase.firestore();
    const usersRef = await dbh.collection('users').doc(userUid)
    usersRef.get()
      .then((docSnapshot) => {
        var balanceFixed = docSnapshot.data().balance;
        var userDetails = {
          email: docSnapshot.data().email,
          name: docSnapshot.data().name,
          gender: docSnapshot.data().gender,
          balance: balanceFixed.toFixed(2),
          lat: docSnapshot.data().lat,
          long: docSnapshot.data().long,
        }
        resolve(userDetails);
      }).catch((e) => reject(e));

  })

}

*/