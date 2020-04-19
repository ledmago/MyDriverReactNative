import React from 'react';
import { AsyncStorage, View, Text, ScrollView, Platform } from 'react-native';
import Constants from 'expo-constants';
import firebase from '../components/Firebase';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

var jsonData = null;
var HomeProps;

function checkTripExistbefore()
{
    return new Promise(async (resolve, reject) => {
        var exist = false;
        var userUid = await AsyncStorage.getItem('userToken');
        var ref = firebase.database().ref("tripDatabase");
        ref.orderByChild("suan").once('value', (snapshot) => {
                snapshot.forEach(element => {
                        if(element.val().suan == true)
                        {
                                // Buldu
                                exist = true;
                                resolve(element.key)
                        }
                });
                if(exist == false){reject(false)}
        });



});
}
export const Initial = (props) => {
    {
        HomeProps = props;

        checkTripExistbefore().then(()=>{props.navigation.navigate('EslestirmeScreen'); alert('Zaten bir yolculuk başlatmışsınız.'); });
        

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

export const saveTripInformation = async (name,userLat,userLong,kalisLat, kalkisLong, kalkisAddress, VarisAddress, varisLat, varisLong, kisiSayisi, tercihObj, distance, duration, tripPrice,ekAciklama) => {

    return new Promise(async (resolve, reject) => {

        var userUid = await AsyncStorage.getItem('userToken');
        var tripID = Math.round(Math.random() * 99999) + 1000; // between 1000 and 99999
        var database = firebase.database().ref('tripDatabase/' + userUid);
        database.set({
            surucuDurum:0,
            baslayanTimeStamp:0,
            name:name,
            from: userUid,
            userLat:userLat,
            userLong:userLong,
            tripID: tripID,
            date: Math.floor(Date.now() / 1000),
            kalkisCordinate:
            {
                lat: kalisLat,
                long: kalkisLong,
                text: kalkisAddress
            },
            varisCordinate:
            {
                lat: varisLat,
                long: varisLong,
                text: VarisAddress
            },
            kisiSayisi: kisiSayisi,
            tercih: tercihObj,
            distance: distance,
            duration: duration,
            tripPrice: tripPrice,
            ekAciklama:ekAciklama,
            onay: false,
            suan:true,
            durum:0,
            who:'',
            carInf:{},
            ppImage:'',
        }).then(() => resolve());

    });

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
                    }).then(()=>resolve('updated'))
                }

            });
    });

}

export const onayTrip = async () => {
    return new Promise(async (resolve, reject) => {
        var userUid = await AsyncStorage.getItem('userToken');
        var database = firebase.database().ref('tripDatabase/' + userUid);
        database.update({
            onay:true,
        }).then(()=>{resolve('onaylandi')})
       
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


