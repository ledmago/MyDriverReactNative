import React from 'react';
import { AsyncStorage, View, Text, ScrollView, } from 'react-native';
import sendPostRequest from './getRequest';

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

function checkValues(username, name, lastName, email, password, gender, sozlesme) {
    var errorMessage = '';
    var nameOnay = name.length > 3 && name.length < 17 ? true : false;
    var usernameOnay = username.length > 3 && name.length < 17 ? true : false;
    var LastNameOnay = lastName.length > 3 && name.length < 17 ? true : false;
    var emailOnay = ValidateEmail(email);
    var passwordOnay = password.length > 5 && password.length < 11 ? true : false;
    var genderOnay = gender == 'male' || gender == 'female' ? true : false;
    var sozlesmeOnay = sozlesme;

    if (!nameOnay) { errorMessage += 'Geçersiz Ad Soyad\n' }
    if (!emailOnay) { errorMessage += 'Geçersiz Email adresi\n' }
    if (!passwordOnay) { errorMessage += 'Şifre 4 ile 11 karakter arası olmalıdır.\n' }
    if (!genderOnay) { errorMessage += 'Lütfen cinsiyet seçiniz.\n' }
    if (!sozlesmeOnay) { errorMessage += 'Lütfen Kullanıcı Sözleşmesini Kabul Ediniz.\n' }
    if (!LastNameOnay) { errorMessage += 'Soyadınız 4 ile 11 karakter arası olmalıdır.\n' }
    if (!usernameOnay) { errorMessage += 'Kullanıcı adınız 4 ile 11 karakter arası olmalıdır..\n' }

    if (nameOnay && emailOnay && passwordOnay && genderOnay && sozlesmeOnay && LastNameOnay && usernameOnay) { return true } else { alert(errorMessage) }

    return false;

}

export const MakeRegister = async (username, name, lastName, email, password, gender, sozlesme, phone) => {



    if (checkValues(username, name, lastName, email, password, gender, sozlesme)) {

        var result = await sendPostRequest({
            username: username,
            password: password,
            firstName: name,
            lastName: lastName,
            email: email,
            gender: gender,
            phone: phone,
            userType: "user",
        }, 'RegisterUser')
        if (result) {
            if (result.status == 'fail') {
                alert(result.message);
            }
            else {
                RegisterProps.navigation.navigate('App')
            }
        }

    }


}
