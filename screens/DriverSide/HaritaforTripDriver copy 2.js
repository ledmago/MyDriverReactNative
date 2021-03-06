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
    latitudeDelta: 0.00095,
    longitudeDelta: 0.00095,
    kalkisCordinate: {
      latitude: 0.0,
      longitude: 0.0,
    },
    varisCordinate: {
      latitude: 0.0,
      longitude: 0.0,
    },
    varisCordinateReal: {
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
    yolculukDurum: 0,

  };


  static navigationOptions = ({ navigation }) => {
    return {
      header: () => null
    }
  }
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Yolculuk Paneli',
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

    this.setState({ userRealTimeCordinates: { latitude: location.coords.latitude, longitude: location.coords.longitude }, kalkisCordinate: { latitude: location.coords.latitude, longitude: location.coords.longitude } })


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
    // this.watchPusula();
    this.watchLivePosition();


  }


  watchLivePosition = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    this.location = await Location.watchPositionAsync(
      {
        enableHighAccuracy: true,
        distanceInterval: 1,
        timeInterval: 1500,
      },
      async  newLocation => {
        let { coords } = newLocation;
        var heading = await Location.getHeadingAsync();

        this.map.animateCamera({ center: { latitude: coords.latitude, longitude: coords.longitude }, pitch: 50, heading: heading.trueHeading })
        // console.log(coords);
        let region = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.045,
          longitudeDelta: 0.045
        };


        var param1 = coords.latitude + ', ' + coords.longitude;
        var param2 = this.state.varisCordinate.lat + ', ' + this.state.varisCordinate.long;
        this.getDirections(param1, param2);

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


  nextStage = () => {
    var param1 = this.state.kalkisCordinate.latitude + ', ' + this.state.kalkisCordinate.longitude;
    var param2 = this.state.varisCordinate.latitude + ', ' + this.state.varisCordinate.longitude;

    this.getDirections(param1, param2)
  }


  yolcuBiraktim = async () => {
    var userUid = await AsyncStorage.getItem('yolcuUid');
    this.setState({ ModalLoading: true })
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    let location = await Location.getCurrentPositionAsync({}).catch(() => { alert('Bir hata meydana geldi lütfen tekrar deneyin !') });
    this.setState({ ModalLoading: false })
    this.setState({ userRealTimeCordinates: { latitude: location.coords.latitude, longitude: location.coords.longitude } })

    var differenceLat = Math.abs(location.coords.latitude - this.state.varisCordinateReal.latitude)
    var differenceLong = Math.abs(location.coords.longitude - this.state.varisCordinateReal.longitude)

    if (differenceLat < 0.004 && differenceLong < 0.004) {
      // Yolcuyu Bıraktım Kabul Oldu
      firebase.database().ref('tripDatabase').child(userUid).update({
        yolculukDurum: '2',
      })
      this.setState({ yolculukDurum: 2 })
      alert('Yolculuk Tamamlandı')
      // Burası Yapılacak


    }
    else {
      alert('Konum Servisinizden alınan bilgilere göre yolcunun bekledği yerde değilsiniz.')
    }

  }

  yolcuAldim = async () => {
    var userUid = await AsyncStorage.getItem('yolcuUid');
    this.setState({ ModalLoading: true })
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    let location = await Location.getCurrentPositionAsync({}).catch(() => { alert('Bir hata meydana geldi lütfen tekrar deneyin !') });
    this.setState({ ModalLoading: false })
    this.setState({ userRealTimeCordinates: { latitude: location.coords.latitude, longitude: location.coords.longitude } })
    var differenceLat = Math.abs(location.coords.latitude - this.state.yolcuCordinat.latitude)
    var differenceLong = Math.abs(location.coords.longitude - this.state.yolcuCordinat.longitude)
    if (differenceLat < 0.005 && differenceLong < 0.005) {
      // Yolcuyu Aldım Kabul Oldu
      firebase.database().ref('tripDatabase').child(userUid).update({
        yolculukDurum: '1',
      })

      this.nextStage(location);

    }
    else {
      alert('Konum Servisinizden alınan bilgilere göre yolcunun bekledği yerde değilsiniz.')
    }

  }

  getUserLocation = (userUid) => {



    const dbhRealtime2 = firebase.database();

    firebase.database().ref('tripDatabase').child(userUid).on('value', (e) => {

      var Location = { latitude: e.val().kalkisCordinate.lat, longitude: e.val().kalkisCordinate.long }
      this.setState({ yolcuCordinat: Location })
      var param1 = '';
      var param2 = '';
      if (e.val().yolculukDurum == null || e.val().yolculukDurum == 0) {
        param1 = this.state.userRealTimeCordinates.latitude + ', ' + this.state.userRealTimeCordinates.longitude;
        param2 = e.val().kalkisCordinate.lat + ', ' + e.val().kalkisCordinate.long;
      }
      else if (e.val().yolculukDurum == 1) {
        this.setState({ yolculukDurum: e.val().yolculukDurum })
        param1 = this.state.userRealTimeCordinates.latitude + ', ' + this.state.userRealTimeCordinates.longitude;
        param2 = e.val().varisCordinate.lat + ', ' + e.val().varisCordinate.long;
      }


      this.setState({ varisCordinate: { latitude: e.val().kalkisCordinate.lat, longitude: e.val().kalkisCordinate.long } })
      this.setState({ varisCordinateReal: { latitude: e.val().varisCordinate.lat, longitude: e.val().varisCordinate.long } })

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

        {
          (this.state.yolculukDurum == 0 || this.state.yolculukDurum == null) &&
          <TouchableOpacity onPress={() => { this.yolcuAldim() }} style={{ backgroundColor: '#202329', justifyContent: 'center', borderRadius: 20, height: 40, width: 65 + '%', position: 'absolute', bottom: 125, zIndex: 999999, alignSelf: 'center' }}>
            <Text style={{ textAlign: 'center', fontSize: 17, color: '#EBEBEB' }}>YOLCUYU ALDIM</Text>
          </TouchableOpacity>
        }
        {
          (this.state.yolculukDurum == 1) &&
          <TouchableOpacity onPress={() => { this.yolcuBiraktim() }} style={{ backgroundColor: '#202329', justifyContent: 'center', borderRadius: 20, height: 40, width: 65 + '%', position: 'absolute', bottom: 125, zIndex: 999999, alignSelf: 'center' }}>
            <Text style={{ textAlign: 'center', fontSize: 17, color: '#EBEBEB' }}>YOLCUYU BIRAKTIM</Text>
          </TouchableOpacity>
        }
        <MapView
  toolbarEnabled ={true}
          flat={true}
          ref={(map) => { this.map = map; }}
          showsTraffic={true}
          showsCompass={true}
          
          style={{ width: Dimensions.get('screen').width, height: Dimensions.get('screen').height, }}
          initialRegion={{ latitude: this.state.latitude, longitude: this.state.longitude, latitudeDelta: this.state.latitudeDelta, longitudeDelta: this.state.longitudeDelta }}
          followsUserLocation={true} showsUserLocation={true}>


          {(this.state.yolculukDurum == 1) &&
            <MapView.Marker coordinate={this.state.varisCordinateReal} title={'Varış Noktası'}></MapView.Marker>

          }

          {(this.state.yolculukDurum == null || this.state.yolculukDurum == 0) &&
            <MapView.Marker image={require('../../assets/images/user100.png')} coordinate={this.state.yolcuCordinat} title={'Yolcu :'}></MapView.Marker>

          }


          {//<MapView.Marker image={require('../../assets/images/carIcon100.png')} coordinate={this.state.userRealTimeCordinates} title={'Siz'}></MapView.Marker>
          }
          <MapView.Polyline
            coordinates={this.state.coords}
            strokeWidth={10}
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
