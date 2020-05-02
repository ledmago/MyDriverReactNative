import React from 'react';
import { Alert, AsyncStorage, View, Text, ScrollView, Platform } from 'react-native';
import Constants from 'expo-constants';
import firebase from '../components/Firebase';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import * as BalanceController from './BalanceController';
import config from '../config.json';
var jsonData = null;
var Props;

export const getDriverDetails = async (driverUid) => {


        return new Promise(async (resolve, reject) => {
                var userUid = await AsyncStorage.getItem('userToken');

                const dbh = firebase.firestore();
                const usersRef = await dbh.collection('drivers').doc(driverUid)
                usersRef.get()
                        .then((docSnapshot) => {

                                var driverDetails = {
                                        name: docSnapshot.data().name,
                                        aracPlaka: docSnapshot.data().aracPlaka,
                                        aracRenk: docSnapshot.data().aracRenk,
                                        aracModel: docSnapshot.data().aracModel,
                                        aracMarka: docSnapshot.data().aracMarka,
                                        telefon: docSnapshot.data().telefon,
                                }
                                resolve(driverDetails);
                        }).catch((e) => reject(e));

        })



}
export const Initial = async (props) => {
        Props = props;
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



        })

}



export const IptalEt = async (tripPrice) => {

        Alert.alert(
                'İptal Olmak Üzere',
                'Yolculuğunuzu iptal etmek istediğinize emin misiniz ?',
                [
                        {
                                text: 'Vazgeç',
                                onPress: () => console.log('Cancel Pressed'),
                                style: 'cancel',
                        },
                        {
                                text: 'İptal Et', onPress: async () => {

                                        var userUid = await AsyncStorage.getItem('userToken');
                                        var ref = firebase.database().ref("tripDatabase/" + userUid);
                                        ref.update({
                                                aktif: false,
                                                suan: false,
                                        });

                                        BalanceController.reduceBalance(tripPrice);
                                        BalanceController.addLogs({ cardNumber: 'Yatan : Ücret İade', date: new Date().toISOString().slice(0, 10), amount: tripPrice })
                                }
                        },
                ],
                { cancelable: true }
        );



}

export const calculateDriverDuration = async (startLoc, destinationLoc) => {
        return new Promise(async (resolve, reject) => {
                try {

                        let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&key=AIzaSyCnxh-3HMnSm-FHDuQ4kRQ7fYfUlicd7i0&language=en`)
                        let respJson = await resp.json();
                        var Duration = respJson.routes[0].legs[0].duration.text;
                        let extraMinute = 0;
                        if (Duration.substr(2, 4) == 'hour' || Duration.substr(2, 5) == 'hours' ) {
                                
                                extraMinute = parseInt(Duration.substr(7, 1));
                                Duration = parseInt(Duration.substr(0, 1)) * 60;
                            
                        }
                        else {
                                Duration = parseInt(Duration.substr(0, Duration.indexOf(' ')))
                                extraMinute = Duration > 5 ? 4 : 1
                        }


                        resolve((Duration + extraMinute) + ' dakika'); // Ekstradan 7 Dakika Eklendi Çünkü Hemen Yola Çıkamayabilir.
                } catch (error) {
                        //  alert(error)
                        return error
                }

        })

}


export const IptalEtDriver = async (yolcuUid) => {

        return new Promise((resolve, reject) => {
                Alert.alert(
                        'İptal Olmak Üzere',
                        'Yolculuğu iptal etmek istediğinize emin misiniz ?',
                        [
                                {
                                        text: 'Vazgeç',
                                        onPress: () => console.log('Cancel Pressed'),
                                        style: 'cancel',
                                },
                                {
                                        text: 'İptal Et', onPress: async () => {


                                                var ref = firebase.database().ref("tripDatabase/" + yolcuUid);
                                                ref.update({
                                                        durum: 0,
                                                        who: '',
                                                });
                                                resolve();

                                        }
                                },
                        ],
                        { cancelable: true }
                );


        })



}

export const getCurrentTrip = async () => {


        try {
                let response = await fetch(config.apiURL + 'Trip/checkCurrentTrip', {
                    method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json', },
                });
                let json = await response.json();
                if (json.status == 'ok') {
                   
                    // Eğer Varsa Trip
                    
                    return json.return;
              
                }
                else {
                 // Eğer Yoksa
                return false; //ok
                }
            } catch (error) {
                // return alert('Sunucuya bağlantı aşamasında sorun çıktı. İnternet bağlantınızı kontrol edin' + error);
                return {error:error};
            }
        
}