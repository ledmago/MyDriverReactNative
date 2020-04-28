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

export const getLogDetails = async () => {
    
    try {
        let response = await fetch(config.apiURL + 'userProfile/getPaymentLog', {
            method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json', },
            
        });
        var json = await response.json();
        json.paymentLog.map((item => {
            var formattedDate = new Date(item.date);
            item.formattedDate = formattedDate.getDate() + '/' + (formattedDate.getMonth() + 1) + '/' + formattedDate.getFullYear() + ' (' + formattedDate.getHours() + ':' + formattedDate.getMinutes() + ')';
        }))
       
        if (json.status == 'ok') { return json.paymentLog; } else { return false; }

    } catch (error) {

        // return alert('Sunucuya bağlantı aşamasında sorun çıktı. İnternet bağlantınızı kontrol edin' + error);
        return false;
    }

}
