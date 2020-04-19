import React from 'react';
import { AsyncStorage, View, Text, ScrollView, } from 'react-native';
import firebase from '../components/Firebase';

var state = {
}
var LoginProps;
export const Initial = (props) => {
    {
        LoginProps = props;

    }
}

export const Login = async (email, password) => {
    firebase.auth().signInWithEmailAndPassword(email, password).then(function (user) {
        const thisUser = firebase.auth().currentUser;
        AsyncStorage.setItem('userToken', thisUser.uid).then(function () {

            const dbh = firebase.firestore();
            dbh.collection("users").doc(thisUser.uid).get().then(async (snapshot) => {

                if(snapshot.exists)
                {
                    AsyncStorage.setItem('usertype', 'rider').then(function () {LoginProps.navigation.navigate('App');})
                }
                else
                {
                    const dbhDriver = firebase.firestore();
                    dbhDriver.collection("drivers").doc(thisUser.uid).get().then(async (snapshot) => {
        
                        if(snapshot.exists)
                        {
                            AsyncStorage.setItem('usertype', 'driver').then(function () {LoginProps.navigation.navigate('AppDriver');})
                        }
                        else{
                            AsyncStorage.removeItem('userToken').then(function () {alert('Bir Hata Oluştu. Bizimle İletişime Geçin. Hata Kodu: USR_045');})
                        }
                    })
                }

            })

            

        })
    }).catch((hata) => {
        ErrorMessages(hata, hata.code)
    });
}
export const ErrorMessages = (hata, code) => {
    switch (code) {
        default: alert(hata); break;
        case "auth/invalid-email": alert("Email Adresi Geçersiz"); break;
        case "auth/wrong-password": alert("Geçersiz Şifre"); break;
        case "auth/user-not-found": alert("Yanlış Kullanıcı Adı ve Şifresi"); break;

    }
}

