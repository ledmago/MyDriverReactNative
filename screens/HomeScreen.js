import * as WebBrowser from 'expo-web-browser';
import React from 'react';

import firebase from '../components/Firebase';
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
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { MonoText } from '../components/StyledText';
import MapView from 'react-native-maps';
import { Divider, SearchBar, Avatar, ListItem, Button, Badge } from 'react-native-elements';
import * as Font from 'expo-font';
import * as CustomerSide_HomeController from '../Controller/CustomerSide_HomeController';
import * as OnlineController from '../Controller/OnlineController'
import CreditCardComponent from '../components/CreditCardList';
import EslestirmeComponent from '../components/Eslestirme';


export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);

  }
  state = {
    refreshing: false,
    userDetails: {
      email: '',
      name: '',
      gender: '',
      balance: '',
      lat: '',
      long: '',
    },
    location: null,
    errorMessage: null,
    latitude: 35.333500,
    longitude: 33.314209,
    geoCoding: '',
    Modal1Open: false,
    Modal1OpenLoadingButton: false,
    onlineuserCount: 0,
    gecmis_yolculuklar: [{
      driver_name: 'Altay Temiz',
      price: 40,
      trip_km: 15,
      date: '17/02/21',
    },
    {
      driver_name: 'Mustafa Can Demir',
      price: 40,
      trip_km: 5,
      date: '18/02/21',
    },
    {
      driver_name: 'Burak Açıkoğulları',
      price: 15,
      trip_km: 10,
      date: '25/01/22',
    },
    ],
    onlineUsers: [{ userUid: 'test' },],
    onlineDrivers:[{ userUid: 'test' },],
  };


  onRefresh = () => {

    this.setState({ refreshing: true })
    this.componentDidMount().then(() => this.setState({ refreshing: false }));
this._EslestirmeComponent.componentDidMount();
  }
  static navigationOptions = ({ navigation }) => {
    return {
      header: () => null
    }
  }



  CheckLocation = async (buttondanGeldi = false) => {
    setInterval(() => { OnlineController.updateUserRealTime(false).then((e)=>{this.getOnlineUser();this.getOnlineDrivers()}); }, 10000)
    if (buttondanGeldi) { this.setState({ Modal1OpenLoadingButton: true }) }
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    location = await Location.watchPositionAsync(
      {
        enableHighAccuracy: true,
        distanceInterval: 1,
        timeInterval: 10000
      },
      async newLocation => {
        let { coords } = newLocation;
        // console.log(coords);
        let region = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.045,
          longitudeDelta: 0.045
        };
        this.setState({ location:coords});
        this.setState({ latitude: coords.latitude, longitude: coords.longitude, Modal1Open: false, Modal1OpenLoadingButton: false });
        this.setState({ geoCoding: await CustomerSide_HomeController.GET_ADRESS(coords.latitude, coords.longitude) });
        CustomerSide_HomeController.updateUserLocation(coords.latitude, coords.longitude, this.state.geoCoding.display_name);
    
        //Client Update
        OnlineController.updateUserRealTime(false).then((e)=>{this.getOnlineUser();this.getOnlineDrivers()});
        OnlineController.updateUserRealTimeLocation(false,this.state.userDetails.name, coords.latitude, coords.longitude, this.state.geoCoding.display_name).then((e)=>{this.getOnlineUser();this.getOnlineDrivers()});
        


      },
      error => this.setState({ Modal1Open: true })
    );

  };

  /*CheckLocation = async (buttondanGeldi = false) => {
    if (buttondanGeldi) { this.setState({ Modal1OpenLoadingButton: true }) }
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    let location = await Location.getCurrentPositionAsync({}).catch(() => { this.setState({ Modal1Open: true }) });
    this.setState({ location });
    this.setState({ latitude: location.coords.latitude, longitude: location.coords.longitude, Modal1Open: false, Modal1OpenLoadingButton: false });
    this.setState({ geoCoding: await CustomerSide_HomeController.GET_ADRESS(location.coords.latitude, location.coords.longitude) });
    CustomerSide_HomeController.updateUserLocation(location.coords.latitude, location.coords.longitude, this.state.geoCoding.display_name);

    //Client Update
    OnlineController.updateUserRealTime(false).then((e)=>{this.getOnlineUser();this.getOnlineDrivers()});
    setInterval(() => { OnlineController.updateUserRealTimeLocation(false,this.state.userDetails.name, location.coords.latitude, location.coords.longitude, this.state.geoCoding.display_name).then((e)=>{this.getOnlineUser();this.getOnlineDrivers()}); }, 10000)
    
    
  }*/
  getOnlineUser = () => {
    var onlineUsers = this.state.onlineUsers;
    var now = Math.floor(Date.now() / 1000);

    const dbhRealtime = firebase.database();
    dbhRealtime.ref('users').orderByChild('status').equalTo('online').on('child_removed', (e) => {

      onlineUsers.map((l, i) => {
        if (l.userUid == e.val().userUid) {
          //  alert(this.state.onlineUsers.length)
          onlineUsers.splice(i, 1)
          this.setState({ onlineUsers: onlineUsers })
          // alert('Burası Çalıştı' + this.state.onlineUsers.length)
        }
      })


    });

    const dbhRealtime2 = firebase.database();


    dbhRealtime2.ref('users').orderByChild('status').equalTo('online').on('child_added', (e) => {
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
        }

      }





      // alert('Eklendi' + this.state.onlineUsers.length)

    });

  }
  getOnlineDrivers= () => {
    var onlineUsers = this.state.onlineDrivers;
    var now = Math.floor(Date.now() / 1000);

    const dbhRealtime = firebase.database();
    dbhRealtime.ref('drivers').orderByChild('status').equalTo('online').on('child_removed', (e) => {

      onlineUsers.map((l, i) => {
        if (l.userUid == e.val().userUid) {
          //  alert(this.state.onlineUsers.length)
          onlineUsers.splice(i, 1)
          this.setState({ onlineDrivers: onlineUsers })
          // alert('Burası Çalıştı' + this.state.onlineUsers.length)
        }
      })


    });

    const dbhRealtime2 = firebase.database();


    dbhRealtime2.ref('drivers').orderByChild('status').equalTo('online').on('child_added', (e) => {
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
        }

      }





      // alert('Eklendi' + this.state.onlineUsers.length)

    });

  }



  async componentDidMount() {
    // CustomerSide_HomeController.Initial(this.props);
    // // User Details'i Çek ve UserDetails'i State Durumuna Aktar. 
    // CustomerSide_HomeController.getUserDetails().then((userdata) => { this.setState({ userDetails: userdata }); })

    // //  CustomerSide_HomeController.getOnlineUsers().then((e) => {/* this.setState({onlineUsers:e}); */   });
    // this.CheckLocation();

  }

