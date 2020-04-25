import * as firebase from 'firebase';
import '@firebase/firestore';

// Initialize Firebase
const firebaseConfig = {

    apiKey: "AIzaSyDOKNhH3i9Gc1oVpDFe5AU1p4wePKrgdQk",
    authDomain: "uberincyprus.firebaseapp.com",
    databaseURL: "https://uberincyprus.firebaseio.com",
    projectId: "uberincyprus",
    storageBucket: "uberincyprus.appspot.com",
    messagingSenderId: "902806016290",
    appId: "1:902806016290:web:821656f43f61045831d57b",
    measurementId: "G-BSYFBW0V2Q"
};


firebase.initializeApp(firebaseConfig);
export default firebase;