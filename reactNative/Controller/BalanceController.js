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

export const usePromotionCode = async (Code) => {
   
    const db = firebase.firestore();
    db.collection("promotionCodes").where("Code", "==", Code)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(async function(doc) {
           
            // Kod Doğru
            if(doc.data().used == false)
            {

                var userUid = await AsyncStorage.getItem('userToken');
                const dbh = firebase.firestore();
                console.log(doc.id)
                const codeRef = await dbh.collection('promotionCodes').doc(doc.id)
                codeRef.update({
                  used:true,
                  who:userUid,
                })
                
                UpdateBalance(userUid,doc.data().amount);
                addLogs({cardNumber:'Yatan : Promosyon Kodu',date: new Date().toISOString().slice(0,10),amount:doc.data().amount + ' TL'})
                alert(doc.data().amount + ' TL Hesabınıza Yüklendi')

            }
            else{alert('Bu Promosyon Kodu Daha Önceden Kullanılmış Zaten')}

           
            
        });
    })
    .catch((e)=>{alert('Hatalı Promosyon Kodu' + e);})


};
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

    return new Promise(async (resolve, reject) => {

        var userUid = await AsyncStorage.getItem('userToken');

        // Var Olan kredi Kartlarini Çek
        const dbh2 = firebase.firestore();
        const usersRef = await dbh2.collection('paymentLogs').doc(userUid)
        usersRef.get()
            .then((docSnapshot) => {

                if (docSnapshot.exists) {
                    var LogsArray = docSnapshot.data().logs;
                    if(docSnapshot.data().logs != undefined)
                    { resolve(LogsArray);}
                    else
                    {
                        resolve('error');
                    }
                    
                    
                }
                else
                {
                    resolve('error');
                }
               

            }).catch((e)=>alert(e));
    });

}
