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

export const getStringAddressByCoordinate = async (lat, long) => {

    // API 1 = https://eu1.locationiq.com/v1/reverse.php?key=pk.71b1230f1fbd1fc1cd3f3579d3910211&lat=51.50354&lon=-0.12768&format=json
    // API 2 = https://geocode.xyz/51.50354,-0.12768?geoit=json

    var apiKey = config.GoogleMapApiKey;
    const getApiResult = await fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + long + '&key=' + apiKey, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',

        }
    });
    if (getApiResult) {
        const resultJson = await getApiResult.json()

        var newAddress = { display_name: resultJson.results[0].formatted_address }
       return(newAddress); // display_name yerine formatted_address Yaz

    }
    else{
        return false;
    }





};