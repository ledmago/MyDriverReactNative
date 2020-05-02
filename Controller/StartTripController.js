import React from 'react';
import { AsyncStorage, View, Text, ScrollView, Platform } from 'react-native';
import Constants from 'expo-constants';
import firebase from '../components/Firebase';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import config from '../config.json';

var jsonData = null;
var HomeProps;

function checkTripExistbefore() {
    return new Promise(async (resolve, reject) => {
        var exist = false;
        var userUid = await AsyncStorage.getItem('userToken');
        var ref = firebase.database().ref("tripDatabase");
        ref.orderByChild("suan").once('value', (snapshot) => {
            snapshot.forEach(element => {
                if (element.val().suan == true) {
                    // Buldu
                    exist = true;
                    resolve(element.key)
                }
            });
            if (exist == false) { reject(false) }
        });



    });
}
export const Initial = (props) => {
    {
        return new Promise(async (resolve, reject) => {


            HomeProps = props;

            checkTripExistbefore().then(() => {
                // Zaten Bir Yolculuk Başlamış
                reject();

            }).catch(() => { resolve() });

        })


    }
}

function getPlacesCordinates(place_id) {
    //https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJKTcrIyXI3xQRzNOy25ZW0OQ&key=AIzaSyCnxh-3HMnSm-FHDuQ4kRQ7fYfUlicd7i0
    apiKey = 'AIzaSyCnxh-3HMnSm-FHDuQ4kRQ7fYfUlicd7i0';
    fetch('https://maps.googleapis.com/maps/api/place/details/json?place_id=' + place_id + '&key=' + apiKey, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    }).then((response) => response.json())
        .then((responseData) => {
            console.log(responseData.result.geometry);


            alert('1' + responseData.result.geometry.location.lat)





        })
}

export const saveTripInformation = async (startedTime, distance, duration, startCordinate, finishCordinate, passangerNumber, preferences, price,extraDetail,kalkisAddress,varisAddress) => {

    try {
        let response = await fetch(config.apiURL + 'Trip/startTrip', {
            method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json', },
            body: JSON.stringify({
                startedTime:startedTime, 
                distance:distance, 
                duration:duration, 
                startCordinate:startCordinate, 
                finishCordinate:finishCordinate, 
                passangerNumber:passangerNumber, 
                preferences:preferences, 
                price:price,
                extraDetail:extraDetail,
                kalkisAddress:kalkisAddress,
                varisAddress:varisAddress,
            })
        });
        let json = await response.json();
        if (json.status == 'fail') {
           
            if(json.message == 'noSufficientMoney'){alert('Bu yolculuk için bakiyeniz yetersiz.');}
            if(json.message == 'activeTripError'){alert('Zaten mevcut bir yolculuğunuz var.');}
            alert(JSON.stringify(json))
            return false;
      
        }
        else {
            alert('ok')
            return json.return; //ok
        }
    } catch (error) {
        // return alert('Sunucuya bağlantı aşamasında sorun çıktı. İnternet bağlantınızı kontrol edin' + error);
        return false;
    }

}


export const reduceBalance = async (price) => {
    return new Promise(async (resolve, reject) => {
        var userUid = await AsyncStorage.getItem('userToken');
        const dbh1 = firebase.firestore();
        const usersRef = await dbh1.collection('users').doc(userUid)
        usersRef.get()
            .then(async (docSnapshot) => {
                if (docSnapshot.exists) {
                    var balance = docSnapshot.data().balance;
                    var newBalance = balance - price;

                    const dbh = firebase.firestore();
                    const usersRef = await dbh.collection('users').doc(userUid)
                    usersRef.update({
                        balance: newBalance,
                    }).then(() => resolve('updated'))
                }
            });
    });
}

export const onayTrip = async () => {
    return new Promise(async (resolve, reject) => {
        var userUid = await AsyncStorage.getItem('userToken');
        var database = firebase.database().ref('tripDatabase/' + userUid);
        database.update({
            onay: true,
        }).then(() => { resolve('onaylandi') })

    });

}


export const findPlacesFromApi = async (text) => {

    //https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=AIzaSyCnxh-3HMnSm-FHDuQ4kRQ7fYfUlicd7i0&input=kale%20i%C3%A7i%20gazima%C4%9Fusa&inputtype=textquery
    apiKey = 'AIzaSyCnxh-3HMnSm-FHDuQ4kRQ7fYfUlicd7i0';
    fetch('https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=' + apiKey + '&input=' + text + '&inputtype=textquery', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',

        },



    }).then((response) => response.json())
        .then((responseData) => {
            console.log(responseData);

            if (responseData.status == "INVALID_REQUEST" || responseData.status == "ZERO_RESULTS" || responseData.status == "OVER_QUERY_LIMIT") {
                alert("Hata oluştu. Sonra tekrar deneyin." + responseData.status)
            }
            else {
                getPlacesCordinates(responseData.candidates[0].place_id); // returns place id.
            }




        }).catch((e) => { console.log(e) })
};

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


