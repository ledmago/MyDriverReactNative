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

export const deleteCreditCard = async (cardNumber) => {


    try {
        let response = await fetch(config.apiURL + 'UserProfile/deleteCard', {
            method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json', },
            body: JSON.stringify({
                cardNumber: cardNumber
            }),
        });
        var json = await response.json();
        if (json.status == 'ok') { return true; } else { return false; }

    } catch (error) {

        // return alert('Sunucuya bağlantı aşamasında sorun çıktı. İnternet bağlantınızı kontrol edin' + error);
        return false;
    }

}




export const addCreditCard = async (formData) => {
    if (formData.valid == true) {

        try {
            let response = await fetch(config.apiURL + 'UserProfile/addCard', {
                method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json', },
                body: JSON.stringify({
                    cardNumber: Number(formData.values.number.replace(/\s/g, '')),
                    expireDate: formData.values.expiry,
                    cc: formData.values.cvc,
                    placeHolder: formData.values.name,
                    type: formData.values.type
                }),
            });
            var json = await response.json();
            if (json.status == 'ok') { return true; } else { return false; }

        } catch (error) {

            // return alert('Sunucuya bağlantı aşamasında sorun çıktı. İnternet bağlantınızı kontrol edin' + error);
            return false;
        }

    }
    else {
        alert('Kredi Kartı Geçerli Değil, Yanlış Bilgiler Var.')
    }

}

export const getCreditCard = async () => {

    try {
        let response = await fetch(config.apiURL + 'UserProfile/getCreditCards', { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json', }, });
        var json = await response.json();
        return json.creditCards;

    } catch (error) {
        // return alert('Sunucuya bağlantı aşamasında sorun çıktı. İnternet bağlantınızı kontrol edin' + error);
        return false;
    }


}

