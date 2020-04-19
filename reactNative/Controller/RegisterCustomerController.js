import React from 'react';
import { AsyncStorage, View, Text, ScrollView, } from 'react-native';
import firebase from '../components/Firebase';

var state = {
}
var RegisterProps;
export const Initial = (props) => {
    {
        RegisterProps = props;

    }
}

function ValidateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
        return (true)
    }
    return (false)
}

function checkValues(name, email, password, gender, sozlesme) {
    var errorMessage = '';
    var nameOnay = name.length > 4 && name.length < 17 ? true : false;
    var emailOnay = ValidateEmail(email);
    var passwordOnay = password.length > 5 && password.length < 11 ? true : false;
    var genderOnay = gender == 'erkek' || gender == 'kadin' ? true : false;
    var sozlesmeOnay = sozlesme;

    if (!nameOnay) { errorMessage += 'Geçersiz Ad Soyad\n' }
    if (!emailOnay) { errorMessage += 'Geçersiz Email adresi\n' }
    if (!passwordOnay) { errorMessage += 'Şifre 5 ile 11 karakter arası olmalıdır.\n' }
    if (!genderOnay) { errorMessage += 'Lütfen cinsiyet seçiniz.\n' }
    if (!sozlesmeOnay) { errorMessage += 'Lütfen Kullanıcı Sözleşmesini Kabul Ediniz.\n' }

    if (nameOnay && emailOnay && passwordOnay && genderOnay && sozlesmeOnay) { return true } else { alert(errorMessage) }

    return false;

}

export const MakeRegister = async (name, email, password, gender, sozlesme,telefon) => {
    if (checkValues(name, email, password, gender, sozlesme)) {
        firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
            const thisUser = firebase.auth().currentUser;
            const dbh = firebase.firestore();
            dbh.collection("users").doc(thisUser.uid).set({
                name: name,
                email: email,
                password: password,
                gender: gender,
                lat: 0,
                long: 0,
                balance:0,
                address:'',
                telefon:telefon,
            }).then(() => {
                AsyncStorage.setItem('userToken', thisUser.uid).then(() => { AsyncStorage.setItem('userType', 'rider').then(() => { RegisterProps.navigation.navigate('App')})})
            })
        }).catch((errorMessage)=>alert(errorMessage))
    }


}
