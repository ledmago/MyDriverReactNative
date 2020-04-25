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
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { MonoText } from '../../components/StyledText';
import MapView from 'react-native-maps';
import { Divider, SearchBar, Avatar, ListItem, Button, Badge } from 'react-native-elements';
import * as Font from 'expo-font';
import * as DriverSide_HomeController from '../../Controller/DriverSide_HomeController';
import CreditCardComponent from '../../components/CreditCardList';
import EslestirmeComponent from '../../components/Eslestirme';
import YakindakiYolcular from '../../components/YakindakiYolcular';
import TripsForDrivers from '../../components/TripsForDrivers';
import * as OnlineController from '../../Controller/OnlineController';
import firebase from '../../components/Firebase';

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
    latitude: 0,
    longitude: 0,
    geoCoding: '',
    Modal1Open: false,
    Modal1OpenLoadingButton: false,
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
    onlineDrivers: [{ userUid: 'test' },],
  };


  onRefresh = () => {
    this.setState({ refreshing: true })
    this.componentDidMount().then(() => this.setState({ refreshing: false }));
    this.props.navigation.navigate('userCreditCard')
    this.props.navigation.navigate('Main')

  }
  static navigationOptions = ({ navigation }) => {
    return {
      header: () => null
    }
  }


  CheckLocation = async (buttondanGeldi = false) => {

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



        this.setState({ location: coords });
        this.setState({ latitude: coords.latitude, longitude: coords.longitude, Modal1Open: false, Modal1OpenLoadingButton: false });
        this.setState({ geoCoding: await DriverSide_HomeController.GET_ADRESS(coords.latitude, coords.longitude) });
        DriverSide_HomeController.updateUserLocation(coords.latitude, coords.longitude, this.state.geoCoding.display_name);



        OnlineController.updateUserRealTime(true).then((e) => { this.getOnlineUser(); this.getOnlineDrivers() });




        OnlineController.updateUserRealTimeLocation(true, this.state.userDetails.name, coords.latitude, coords.longitude, this.state.geoCoding.display_name).then((e) => { this.getOnlineUser(); this.getOnlineDrivers(); });

      },
      error => this.setState({ Modal1Open: true })
    );

    setInterval(() => {

      OnlineController.updateUserRealTime(true).then((e) => { this.getOnlineUser(); this.getOnlineDrivers() });
    }, 10000)

  };






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

  getOnlineDrivers = () => {
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

    DriverSide_HomeController.Initial(this.props);
    // User Details'i Çek ve UserDetails'i State Durumuna Aktar. 
    DriverSide_HomeController.getUserDetails().then((userdata) => { this.setState({ userDetails: userdata }); })

    this.CheckLocation();





  }
  async componentWillMount() {
    this.CheckLocation();
  }




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



        <View style={{ height: StatusBar.currentHeight, backgroundColor: '#2b3138' }}></View>

        <View style={styles.ProfileHeader}>
          <Avatar
            source={{
              uri:
                'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
            }}
            showEditButton
            rounded={true}
            size={60}
            containerStyle={{ borderWidth: 1, borderColor: '#CCC', marginTop: 3, }}
          />
          <View style={{ marginLeft: 15, width: Dimensions.get('screen').width - 200, }}>
            <Text style={{ fontFamily: 'airbnbCereal-medium', color: '#EBEBEB', fontSize: 21, }}>{this.state.userDetails.name}</Text>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: 12, height: 12, backgroundColor: 'green', borderRadius: 12 / 2, marginTop: 3, }}></View>
              <Text style={{ marginLeft: 5, marginRight: 5, fontFamily: 'airbnbCereal-light', color: 'green' }}>Online</Text>
              <Text style={{ marginLeft: 5, marginRight: 5, fontFamily: 'airbnbCereal-light', color: '#333' }}>Sürücü</Text>
            </View>

          </View>
          <TouchableOpacity onPress={() => { this.props.navigation.navigate('BalanceScreen') }} style={{ flexDirection: 'row', backgroundColor: '#CCC', height: 50, minWidth: 90, alignItems: 'center', justifyContent: 'center', borderRadius: 6, paddingHorizontal: 5 }}><Text style={{ fontSize: 23, fontFamily: 'airbnbCereal-medium', marginRight: 3 }}>{this.state.userDetails.balance}</Text><Image style={{ height: 20, width: 15 }} source={require('../../assets/images/tlicon.png')} /></TouchableOpacity>

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





          <View><Text style={styles.headerText}>Yakınımdakiler</Text></View>


          <View style={styles.haritaContainer}>

            <View style={{ marginLeft: 10, }}>
              <View style={{ width: 95 + '%', alignSelf: 'center', flexDirection: 'row', marginTop: 8, }}>
                <TouchableOpacity style={{ width: 50, zIndex: 99999, paddingVertical: 5, backgroundColor: '#2b3138', borderRadius: 4, width: 45 + '%', marginLeft: 2.5 + '%', marginRight: 2.5 + '%', marginVertical: 5, }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Ionicons name="ios-car" size={35} color="#EBEBEB" style={{ marginRight: 10 }} />
                    <Text style={{ fontSize: 25, fontFamily: 'airbnbCereal-medium', color: '#EBEBEB' }}>{this.state.onlineDrivers.length - 1}</Text>
                  </View>
                  <Text style={{ marginLeft: 5, marginRight: 5, fontFamily: 'airbnbCereal-medium', color: 'green', alignSelf: 'center' }}>Online</Text>
                </TouchableOpacity>


                <TouchableOpacity style={{ width: 50, zIndex: 99999, paddingVertical: 5, backgroundColor: '#2b3138', borderRadius: 4, width: 45 + '%', marginLeft: 2.5 + '%', marginRight: 2.5 + '%', marginVertical: 5, }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Ionicons name="ios-people" size={35} color="#EBEBEB" style={{ marginRight: 10 }} />
                    <Text style={{ fontSize: 25, fontFamily: 'airbnbCereal-medium', color: '#EBEBEB' }}>{this.state.onlineUsers.length - 1}</Text>
                  </View>
                  <Text style={{ marginLeft: 5, marginRight: 5, fontFamily: 'airbnbCereal-medium', color: 'green', alignSelf: 'center' }}>Online</Text>
                </TouchableOpacity>
              </View>
            </View>


            <View><Text style={styles.headerText}>Yolcu İstekleri</Text></View>
            {this.state.latitude > 0 && <TripsForDrivers propsNav={this.props.navigation} latitude={this.state.latitude} longitude={this.state.longitude} />}



            <View><Text style={styles.headerText}>Yakındaki Yolcular</Text></View>
            {this.state.latitude > 0 && <YakindakiYolcular latitude={this.state.latitude} longitude={this.state.longitude} />}

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
    backgroundColor: '#FFF', justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 5, width: 83 + '%', alignSelf: 'center', position: 'absolute', top: 100, alignSelf: 'center', zIndex: 999, borderColor: '#EBEBEB', borderWidth: 0.2,
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
    marginTop: 13,
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



});
