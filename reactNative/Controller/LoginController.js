import React from 'react';
import { AsyncStorage, View, Text, ScrollView, } from 'react-native';
import firebase from '../components/Firebase';
import config from '../config.json';

var state = {
}
var LoginProps;
export const Initial = (props) => {
    {
        LoginProps = props;

    }
}

var sendPostRequest = async (params, api) => {

    try {
        let response = await fetch(config.apiURL + api + '/', { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json', }, body: JSON.stringify(params), });
        let json = await response.json();
        return json;
    } catch (error) {
        return false;
    }

}

export const Login = async (username, password, userType) => {

    var loginRequest = await sendPostRequest({ username: username, password: password }, userType == 'user' ? 'LoginUser' : 'LoginDriver');
    if (loginRequest) {

        if (loginRequest.username != null) {

            LoginProps.navigation.navigate(loginRequest.userType == 'user' ? 'App' : 'AppDriver');
        }
        else {
            alert('Kullanıcı adı veya Email ve Şifre Uyuşmadı');
        }
    }
    else {
        alert('Sunuculara erişilemedi, internet bağlantınızı kontrol edin');
    }

}

export const ErrorMessages = (hata, code) => {
    switch (code) {
        default: alert(hata); break;
        case "auth/invalid-email": alert("Email Adresi Geçersiz"); break;
        case "auth/wrong-password": alert("Geçersiz Şifre"); break;
        case "auth/user-not-found": alert("Yanlış Kullanıcı Adı ve Şifresi"); break;

    }
}

