import React from 'react';
import { AsyncStorage, View, Text, ScrollView, Platform, Alert } from 'react-native';
import Constants from 'expo-constants';
import firebase from '../components/Firebase';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

var jsonData = null;
var HomeProps;


export const Initial = (props) => {

    HomeProps = props;


}

export const addCreditCard = async (formData) => {

    return new Promise(async (resolve, reject) => {
        if (formData.valid == false) {
            alert('Kredi Kartı Geçerli Değil. Lütfen Bilgileri Gözden Geçirin');
        }
        else {


            var userUid = await AsyncStorage.getItem('userToken');

            // Var Olan kredi Kartlarini Çek
            const dbh2 = firebase.firestore();
            const usersRef = await dbh2.collection('userCreditCards').doc(userUid)
            usersRef.get()
                .then((docSnapshot) => {

                    if (docSnapshot.exists) {
                        var cardsArray = docSnapshot.data().cards;


                        var dahaOnceVarMi = false;
                        var i;
                        for (i = 0; i < cardsArray.length; i++) {
                            if (cardsArray[i].number == formData.values.number) {
                                dahaOnceVarMi = true;
                            }
                        }
                        if (dahaOnceVarMi == true) { alert('Bu Kart Daha Önceden Zaten Eklenmiş. Lütfen Başka Bir Kart Ekleyin') }
                        else {
                            // Yeni Kredi Kartını Array'e ekle
                            cardsArray.push({
                                number: formData.values.number,
                                expiry: formData.values.expiry,
                                cvc: formData.values.cvc,
                                type: formData.values.type, // will be one of [null, "visa", "master-card", "american-express", "diners-club", "discover", "jcb", "unionpay", "maestro"]
                                name: formData.values.name,
                            });

                            const dbh = firebase.firestore();
                            dbh.collection("userCreditCards").doc(userUid).set({
                                cards: cardsArray,
                            }).then(() => {
                                alert('Başarıyla Eklendi')
                                resolve('eklendi')
                            });



                        }



                    }
                    else {
                        const dbh = firebase.firestore();
                        dbh.collection("userCreditCards").doc(userUid).set({
                            cards: [{
                                number: formData.values.number,
                                expiry: formData.values.expiry,
                                cvc: formData.values.cvc,
                                type: formData.values.type, // will be one of [null, "visa", "master-card", "american-express", "diners-club", "discover", "jcb", "unionpay", "maestro"]
                                name: formData.values.name,
                            }]
                        }).then(() => {
                            alert('Başarıyla Eklendi')
                            resolve('eklendi')
                        });
                    }


                }).catch((e) => {

                    alert(e)

                });



        }

    });

}

export const getCreditCard = async () => {

    return new Promise(async (resolve, reject) => {

        var userUid = await AsyncStorage.getItem('userToken');

        // Var Olan kredi Kartlarini Çek
        const dbh2 = firebase.firestore();
        const usersRef = await dbh2.collection('userCreditCards').doc(userUid)
        usersRef.get()
            .then((docSnapshot) => {

                if (docSnapshot.exists) {
                    var cardsArray = docSnapshot.data().cards;
                    resolve(cardsArray);
                }
                else{
                    reject(false);
                }

            }).catch((e)=>reject(false));
    });

}

export const deleteCreditCard = async (index) => {

    return new Promise(async (resolve, reject) => {

        var userUid = await AsyncStorage.getItem('userToken');

        // Var Olan kredi Kartlarini Çek
        const dbh2 = firebase.firestore();
        const usersRef = await dbh2.collection('userCreditCards').doc(userUid)
        usersRef.get()
            .then((docSnapshot) => {

                if (docSnapshot.exists) {
                    var cardsArray = docSnapshot.data().cards;

                    cardsArray.splice(index,1)

                    const dbh = firebase.firestore();
                    dbh.collection("userCreditCards").doc(userUid).set({
                        cards: cardsArray
                    }).then(() => {
                        alert('Başarıyla Silindi')
                        resolve('eklendi')
                    });
                   
                }

            });
    });

}