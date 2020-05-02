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

export const saveLocation = async (lat, long) => {

   

    const getApiResult = await fetch(config.apiURL + 'UserProfile/saveLocation', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',

        },
        body:JSON.stringify({latitude:lat,longitude:long})
    });
    if (getApiResult) {
        const resultJson = await getApiResult.json()

        
       return(resultJson); // display_name yerine formatted_address Yaz

    }
    else{
        return false;
    }





};