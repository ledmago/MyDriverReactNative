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
  AsyncStorage
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
import { showMessage, hideMessage } from "react-native-flash-message";


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
    userRealTimeCordinates: { latitude: 0, longitude: 0 },
    yolcuCordinat: { latitude: 0, longitude: 0 },


  };


  static navigationOptions = ({ navigation }) => {
    return {
      header: () => null
    }
  }
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Canlı Harita',
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 20 }}
          onPress={navigation.getParam('goBack')}
          title="Info"
          color="#fff"
        ><Ionicons name="ios-arrow-back" size={35} color="#444" /></TouchableOpacity>


      ),
    };
  };
  NavgoBack = async () => {
    this.props.navigation.navigate('Main')

  };

  async getDirections(startLoc, destinationLoc) {
    try {

      let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&key=AIzaSyCnxh-3HMnSm-FHDuQ4kRQ7fYfUlicd7i0&language=en`)
      let respJson = await resp.json();
     // let Distance = respJson.routes[0].legs[0].distance.text;
     // let Duration = respJson.routes[0].legs[0].duration.text;
      

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
  CheckLocation = async (buttondanGeldi = false) => {
    if (buttondanGeldi) { this.setState({ Modal1OpenLoadingButton: true }) }
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    let location = await Location.getCurrentPositionAsync({}).catch(() => { this.setState({ Modal1Open: true }) });
    this.setState({ location });

    this.setState({ kalkisCordinate: { latitude: location.coords.latitude, longitude: location.coords.longitude } })


    this.setState({ latitude: location.coords.latitude, longitude: location.coords.longitude, ModalLoading: false });
    this.setState({ geoCoding: await CustomerSide_HomeController.GET_ADRESS(location.coords.latitude, location.coords.longitude) });

    var userUid = await AsyncStorage.getItem('yolcuUid');


    this.getUserLocation(userUid);

  }



  async componentDidMount() {
    this.props.navigation.setParams({ goBack: this.NavgoBack });
    // console.log(CustomerSide_StartTripController.Initial(this.props));
    CustomerSide_HomeController.Initial(this.props)
    this.CheckLocation();
    this.watchLivePosition();
  }



  watchLivePosition = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    this.location = await Location.watchPositionAsync(
      {
        enableHighAccuracy: true,
        distanceInterval: 1,
        timeInterval: 10000
      },
      async  newLocation => {
        let { coords } = newLocation;
        // console.log(coords);
        let region = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.045,
          longitudeDelta: 0.045
        };
        this.setState({ userRealTimeCordinates: region });
        var userUid = await AsyncStorage.getItem('userToken');
        firebase.database().ref('drivers/' + userUid).update({
          lat: coords.latitude,
          long: coords.longitude
        });
      },
      error => console.log(error)
    );
    return this.location;
  };





  getUserLocation = (userUid) => {



    const dbhRealtime2 = firebase.database();

    firebase.database().ref('tripDatabase').child(userUid).on('value', (e) => {

      var Location = { latitude: e.val().kalkisCordinate.lat, longitude: e.val().kalkisCordinate.long }
      this.setState({ yolcuCordinat: Location })

      var param1 = e.val().kalkisCordinate.lat + ', ' +e.val().kalkisCordinate.long;
      var param2 = e.val().varisCordinate.lat + ', ' + e.val().varisCordinate.long;
      userRealTimeCordinates
      this.getDirections(param1, param2)
      


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



          <MapView.Marker image={require('../../assets/images/user100.png')} coordinate={this.state.yolcuCordinat} title={'Yolcu :'}></MapView.Marker>




          <MapView.Marker image={require('../../assets/images/carIcon100.png')} coordinate={this.state.userRealTimeCordinates} title={'Siz'}></MapView.Marker>

          <MapView.Polyline
            coordinates={this.state.coords}
            strokeWidth={2}
            strokeColor="red" />

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
