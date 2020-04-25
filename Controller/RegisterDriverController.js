import React from 'react';
import { AsyncStorage, View, Text, ScrollView, } from 'react-native';
import firebase from '../components/Firebase';
import getRequest from './getRequest';
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

function checkValues(username, name, lastName, email, password, gender, sozlesme, telefon, aracMarka, aracModel, surucuBelgesi, aracModelYili, aracPlaka, aracRenk) {
    var errorMessage = '';
    var usernameOnay = username.length > 3 && username.length < 17 ? true : false;
    var nameOnay = name.length > 3 && name.length < 17 ? true : false;
    var lastNameOnay = lastName.length > 3 && lastName.length < 17 ? true : false;
    var emailOnay = ValidateEmail(email);
    var passwordOnay = password.length > 5 && password.length < 11 ? true : false;
    var genderOnay = gender == 'male' || gender == 'female' ? true : false;
    var sozlesmeOnay = sozlesme;
    var aracMarkaOnay = aracMarka != '0' || aracMarka != 0 || aracMarka != null;
    var aracModelOnay = aracModel != '0' || aracModel != 0 || aracModel != null;
    var surucuBelgesiOnay = surucuBelgesi == 'var' || surucuBelgesi == 'yok' ? true : false;
    var aracModelYiliOnay = aracModelYili.length > 3;
    var aracPlakaOnay = aracPlaka.length > 5;
    var aracRenk = aracRenk.length > 3;

    if (!usernameOnay) { errorMessage += 'Geçersiz Kullanıcı Adı\n' }
    if (!nameOnay) { errorMessage += 'Geçersiz Ad\n' }
    if (!lastNameOnay) { errorMessage += 'Geçersiz Soyad\n' }
    if (!emailOnay) { errorMessage += 'Geçersiz Email adresi\n' }
    if (!passwordOnay) { errorMessage += 'Şifre 5 ile 11 karakter arası olmalıdır.\n' }
    if (!genderOnay) { errorMessage += 'Lütfen cinsiyet seçiniz.\n' }
    if (!sozlesmeOnay) { errorMessage += 'Lütfen Kullanıcı Sözleşmesini Kabul Ediniz.\n' }
    if (!aracMarkaOnay) { errorMessage += 'Lütfen Araç Markasını Seçiniz.\n' }
    if (!aracModelOnay) { errorMessage += 'Lütfen Araç Modelini Seçiniz.\n' }
    if (!surucuBelgesiOnay) { errorMessage += 'Lütfen Sürücü Belgesini İşaretleyin\n' + aracModelYili + '..' }
    if (!aracModelYiliOnay) { errorMessage += 'Lütfen Araç Model Yılını Yazın.\n' }
    if (!aracPlakaOnay) { errorMessage += 'Lütfen Araç Plakasını Yazın.\n' }
    if (!aracRenk) { errorMessage += 'Lütfen Araç Rengini Yazın.\n' }

    if (usernameOnay && nameOnay && lastNameOnay && emailOnay && passwordOnay && genderOnay && sozlesmeOnay && aracMarkaOnay && surucuBelgesiOnay && aracModelYiliOnay && aracPlakaOnay, aracRenk) { return true } else { alert(errorMessage) }

    return false;

}


export const MakeRegister = async (username, name, lastName, email, password, gender, sozlesme, phone, aracMarka, aracModel, surucuBelgesi, aracModelYili, aracPlaka, aracRenk) => {

    if (checkValues(username, name, lastName, email, password, gender, sozlesme, phone, aracMarka, aracModel, surucuBelgesi, aracModelYili, aracPlaka, aracRenk)) {

        var result = await sendPostRequest({
            username: username,
            password: password,
            firstName: name,
            lastName: lastName,
            email: email,
            gender: gender,
            phone: phone,
            userType: "driver",
            vehicleTemp: { marka: aracMarka, model: aracModel, yil: aracModelYili, plaka: aracPlaka },
            driverLicense: surucuBelgesi == 'var' ? true:false,
        }, 'RegisterDriver')
        if (result) {
            if (result.status == 'fail') {
                alert(result.message);
            }
            else {
                RegisterProps.navigation.navigate('AppDriver')
            }
        }

    }

    // if (checkValues(name, email, password, gender, sozlesme, telefon, aracMarka, aracModel, surucuBelgesi, aracModelYili, aracPlaka,aracRenk)) {
    //     firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
    //         const thisUser = firebase.auth().currentUser;
    //         const dbh = firebase.firestore();
    //         dbh.collection("drivers").doc(thisUser.uid).set({
    //             name: name,
    //             email: email,
    //             password: password,
    //             gender: gender,
    //             lat: 0,
    //             long: 0,
    //             balance: 0,
    //             address: '',
    //             telefon: telefon,
    //             aracMarka: aracMarka,
    //             aracModel: aracModel,
    //             surucuBelgesi: surucuBelgesi,
    //             aracModelYili: aracModelYili,
    //             aracPlaka: aracPlaka,
    //             aracRenk:aracRenk,
    //         }).then(() => {
    //             AsyncStorage.setItem('userToken', thisUser.uid).then(() => { AsyncStorage.setItem('userType', 'driver').then(() => { RegisterProps.navigation.navigate('AppDriver') }) })

    //         })
    //     }).catch((errorMessage) => alert(errorMessage))
    // }


}
