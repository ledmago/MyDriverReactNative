import React from 'react';
import { AsyncStorage, View, Text, ScrollView, Platform } from 'react-native';
import Constants from 'expo-constants';
import firebase from '../components/Firebase';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

var jsonData = null;
var HomeProps;
async function _getLocationAsync() {
  let { status } = await Permissions.askAsync(Permissions.LOCATION).then(async () => {


  });







};

export const Initial = (props) => {
  {
    HomeProps = props;
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      _getLocationAsync();
    }

  }
}


export const getUserDetails = async () => {
  return new Promise(async (resolve, reject) => {
    var userUid = await AsyncStorage.getItem('userToken');

    const dbh = firebase.firestore();
    const usersRef = await dbh.collection('drivers').doc(userUid)
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

export const updateUserLocation = async (lat, long, address = '') => {
  var userUid = await AsyncStorage.getItem('userToken');
  const dbh = firebase.firestore();
  const usersRef = await dbh.collection('drivers').doc(userUid)
  usersRef.update({
    lat: lat,
    long: long,
    address: address,
  })
}

export const GET_ADRESS2 = async (lat, long) => {

  // API 1 = https://eu1.locationiq.com/v1/reverse.php?key=pk.71b1230f1fbd1fc1cd3f3579d3910211&lat=51.50354&lon=-0.12768&format=json
  // API 2 = https://geocode.xyz/51.50354,-0.12768?geoit=json
  return new Promise((resolve, reject) => {

    fetch('https://eu1.locationiq.com/v1/reverse.php?key=pk.71b1230f1fbd1fc1cd3f3579d3910211&lat=' + lat + '&lon=' + long + '&format=json', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',

      },



    }).then((response) => response.json())
      .then((responseData) => {
        resolve(responseData); // formatted_address yerine display_name Yaz

      }).catch(() => { reject('red') })


  })



};


export const GET_ADRESS = async (lat, long) => {

  // API 1 = https://eu1.locationiq.com/v1/reverse.php?key=pk.71b1230f1fbd1fc1cd3f3579d3910211&lat=51.50354&lon=-0.12768&format=json
  // API 2 = https://geocode.xyz/51.50354,-0.12768?geoit=json
  return new Promise((resolve, reject) => {
    var apiKey = 'AIzaSyCnxh-3HMnSm-FHDuQ4kRQ7fYfUlicd7i0';
    fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + long + '&key=' + apiKey, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',

      },



    }).then((response) => response.json())
      .then((responseData) => {
        // console.log(responseData)
        //results[0].formatted_address
        var newAddress = { display_name: responseData.results[0].formatted_address }
        resolve(newAddress); // display_name yerine formatted_address Yaz

      }).catch(() => { reject('red') })


  })



};

