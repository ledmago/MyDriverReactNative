import React from 'react';
import { Alert, AsyncStorage, View, Text, ScrollView, Platform } from 'react-native';
import Constants from 'expo-constants';
import firebase from '../components/Firebase';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import * as BalanceController from './BalanceController';
var jsonData = null;
var Props;

export const getDriverDetails = async(driverUid) => {
        

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
                                        BalanceController.addLogs({cardNumber:'Yatan : Ücret İade',date:new Date().toISOString().slice(0,10),amount:tripPrice})
                                }
                        },
                ],
                { cancelable: true }
        );



}

export const IptalEtDriver = async (yolcuUid) => {

               
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
                                                durum:4,
                                                who: '',
                                        });

                                        
                                }
                        },
                ],
                { cancelable: true }
        );



}