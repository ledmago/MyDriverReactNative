import React from 'react';
import { AsyncStorage, View, Text, ScrollView, Platform, Alert } from 'react-native';
import Constants from 'expo-constants';
import firebase from '../components/Firebase';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import config from '../config.json';

var jsonData = null;
var HomeProps;


export const Initial = (props) => {

    HomeProps = props;


}
export const reduceBalance = async(amount) =>
{
    
    var userUid = await AsyncStorage.getItem('userToken');
    const dbh2 = firebase.firestore();
    const usersRef = await dbh2.collection('users').doc(userUid)
    usersRef.get()
        .then(async (docSnapshot) => {

            if (docSnapshot.exists) {
                var Oldbalance = docSnapshot.data().balance;

                
                const dbh = firebase.firestore();
                const codeRef = await dbh.collection('users').doc(userUid)
                codeRef.update({
               balance : parseFloat(Oldbalance) + parseFloat(amount)
                })
            }
        });
}

export const UpdateBalance = async(userUid2='',amount) =>
{
    const dbh2 = firebase.firestore();
    var userUid = await AsyncStorage.getItem('userToken');
    const usersRef = await dbh2.collection('users').doc(userUid)
    usersRef.get()
        .then(async (docSnapshot) => {

            if (docSnapshot.exists) {
                var Oldbalance = docSnapshot.data().balance;

                
                const dbh = firebase.firestore();
                const codeRef = await dbh.collection('users').doc(userUid)
                codeRef.update({
               balance : parseFloat(Oldbalance) + parseFloat(amount)
                })
            }
        });
}
export const UpdateBalanceDriver = async(amount) =>
{
    const dbh2 = firebase.firestore();
    var userUid = await AsyncStorage.getItem('userToken');
    const usersRef = await dbh2.collection('drivers').doc(userUid)
    usersRef.get()
        .then(async (docSnapshot) => {

            if (docSnapshot.exists) {
                var Oldbalance = docSnapshot.data().balance;

                
                const dbh = firebase.firestore();
                const codeRef = await dbh.collection('drivers').doc(userUid)
                codeRef.update({
               balance : parseFloat(Oldbalance) + parseFloat(amount)
                })
            }
        });
}

export const usePromotionCode = async (code) => {
   
    try {
        let response = await fetch(config.apiURL + 'PromotionCode/usePromotionCode', {
            method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json', },
            body: JSON.stringify({
               code:code
            }),
        });
        var json = await response.json();
        if (json.status == 'ok') { return true; } else { return false; }

    } catch (error) {

        // return alert('Sunucuya bağlantı aşamasında sorun çıktı. İnternet bağlantınızı kontrol edin' + error);
        return false;
    }

}

export const addLogs = async (formData) => {

    return new Promise(async (resolve, reject) => {


        var userUid = await AsyncStorage.getItem('userToken');

        // Var Olan kredi Kartlarini Çek
        const dbh2 = firebase.firestore();
        const usersRef = await dbh2.collection('paymentLogs').doc(userUid)
        usersRef.get()
            .then((docSnapshot) => {

                if (docSnapshot.exists) {
                    var LogsArray = docSnapshot.data().logs;

                    if(LogsArray == undefined)
                    {
                        LogsArray = [];
                    }


                    // Yeni Kredi Kartını Array'e ekle
                    LogsArray.push({
                        cardNumber: formData.cardNumber,
                        date: formData.date,
                        amount: formData.amount,
                      
                    });

                    const dbh = firebase.firestore();
                    dbh.collection("paymentLogs").doc(userUid).set({
                        logs: LogsArray,
                    }).then(() => {
                       // alert('Başarıyla Eklendi')

                    });







                }
                else {
                    const dbh = firebase.firestore();
                    dbh.collection("paymentLogs").doc(userUid).set({
                        logs: [{
                            cardNumber: formData.cardNumber,
                            date: formData.date,
                            amount: formData.amount,
                        }]
                    }).then(() => {

                        resolve('eklendi')
                    });
                }


            }).catch((e) => {

                alert(e)

            });





    });

}

export const getLogDetails = async () => {
    
    try {
        let response = await fetch(config.apiURL + 'userProfile/getPaymentLog', {
            method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json', },
            
        });
        var json = await response.json();
        if (json.status == 'ok') { return json.paymentLog; } else { return false; }

    } catch (error) {

        // return alert('Sunucuya bağlantı aşamasında sorun çıktı. İnternet bağlantınızı kontrol edin' + error);
        return false;
    }

}
