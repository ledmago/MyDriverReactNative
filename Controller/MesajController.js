import React from 'react';
import { AsyncStorage, View, Text, ScrollView, Platform, Alert } from 'react-native';
import Constants from 'expo-constants';
import firebase from '../components/Firebase';

var jsonData = null;
var HomeProps;


export const Initial = (props) => {

    HomeProps = props;


}
export const getChatList = async () => {

    return new Promise(async (resolve, reject) => {

   
        var userUid = await AsyncStorage.getItem('userToken');
        const userType = await AsyncStorage.getItem('usertype');
        const type = userType=='driver'?'drivers':'users';
        const dbh2 = firebase.firestore();
        const usersRef = await dbh2.collection(type).doc(userUid)
        usersRef.get()
            .then((docSnapshot) => {
                try{
                    // resolve(userUid);
                if (docSnapshot.exists && docSnapshot.data().chatList != null) {resolve(docSnapshot.data().chatList)}
                else{resolve(null);}
            }
            catch(e){resolve(null);}

            });
    });

}
export const getChatOpponentPartner = async (chatID) => {

    return new Promise(async (resolve, reject) => {

   
        var userUid = await AsyncStorage.getItem('userToken');
        const userType = await AsyncStorage.getItem('usertype');
        const type = userType=='driver'?'drivers':'users';
        resolve()
        firebase.database().ref('chat').child(chatID).once('value',(e)=>{
            resolve(e.val())
        })
    });

}