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
    param1: '',
    param2: '',
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
    _e: null,
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
    mapStyleRetro: [
      {
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#ebe3cd"
          }
        ]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#523735"
          }
        ]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#f5f1e6"
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#c9b2a6"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#dcd2be"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#ae9e90"
          }
        ]
      },
      {
        "featureType": "landscape.natural",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#dfd2ae"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#dfd2ae"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#93817c"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#a5b076"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#447530"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#f5f1e6"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#fdfcf8"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#f8c967"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#e9bc62"
          }
        ]
      },
      {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#e98d58"
          }
        ]
      },
      {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#db8555"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#806b63"
          }
        ]
      },
      {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#dfd2ae"
          }
        ]
      },
      {
        "featureType": "transit.line",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#8f7d77"
          }
        ]
      },
      {
        "featureType": "transit.line",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#ebe3cd"
          }
        ]
      },
      {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#dfd2ae"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#b9d3c2"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#92998d"
          }
        ]
      }
    ],
    mapStyleDark: [
      {
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#212121"
          }
        ]
      },
      {
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#212121"
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "administrative.country",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9e9e9e"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#bdbdbd"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#181818"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#616161"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#1b1b1b"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#2c2c2c"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#8a8a8a"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#373737"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#3c3c3c"
          }
        ]
      },
      {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#4e4e4e"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#616161"
          }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#000000"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#3d3d3d"
          }
        ]
      }
    ],
    MevcutTripArray: [],
    Ifexist: true,

  };

  zoomToDestination = () => {

    var param2Arry = this.state.param2;
    param2Arry = param2Arry.split(', ');
    var latitude = parseFloat(param2Arry[0]);
    var longitude = parseFloat(param2Arry[1]);
    this.map.animateCamera({ center: { latitude: latitude, longitude: longitude }, pitch: 50 });


    /* Yakınlaştıran Kod
    
         let region = {
             latitude: latitude,
             longitude:longitude,
             latitudeDelta: 0.005,
             longitudeDelta: 0.005
           };
           this.map.animateToRegion(region);
           
     */



  }

  zoomToUser = async () => {

    let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true, accuracy: Location.Accuracy.Highest });
    var heading = await Location.getHeadingAsync();
    let region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.002,
      longitudeDelta: 0.002
    };

    this.map.animateToRegion(region);

    setTimeout(() => this.map.animateCamera({ center: { latitude: location.coords.latitude, longitude: location.coords.longitude }, pitch: 50, heading: heading.trueHeading }), 1000);


  }

  mapStyle = this.state.mapStyleDark;
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

    var userUid = this.state.MevcutTripArray[0].from;

    this.getUserLocation(userUid);

  }

  mevcutDurumSorgula = async () => {
    return new Promise(async (resolve, reject) => {


      var MevcutTripArray = [];
      var Ifexist = false;
      this.setState({ Ifexist: Ifexist })
      var userUid = await AsyncStorage.getItem('userToken');
      const dbhRealtime = firebase.database();
      dbhRealtime.ref('tripDatabase').orderByChild('who').equalTo(userUid).once('value', (e) => {
        if (e.exists && e.val() != null) {
          Ifexist = true;
          var snapshot = e.val();

          MevcutTripArray = Object.keys(snapshot).map(i => snapshot[i])

          MevcutTripArray.map((l, i) => {
            if (l.durum != 1) { MevcutTripArray.splice(i, 1) } // Eğer Durum 1 değilse Siliyor

          });

          this.setState({ MevcutTripArray: MevcutTripArray, Ifexist: Ifexist });


          resolve(Ifexist);
        }
        else {
          reject(Ifexist);
        }
      })


    })

  }

  async componentDidMount() {
    this.props.navigation.setParams({ goBack: this.NavgoBack });
    // console.log(CustomerSide_StartTripController.Initial(this.props));
    CustomerSide_HomeController.Initial(this.props)

    // Mevcut (Şuan) Yolculuk Var mı ?

    this.mevcutDurumSorgula().then((ifexist) => {
      if (ifexist) {

        this.CheckLocation();
        // this.watchPusula();
        this.watchLivePosition();
      }
    }).catch(async() => { 
      this.setState({ ModalLoading: false }) 
      // Eğer Yolculukta Değilse Haritayı Ortala
      this.zoomToUser();
    
    }

    )




  }


  watchLivePosition = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    this.location = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Highest,
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


        this.setState({ userRealTimeCordinates: region });
        this.showDirections();
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
    var userUid = this.state.MevcutTripArray[0].from;
    this.setState({ ModalLoading: true })
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    let location = await Location.getCurrentPositionAsync({}).catch(() => { alert('Bir hata meydana geldi lütfen tekrar deneyin !') });
    this.setState({ ModalLoading: false })
    this.setState({ userRealTimeCordinates: { latitude: location.coords.latitude, longitude: location.coords.longitude } })

    var differenceLat = Math.abs(location.coords.latitude - this.state.varisCordinateReal.latitude)
    var differenceLong = Math.abs(location.coords.longitude - this.state.varisCordinateReal.longitude)

    if (differenceLat < 0.004 && differenceLong < 0.004) {
      // Yolcuyu Bıraktım Kabul Oldu
      firebase.database().ref('tripDatabase').child(userUid).remove();
      this.setState({ yolculukDurum: 2 })
      alert('Yolculuk Tamamlandı')
      // Burası Yapılacak


    }
    else {
      alert('Konum Servisinizden alınan bilgilere göre yolcunun bekledği yerde değilsiniz.')
    }

  }

  yolcuAldim = async () => {
    var userUid = this.state.MevcutTripArray[0].from;
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

  showDirections = () => {
    const e = this.state._e;
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


    this.setState({ param1: param1, param2: param2, varisCordinate: { latitude: e.val().kalkisCordinate.lat, longitude: e.val().kalkisCordinate.long } })
    this.setState({ varisCordinateReal: { latitude: e.val().varisCordinate.lat, longitude: e.val().varisCordinate.long } })

    this.getDirections(param1, param2)

  }

  getUserLocation = (userUid) => {



    const dbhRealtime2 = firebase.database();

    firebase.database().ref('tripDatabase').child(userUid).on('value', (e) => {

      var Location = { latitude: e.val().kalkisCordinate.lat, longitude: e.val().kalkisCordinate.long }
      this.setState({ yolcuCordinat: Location })
      this.setState({ _e: e });
      this.showDirections();


    });
  }









  render() {

    return (
      <View>


        <View style={{ position: 'absolute', marginTop:20,justifyContent:'center', zIndex: 9999999, right: 20, width: 50 }}>

          {(this.state.yolculukDurum == 0 || this.state.yolculukDurum == null) && <TouchableOpacity style={styles.circleIcons}><View style={{ alignSelf: 'center' }}><Ionicons name="ios-mail" size={30} color="#FFF" /></View></TouchableOpacity>}
          <TouchableOpacity style={styles.circleIcons}><View style={{ alignSelf: 'center' }}><Ionicons name="ios-person" size={30} color="#FFF" /></View></TouchableOpacity>
          <TouchableOpacity onPress={() => { this.zoomToUser() }} style={styles.circleIcons}><View style={{ alignSelf: 'center' }}><Ionicons name="ios-navigate" size={42} color="#FFF" /></View></TouchableOpacity>
          <TouchableOpacity style={styles.circleIcons} onPress={() => this.zoomToDestination()}><View style={{ alignSelf: 'center' }}><Ionicons name="ios-flag" size={30} color="#FFF" /></View></TouchableOpacity>
          <TouchableOpacity style={styles.circleIcons} onPress={() => {this.setState({ModalLoading:true});this.componentDidMount()}}><View style={{ alignSelf: 'center' }}><Ionicons name="ios-refresh" size={30} color="#FFF" /></View></TouchableOpacity>
        </View>


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
          <TouchableOpacity onPress={() => { this.yolcuAldim() }} style={{ backgroundColor: '#111', borderColor: 'red', borderWidth: 0.7, justifyContent: 'center', borderRadius: 20, height: 40, width: 65 + '%', position: 'absolute', bottom: 125, zIndex: 999999, alignSelf: 'center' }}>
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
          toolbarEnabled={true}
          flat={true}
          ref={(map) => { this.map = map; }}
          showsTraffic={true}
          showsCompass={true}
          customMapStyle={this.mapStyle}

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
  circleIcons:
  {
    alignSelf: 'center', marginTop: 20, width: 50, height: 50, borderRadius: 25, backgroundColor: 'red', alignContent: 'center', justifyContent: 'center'
  },
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