mapStyle= [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#242f3e"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#746855"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#242f3e"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#263c3f"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#6b9a76"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#38414e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#212a37"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9ca5b3"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#746855"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#1f2835"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#f3d19c"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#2f3948"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#17263c"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#515c6d"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#17263c"
      }
    ]
  }
];


  render() {

    return (
      <View style={styles.container}>



        <Modal animationType="slide"
          transparent={true}
          visible={this.state.Modal1Open}

          onRequestClose={() => {

          }}>

          <View style={{ backgroundColor: '#000000b0', justifyContent: 'center', position: 'absolute', left: 0, top: 0, width: 100 + '%', height: 100 + '%', zIndex: 2 }}>

            <View style={{ borderRadius: 3, padding: 20, backgroundColor: '#FFF', borderColor: '#CCC', borderWidth: 1, width: 85 + '%', height: 250, alignSelf: 'center' }}>

              <Text style={{ fontFamily: 'airbnbCereal-medium', textAlign: 'center', fontSize: 20, }}>Konumunuza Ulaşamadık</Text>
              <Text style={{ fontFamily: 'airbnbCereal-light', textAlign: 'left', fontSize: 15, marginTop: 20, }}>Belirli bir sebepten dolayı konumunuza ulaşamadık. Uygulamayı kullanmanız için konumunuza ihtiyacımız var.</Text>
              <Text style={{ fontFamily: 'airbnbCereal-light', textAlign: 'left', fontSize: 14, marginTop: 20, }}>- Telefonunuzun Konum Hizmetlerini Açın</Text>
              <Text style={{ fontFamily: 'airbnbCereal-light', textAlign: 'left', fontSize: 14, marginTop: 5, marginBottom: 10 }}>- İnternete bağlı Olduğunuzdan Emin Olun</Text>
              <Button title='Tekrar Dene' loading={this.state.Modal1OpenLoadingButton} onPress={() => { this.CheckLocation(true) }} />


            </View>
          </View>


        </Modal>



      

        <View style={styles.ProfileHeader}>
          <Avatar
            source={{
              uri:
                'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
            }}
            showEditButton
            rounded={true}
            size={60}
            containerStyle={{ borderWidth: 1, borderColor: '#fed32c', marginTop: 3, }}
          />
          <View style={{ marginLeft: 15, width: Dimensions.get('screen').width - 200, }}>
            <Text style={{ fontFamily: 'airbnbCereal-medium', color: '#CCC', fontSize: 21, }}>{this.state.userDetails.name}</Text>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: 12, height: 12, backgroundColor: 'green', borderRadius: 12 / 2, marginTop: 3, }}></View>
              <Text style={{ marginLeft: 5, marginRight: 5, fontFamily: 'airbnbCereal-light', color: 'green' }}>Online</Text>
              <Text style={{ marginLeft: 5, marginRight: 5, fontFamily: 'airbnbCereal-light', color: '#333' }}>Yolcu</Text>
            </View>

          </View>
          <TouchableOpacity onPress={() => { this.props.navigation.navigate('BalanceScreen') }} style={{ flexDirection: 'row', backgroundColor: '#fed32c', height: 50, minWidth: 90, alignItems: 'center', justifyContent: 'center', borderRadius: 6, paddingHorizontal: 5 }}><Text style={{ fontSize: 23, fontFamily: 'airbnbCereal-medium', marginRight: 3 }}>{this.state.userDetails.balance}</Text><Image style={{ height: 20, width: 15 }} source={require('../assets/images/tlicon.png')} /></TouchableOpacity>

          {5 == 1 && <TouchableOpacity style={{ justifyContent: 'center' }}>
            <View style={{ alignSelf: 'center', marginRight: 20, }}><Ionicons name="ios-mail" size={42} color="#333" /></View>
            <Badge
              status="error"
              value="12"
              containerStyle={{ position: 'absolute', top: 13, left: 23 }}
              textStyle={{ fontSize: 11 }}
            />
          </TouchableOpacity>
          }
        </View>


        <ScrollView 
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.onRefresh()} />
          }
        >





          {/* <View><Text style={styles.headerText}>Genel Bilgiler</Text></View> */}


          <View style={styles.haritaContainer}>

            <View style={{ position: 'absolute', top: 10, marginLeft: 10, }}>
              <View style={{ width: 95 + '%', alignSelf: 'center', flexDirection: 'row', marginTop: 8, }}>
                <TouchableOpacity onPress={()=>{this.props.navigation.navigate('LinksStack')}} style={{ width: 50, zIndex: 99999, paddingVertical: 5, backgroundColor: '#161a1e', borderRadius: 4, width: 45 + '%', marginLeft: 2.5 + '%', marginRight: 2.5 + '%', marginVertical: 5, }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Ionicons name="ios-car" size={35} color="#CCC" style={{ marginRight: 10 }} /><Text style={{ fontSize: 25, fontFamily: 'airbnbCereal-medium',color:'#CCC' }}>{this.state.onlineDrivers.length - 1}</Text>
                  </View>
                  <Text style={{ marginLeft: 5, marginRight: 5, fontFamily: 'airbnbCereal-medium', color: 'green', alignSelf: 'center'}}>Online</Text>
                </TouchableOpacity>


                <TouchableOpacity onPress={()=>{this.props.navigation.navigate('LinksStack')}} style={{ width: 50, zIndex: 99999, paddingVertical: 5, backgroundColor: '#161a1e', borderRadius: 4, width: 45 + '%', marginLeft: 2.5 + '%', marginRight: 2.5 + '%', marginVertical: 5, }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Ionicons name="ios-people" size={35} color="#CCC" style={{ marginRight: 10 }} /><Text style={{ fontSize: 25, fontFamily: 'airbnbCereal-medium',color:'#CCC'  }}>{this.state.onlineUsers.length - 1}</Text>
                  </View>
                  <Text style={{ marginLeft: 5, marginRight: 5, fontFamily: 'airbnbCereal-medium', color: 'green', alignSelf: 'center' }}>Online </Text>

                </TouchableOpacity>
              </View>

            </View>



            <View style={styles.MapTextContainer}>

              {this.state.geoCoding == '' && <ActivityIndicator size={20} style={{ alignSelf: 'center', position: 'absolute', top: 40 + '%' }} />}
              <Text style={{ color: '#CCC', padding: 7 }}>{this.state.geoCoding.display_name}</Text></View>

            <MapView customMapStyle={this.mapStyle} region={{ latitude: this.state.latitude, longitude: this.state.longitude, latitudeDelta: 0.0025, longitudeDelta: 0.0025 }} style={styles.mapStyle} followsUserLocation={true} showsUserLocation={true} zoomControlEnabled={false} showsTraffic={false}>
            </MapView>
          </View>

          <View><Text style={styles.headerText}>Yolculuk Durumu</Text>
            {/*
              >Tüm Yolcuları Listeleyen Kod
            this.state.onlineUsers.map((l, i) => {
              return <View><Text>{l.userUid}</Text></View>
            })*/}
          </View>

          <View style={{ marginTop: 10, paddingTop: 10, borderWidth: 2, borderStyle: 'dashed', borderColor: 'red', paddingTop: 15, paddingBottom: 15, width: 97 + '%', alignSelf: 'center', borderRadius: 4, }}>
            <EslestirmeComponent ref={(_EslestirmeComponent)=>this._EslestirmeComponent = _EslestirmeComponent} propsNav={this.props.navigation} anasayfa={true}></EslestirmeComponent>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('EslestirmeScreen')} style={{ backgroundColor: '#CCC', marginTop: 5, paddingVertical: 10, }}><Text style={{ textAlign: 'center', fontFamily: 'airbnbCereal-light' }}>Detayları Görüntüle</Text></TouchableOpacity>
          </View>

          <View style={{ marginTop: 10 }}><Text style={styles.headerText}>Ödeme Ayarları</Text></View>
          <View style={{ paddingTop: 10, paddingTop: 15, paddingBottom: 15, width: 97 + '%', alignSelf: 'center', borderRadius: 4, }}>

            <CreditCardComponent anasayfa={true} />
            <TouchableOpacity onPress={() => this.props.navigation.navigate('userCreditCard')} style={{ backgroundColor: '#CCC', paddingVertical: 10, }}><Text style={{ textAlign: 'center', fontFamily: 'airbnbCereal-light' }}>Ödemeleri Düzenle</Text></TouchableOpacity>




          </View>

          <View><Text style={styles.headerText}>Geçmiş Yolculuklarım</Text></View>
          <View style={{ marginTop: 10 }}>
            <View>
              {
                this.state.gecmis_yolculuklar.map((l, i) => (
                  <View style={{ borderTopWidth: 0.4, borderColor: '#2c3237' }}>
                    <TouchableOpacity style={{ flexDirection: 'row', paddingVertical: 4, borderBottomWidth: 0.4, borderColor: '#2c3237', marginLeft: 10, }}>

                      <View style={{ textAlign: 'center', backgroundColor: '#FFC541', borderRadius: 20, padding: 5, paddingLeft: 10, paddingRight: 10, flexDirection: 'row', }}><Ionicons name="ios-calendar" size={17} color="#FFF" style={{ marginRight: 5 }} /><Text style={styles.gecmisCont_infText}>{l.date}</Text></View>
                      <View style={{ textAlign: 'center', backgroundColor: '#37b337', borderRadius: 20, padding: 5, paddingLeft: 10, paddingRight: 10, flexDirection: 'row', marginLeft: 6, }}><Ionicons name="ios-card" size={17} color="#FFF" style={{ marginRight: 5 }} /><Text style={styles.gecmisCont_infText}>{l.price} TL</Text></View>
                      <View style={{ textAlign: 'center', backgroundColor: '#DD4B4E', borderRadius: 20, padding: 5, paddingLeft: 10, paddingRight: 10, flexDirection: 'row', marginLeft: 6, minWidth: 25 + '%' }}><Ionicons name="ios-car" size={17} color="#FFF" style={{ marginRight: 5 }} /><Text style={styles.gecmisCont_infText}>{l.driver_name}</Text></View>
                    </TouchableOpacity>
                  </View>
                ))
              }
              <TouchableOpacity style={{ backgroundColor: '#CCC', paddingVertical: 10, }}><Text style={{ textAlign: 'center', fontFamily: 'airbnbCereal-light' }}>Hepsini Görüntüle</Text></TouchableOpacity>
            </View>
          </View>

        </ScrollView>


      </View >
    );
  }


};
const styles = StyleSheet.create({
  gecmisCont_infText:
  {
    color: '#FFF', fontSize: 13,
    fontFamily: 'airbnbCereal-medium',
  },
  haritaContainer:
  {
    marginTop:-7,
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  MapTextContainer: {
    borderRadius:5,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        // borderBottomWidth: 0.8,
        //borderColor:'#EBEBEB',
      },
      android: {
        elevation: 2,
      },
    }),
    backgroundColor: '#161a1e', justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 5, width: 83 + '%', alignSelf: 'center', position: 'absolute', top: 100, alignSelf: 'center', zIndex: 999,
  },
  ProfileHeader: {
    alignItems: 'center',
    flexDirection: 'row', paddingTop: 10, paddingLeft: 13, paddingBottom: 10, backgroundColor: '#2b3138',
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        // borderBottomWidth: 0.8,
        //borderColor:'#EBEBEB',
      },
      android: {
        elevation: 1,
      },
    }),
  },
  headerText: {
    fontSize: 20,
    fontFamily: 'airbnbCereal-medium',
    marginTop: 7,
    marginLeft: 17,
    marginBottom: 0,
    color: '#fed32c'
  },
  mapStyle: {
    width: 100 + '%',
    height: 170,
    marginTop: 7,
  },
  container: {
    flex: 1,
    backgroundColor: '#202329',
  },

  tabBarInfoContainer: {

    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
    marginTop: 4,

  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },

});
