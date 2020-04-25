import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  ActivityIndicator,
  Dimensions,
  Modal,
  TouchableHighlight,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { MonoText } from '../../components/StyledText';
import MapView from 'react-native-maps';
import Marker from 'react-native-maps';
import { Divider, SearchBar, Avatar, ListItem, Button, Badge, CheckBox } from 'react-native-elements';
import * as Font from 'expo-font';
import * as CustomerSide_StartTripController from '../../Controller/StartTripController';
import * as CustomerSide_HomeController from '../../Controller/CustomerSide_HomeController';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Polyline from '@mapbox/polyline';
import firebase from '../../components/Firebase';

import FlashMessage from "react-native-flash-message";
import { showMessage, hideMessage} from "react-native-flash-message";


export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);

  }
  state = {
    EkAciklama: '',
    hepsi: true,
    suv: false,
    hatchback: false,
    sedan: false,
    minibus: false,
    varisAddress: '',
    kalkisAdress: '',
    location: null,
    errorMessage: null,
    step: 1,
    // Yol Kordinatları
    coords: [],
    // ---------
    latitude: 0.0,
    longitude: 0.0,
    latitudeDelta: 0.0095,
    longitudeDelta: 0.0095,
    kalkisCordinate: {
      latitude: 0.0,
      longitude: 0.0,
    },
    varisCordinate: {
      latitude: 0.0,
      longitude: 0.0,
    },
    geoCoding: '',
    neredenSecilcek: true,
    ModalLoading: true,
    kisiSayisi: 1,
    distance: 0,
    duration: 0,
    TripPrice: 0,
    onlineUsers: [{ userUid: 'test', lat: 0, long: 0 }],
    onlineDrivers: [{ userUid: 'test', lat: 0, long: 0 }],



  };


  static navigationOptions = ({ navigation }) => {
    return {
      header: () => null
    }
  }


  CheckLocation = async (buttondanGeldi = false) => {
    if (buttondanGeldi) { this.setState({ Modal1OpenLoadingButton: true }) }
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    let location = await Location.getCurrentPositionAsync({}).catch(() => { this.setState({ Modal1Open: true }) });
    this.setState({ location });

    this.setState({ kalkisCordinate: { latitude: location.coords.latitude, longitude: location.coords.longitude } })


    this.setState({ latitude: location.coords.latitude, longitude: location.coords.longitude, ModalLoading: false });
    this.setState({ geoCoding: await CustomerSide_HomeController.GET_ADRESS(location.coords.latitude, location.coords.longitude) });

    this.getOnlineUser();
    this.getOnlineDrivers()
  }



  async componentDidMount() {
    // console.log(CustomerSide_StartTripController.Initial(this.props));
    // CustomerSide_HomeController.Initial(this.props)
    this.CheckLocation();
  }



  getPlacesCordinates = (place_id) => {
    //https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJKTcrIyXI3xQRzNOy25ZW0OQ&key=AIzaSyCnxh-3HMnSm-FHDuQ4kRQ7fYfUlicd7i0
    var apiKey = 'AIzaSyCnxh-3HMnSm-FHDuQ4kRQ7fYfUlicd7i0';
    fetch('https://maps.googleapis.com/maps/api/place/details/json?place_id=' + place_id + '&key=' + apiKey, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json())
      .then((responseData) => {
        // console.log(responseData);
        this.setState({ ModalLoading: false });

        this.setState({ neredenSecilcek: false })
        this.setState({ latitude: responseData.result.geometry.location.lat, longitude: responseData.result.geometry.location.lng })
        var newCordinates = { latitude: responseData.result.geometry.location.lat, longitude: responseData.result.geometry.location.lng };
        if (this.state.step == 1) {
          this.setState({ kalkisCordinate: newCordinates })
          // Kalkış Seçme Haritadan
        }
        else if (this.state.step == 2) {
          this.setState({ varisCordinate: newCordinates })
          // Varış Seçme Haritadan

        }





      })
  }

  calculatePrice = (distance, duration) => {
    var distancaKatsayi;
    if (distance > 0 && distance <= 2) { distancaKatsayi = 5.20 }
    else if (distance > 2 && distance <= 4) { distancaKatsayi = 4.60 }
    else if (distance > 4 && distance <= 6) { distancaKatsayi = 3.70 }
    else if (distance > 6 && distance <= 10) { distancaKatsayi = 2.9 }
    else if (distance > 10 && distance <= 15) { distancaKatsayi = 2.4 }
    else if (distance > 15 && distance <= 30) { distancaKatsayi = 2 }
    else if (distance > 30 && distance <= 60) { distancaKatsayi = 1.5 }
    else if (distance > 60) { distancaKatsayi = 1.3 }
    return (distance * distancaKatsayi).toFixed(2);
  }
  // 
  async getDirections(startLoc, destinationLoc) {
    try {

      let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&key=AIzaSyCnxh-3HMnSm-FHDuQ4kRQ7fYfUlicd7i0&language=en`)
      let respJson = await resp.json();
      let Distance = respJson.routes[0].legs[0].distance.text;
      let Duration = respJson.routes[0].legs[0].duration.text;
      this.setState({ distance: Distance, duration: Duration.substr(0, Duration.indexOf(' ')) + ' dakika' });


      this.setState({ TripPrice: this.calculatePrice(Distance.substr(0, Distance.indexOf(' ')), Duration) })

      let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
      let coords = points.map((point, index) => {
        return {
          latitude: point[0],
          longitude: point[1]
        }
      })
      this.setState({ coords: coords })
      return coords
    } catch (error) {
      //  alert(error)
      return error
    }
  }


  findPlacesFromApi = async (text) => {

    //https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=AIzaSyCnxh-3HMnSm-FHDuQ4kRQ7fYfUlicd7i0&input=kale%20i%C3%A7i%20gazima%C4%9Fusa&inputtype=textquery
    var apiKey = 'AIzaSyCnxh-3HMnSm-FHDuQ4kRQ7fYfUlicd7i0';
    fetch('https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=' + apiKey + '&input=' + text + '&inputtype=textquery', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',

      },



    }).then((response) => response.json())
      .then((responseData) => {
        this.setState({ ModalLoading: false })
        if (responseData.status == "INVALID_REQUEST" || responseData.status == "ZERO_RESULTS" || responseData.status == "OVER_QUERY_LIMIT") {
          alert("Hata oluştu. Sonra tekrar deneyin." + responseData.status)
        }
        else {
          this.getPlacesCordinates(responseData.candidates[0].place_id); // returns place id.
        }




      }).catch((e) => { console.log(e) })
  };



  getOnlineUser = () => {


    var onlineUsers = this.state.onlineUsers;
    var now = Math.floor(Date.now() / 1000);

    const dbhRealtime = firebase.database();
    dbhRealtime.ref('users').orderByChild('lat').startAt(this.state.longitude - 0.02).on('child_removed', (e) => {
      if (e.val().lat < this.state.latitude + 0.02 && e.val().long > this.state.longitude - 0.02 && e.val().long < this.state.longitude + 0.02) {
        onlineUsers.map((l, i) => {
          if (l.userUid == e.val().userUid) {
            //  alert(this.state.onlineUsers.length)
            onlineUsers.splice(i, 1)
            this.setState({ onlineUsers: onlineUsers })
            // alert('Burası Çalıştı' + this.state.onlineUsers.length)
            showMessage({
              message: e.val().name + 'Çevrimdışı',
              description: e.val().name + 'Şuan Çevrimdışı',
              type: "danger",
            });
          }
        })
      }


    });

    const dbhRealtime2 = firebase.database();


    dbhRealtime2.ref('users').orderByChild('lat').startAt(this.state.longitude - 0.02).on('child_added', (e) => {
      if (e.val().lat < this.state.latitude + 0.02 && e.val().long > this.state.longitude - 0.02 && e.val().long < this.state.longitude + 0.02) {
        var now = Math.floor(Date.now() / 1000);

        var onlineUsersTemp = this.state.onlineUsers;

        var bulundu = false;
        onlineUsersTemp.map((l, i) => { if (l.userUid == e.val().userUid) { bulundu = true } });

        if (bulundu == false) {

          if (now - 10 < e.val().timestamp && now + 10 > e.val().timestamp) {

            //if(onlineUsersTemp.length == 1){onlineUsersTemp = []}
            onlineUsersTemp.push(e.val());
            console.log(onlineUsersTemp)
            this.setState({ onlineUsers: onlineUsersTemp })

            showMessage({
              message: e.val().name + 'Çevrim İçi',
              description: e.val().name + 'Şuan Çevrimiçi',
              type: "success",
            });

            
          }
        }
      }
    });





    const dbhRealtime3 = firebase.database();
    dbhRealtime3.ref('users').orderByChild('lat').startAt(this.state.longitude - 0.02).on('child_changed', (e) => {
      // Burada Filtreleme Yapılıyor

      if (e.val().lat < this.state.latitude + 0.02 && e.val().long > this.state.longitude - 0.02 && e.val().long < this.state.longitude + 0.02) {
        var tempDrivers = this.state.onlineUsers;
        tempDrivers.map((l, i) => {
          if (l.userUid == e.val().userUid) {
            tempDrivers[i].lat = e.val().lat;
            tempDrivers[i].long = e.val().long;
            this.setState({ onlineUsers: tempDrivers });
          }
        });
      }


    });




  }






  getOnlineDrivers = () => {
    var onlineUsers = this.state.onlineDrivers;
    var now = Math.floor(Date.now() / 1000);

    const dbhRealtime = firebase.database();
    dbhRealtime.ref('drivers').orderByChild('lat').startAt(this.state.longitude - 0.02).on('child_removed', (e) => {
      if (e.val().lat < this.state.latitude + 0.02 && e.val().long > this.state.longitude - 0.02 && e.val().long < this.state.longitude + 0.02) {
        onlineUsers.map((l, i) => {
          if (l.userUid == e.val().userUid) {
            //  alert(this.state.onlineUsers.length)
            onlineUsers.splice(i, 1)
            this.setState({ onlineDrivers: onlineUsers })
            showMessage({
              message: e.val().name + 'Çevrimdışı',
              description: e.val().name + 'Şuan Çevrimdışı',
              type: "danger",
            });
            // alert('Burası Çalıştı' + this.state.onlineUsers.length)
          }
        })
      }


    });

    const dbhRealtime2 = firebase.database();


    dbhRealtime2.ref('drivers').orderByChild('lat').startAt(this.state.longitude - 0.02).on('child_added', (e) => {
      if (e.val().lat < this.state.latitude + 0.02 && e.val().long > this.state.longitude - 0.02 && e.val().long < this.state.longitude + 0.02) {
        var now = Math.floor(Date.now() / 1000);

        var onlineUsersTemp = this.state.onlineDrivers;

        var bulundu = false;
        onlineUsersTemp.map((l, i) => { if (l.userUid == e.val().userUid) { bulundu = true } });

        if (bulundu == false) {

          if (now - 10 < e.val().timestamp && now + 10 > e.val().timestamp) {

            //if(onlineUsersTemp.length == 1){onlineUsersTemp = []}
            onlineUsersTemp.push(e.val());
            console.log(onlineUsersTemp)
            this.setState({ onlineDrivers: onlineUsersTemp })
            showMessage({
              message: e.val().name + 'Çevrim İçi',
              description: e.val().name + 'Şuan Çevrimiçi',
              type: "success",
            });

          }
        }
      }
    });





    const dbhRealtime3 = firebase.database();
    dbhRealtime3.ref('drivers').orderByChild('lat').startAt(this.state.longitude - 0.02).on('child_changed', (e) => {
      // Burada Filtreleme Yapılıyor

      if (e.val().lat < this.state.latitude + 0.02 && e.val().long > this.state.longitude - 0.02 && e.val().long < this.state.longitude + 0.02) {
        var tempDrivers = this.state.onlineDrivers;
        tempDrivers.map((l, i) => {
          if (l.userUid == e.val().userUid) {
            tempDrivers[i].lat = e.val().lat;
            tempDrivers[i].long = e.val().long;
            this.setState({ onlineDrivers: tempDrivers });
          }
        });
      }


    });





  }






  render() {

    return (
      <View>
        <Modal animationType="slide"
          transparent={true}
          visible={this.state.ModalLoading}

          onRequestClose={() => {

          }}>

          <View style={{ backgroundColor: '#000000b0', justifyContent: 'center', position: 'absolute', left: 0, top: 0, width: 100 + '%', height: 100 + '%', zIndex: 2 }}>
            <View style={{ borderRadius: 3, padding: 20, backgroundColor: '#FFF', borderColor: '#CCC', borderWidth: 1, width: 200, borderRadius: 2, alignSelf: 'center' }}>
              <ActivityIndicator size={50} />
              <Text style={{ textAlign: 'center' }}>Yükleniyor</Text>
            </View>
          </View>
        </Modal>
        <MapView
          style={{ width: Dimensions.get('screen').width, height: Dimensions.get('screen').height, }} region={{ latitude: this.state.latitude, longitude: this.state.longitude, latitudeDelta: this.state.latitudeDelta, longitudeDelta: this.state.longitudeDelta }} showsUserLocation={true}>

          {this.state.onlineUsers.map((l, i) => {

            return (<MapView.Marker image={require('../../assets/images/user100.png')} coordinate={{ latitude: l.lat, longitude: l.long }} title={'Yolcu :' + l.name}></MapView.Marker>)
          })}

          {this.state.onlineDrivers.map((l, i) => {

            return (<MapView.Marker image={require('../../assets/images/carIcon100.png')} coordinate={{ latitude: l.lat, longitude: l.long }} title={'Sürücü : ' + l.name}></MapView.Marker>)
          })}


        </MapView>
        <FlashMessage position="top" />
      </View>


    );
  }


};
const styles = StyleSheet.create({
  input: {
    width: 85 + '%',
    color: '#CCC',
    backgroundColor: '#FFF',
    alignSelf: 'center',
    paddingHorizontal: 10,
    borderRadius: 1,
    borderColor: '#333',
    borderBottomWidth: 1,
    padding: 10,
    fontSize: 16,
    marginBottom: 0,
    paddingLeft: 25,
    paddingRight: 25,


  },
  baslikText:
  {
    padding: 15,
    fontSize: 18,
    fontFamily: 'airbnbCereal-medium',
    color: '#fe4858'
  },
  MainContext: {
    backgroundColor: '#FFF',
    width: 90 + ' %',
    paddingBottom: 20,
    alignSelf: 'center',
    marginTop: 15,
    borderRadius: 4,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
    }),

  },
  searchInput:
  {
    paddingHorizontal: 15,
    fontSize: 18,
    fontFamily: 'airbnbCereal-light',

  },
  searchBar: {
    backgroundColor: '#FFF', width: 90 + '%', height: 50, marginTop: 20,
    borderRadius: 4,
    alignSelf: 'center',
    justifyContent: 'center',


    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
    }),

  }
});
