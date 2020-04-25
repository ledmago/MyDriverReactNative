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
  AsyncStorage,
  Vibration,


} from 'react-native';
import { Audio } from 'expo-av';
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
import AnimatedProgressWheel from 'react-native-progress-wheel';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { Notifications } from 'expo';

try {
  TaskManager.defineTask('konumAl', async ({ data: { locations }, error }) => {
    try {
      // İNTERVALI GÜNCELLEME
      var userUid = await AsyncStorage.getItem('userToken');
      firebase.database().ref('drivers').child(userUid).update({
        timestamp: Math.floor(Date.now() / 1000),
        userUid: userUid,
        status: 'online',
        lat: locations.coords.latitude,
        long: locations.coords.longitude,
      })
    } catch (error) {
      return BackgroundFetch.Result.Failed;
    }
  });

  var globalsayiforEslesme = 0;
  var _globalEslesmeDate = 0;
  TaskManager.defineTask('ESLESME_YAKALAYICI', async () => {
    const usertype = await AsyncStorage.getItem('usertype');
    if (usertype == 'driver') {
      // ASYCN STORAGE KOYUP  saniye içinde değilse notification gösterme  30 saniyeden fazla yap ayarları kapa
      try {
        globalsayiforEslesme++;
        var userUid = await AsyncStorage.getItem('userToken');
        if (globalsayiforEslesme < 2) {
          firebase.database().ref('driverIstek').child(userUid).on('value', (e) => {

            if (e.exists && e.val().yolcuID.length > 2) {
              _globalEslesmeDate = Date.now() / 1000;
              Notifications.presentLocalNotificationAsync({ title: 'Yeni Eşleşmeniz Var', body: 'Bir yolcu size istek gönderdi, kabul etmeniz için 20 saniye var !!' });
              Vibration.vibrate(800);
            }
            else {
              // Notifications.presentLocalNotificationAsync({title:'HATA',body:'HATA'});
            }

          });
        }

      } catch (error) {
        return BackgroundFetch.Result.Failed;
      }

    }
  });






  var globalsayiforMessage = 0;
  TaskManager.defineTask('MESAJ_YAKALAYICI', async () => {

    const usertype = await AsyncStorage.getItem('usertype');
    if (usertype == 'driver') {
      try {

        var userUid = await AsyncStorage.getItem('userToken');

        firebase.database().ref('tripDatabase').orderByChild('who').equalTo(userUid).once('value', async (e) => {
          Notifications.presentLocalNotificationAsync({ title: 'Yeni Mesajınız Var', body: JSON.stringify(e) });
          if (e.exists && e.val() != null) {
            var snapshot = Object.keys(e.val()).map(i => e.val()[i])
            globalsayiforMessage++;
            var tripID = snapshot[0].tripID;

            firebase.database().ref('chat').child(tripID).on('child_added', (e) => {

              var snapshot = Object.keys(e.val()).map(i => e.val()[i])
              Notifications.presentLocalNotificationAsync({ title: 'Yeni Mesajınız Var', body: snapshot[0].text });
              Vibration.vibrate(800);


            })

          }

        });





      } catch (error) {
        return BackgroundFetch.Result.Failed;
      }

    }
  });










  TaskManager.defineTask('ESLESME_TASK', async () => {

    const usertype = await AsyncStorage.getItem('usertype');
    if (usertype == 'driver') {
      try {
        // İNTERVALI GÜNCELLEME
        var userUid = await AsyncStorage.getItem('userToken');
        firebase.database().ref('drivers').child(userUid).update({
          timestamp: Math.floor(Date.now() / 1000),
          userUid: userUid,
          status: 'online',
        })
      } catch (error) {
        return BackgroundFetch.Result.Failed;
      }
    }
  });

}
catch (e) {
  console.log('hata olustu')
}




export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {

    refreshing: false,
    tripInformation: {
      name: '',
      aracMarka: '',
      aracModel: '',
      aracPlaka: '',
    },
    userDetails: {
      email: '',
      name: '',
      gender: '',
      balance: '',
      lat: '',
      long: '',
    },
    yolcuID: '',
    location: null,
    errorMessage: null,
    latitude: 0,
    longitude: 0,
    geoCoding: '',
    eslesmeSecond: 20,
    Modal1Open: false,
    Modal1OpenLoadingButton: false,

    onlineUsers: [{ userUid: 'test' },],
    onlineDrivers: [{ userUid: 'test' },],
  };








  onRefresh = () => {
    this.setState({ refreshing: true })

    this.drivercomponent.mevcutDurumSorgula(); // Tripsfordriver component'ini componentDidmount'unu çağırarak refresh ediyorum // oda alt fonksyonları çağırıyor.
    this.setState({ refreshing: false })
  }
  static navigationOptions = ({ navigation }) => {
    return {
      header: () => null
    }
  }


  CheckLocation = async (buttondanGeldi = false) => {

    if (buttondanGeldi) { this.setState({ Modal1OpenLoadingButton: true }) }
    let { status } = await Permissions.askAsync(Permissions.LOCATION);

    await Location.startLocationUpdatesAsync('firstTask', {
      accuracy: Location.Accuracy.Highest,
    });


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


    this.CheckLocation();

    await AsyncStorage.setItem('TASKS', 'test')



    await this.soundObject.loadAsync(require('../../assets/eslesmeSesi.mp3'));
    await this.soundObject.setStatusAsync({ volume: 1.0 });
    await this.soundObject.setVolumeAsync(1.0);
    await this.soundObject.setIsLoopingAsync(true);
    DriverSide_HomeController.Initial(this.props);
    // User Details'i Çek ve UserDetails'i State Durumuna Aktar. 
    DriverSide_HomeController.getUserDetails().then((userdata) => { this.setState({ userDetails: userdata }); })

    this.eslesmeDinle();

    alert(TaskManager.isTaskDefined('MESAJ_YAKALAYICI'))


  }
  async componentWillMount() {

    this.CheckLocation();
  }

  eslesmeDinle = async () => {

    var userUid = await AsyncStorage.getItem('userToken');

    firebase.database().ref('driverIstek').child(userUid).on('value', (e) => {

      if (e.exists && e.val() != null) {
        // En az bir eşleşme olması lazım
        var yolcuID = '';
        try {
          yolcuID = e.val().yolcuID;
        }
        catch (e) {
          yolcuID = '';
        }

        this.setState({ yolcuID: yolcuID })
        if (yolcuID != '') {


          firebase.database().ref('tripDatabase').child(yolcuID).once('value', (e) => {
            this.setState({ tripInformation: e.val() })
            // Burda Göster Eşleşmeyi
            this.EslesmeSaglandi();


          });
        }
      } else { this.setState({ yolcuID: '' }) }
    });
  }

  soundObject = new Audio.Sound();
  intervalsxD = null;
  EslesmeTimer = null;
  EslesmeSaglandi = async () => {
    //   alert(_globalEslesmeDate)


    //   var now = Math.floor(Date.now() / 1000);
    //   var minusSecond = _globalEslesmeDate != 0 ? now - Math.floor(_globalEslesmeDate) : 0;


    //   this.setState({ eslesmeSecond: 20 - minusSecond })

    this.EslesmeTimer = setInterval(() => {


      var leftSecond = this.state.eslesmeSecond > 0 ? this.state.eslesmeSecond - 1 : 0;

      this.setState({ eslesmeSecond: leftSecond })

      if (this.state.eslesmeSecond < 1) {
        // Süre Bittiğinde

        this.durdurHersey();
        clearInterval(this.EslesmeTimer);

      }

    }, 1000);

    // this.setState({ eslesmeSecond: 20 })
    this.intervalsxD = setInterval(() => { if (this.state.yolcuID == '') { this.durdurHersey(); Vibration.vibrate(1000) } }, 2000);


    try {


      await this.soundObject.playAsync();


      // Your sound is playing!
    } catch (error) {
      // An error occurred!
      alert(error)
    }
  }

  refreshPage = () => {
    this.onRefresh();
  }

  durdurHersey = async () => {
    _globalEslesmeDate = 0;
    this.setState({ eslesmeSecond: 20 })

    clearInterval(this.intervalsxD);
    clearInterval(this.EslesmeTimer);
    this.soundObject.stopAsync();
    this.setState({ yolcuID: '' })
    var userUid = await AsyncStorage.getItem('userToken');
    var ref = firebase.database().ref("driverIstek/" + userUid)
      .update({
        yolcuID: '',
      })
    this.refreshPage();
  }


  eslesmeKabul = async () => {

    var userUid = await AsyncStorage.getItem('userToken');

    // Eğer Kabul Ederse

    //Önce Başka biri daha önceden kabul edip etmedğine baksın

    // ve sürüşte olanları eklemesin

    firebase.database().ref("tripDatabase/" + this.state.yolcuID).once('value', (ex) => {
      if (ex.val().durum == 0) {

        var ref = firebase.database().ref("tripDatabase/" + this.state.yolcuID)
          .update({
            durum: 1,
            baslayanTimeStamp: Math.floor(Date.now() / 1000),
            who: userUid,
          });

        var ref = firebase.database().ref("drivers/" + userUid).update({ yolcuVarMi: true });


        this.onRefresh();

      }

    })
    this.durdurHersey();
  }
  eslesmeRed = async () => {
    this.durdurHersey()
    var userUid = await AsyncStorage.getItem('userToken');

    // Eğer Kabul Etmezse
    var ref = firebase.database().ref("driverIstek/" + userUid)
      .update({
        yolcuID: '',
      })

    var ref = firebase.database().ref("drivers/" + userUid)
      .update({
        yolcuVarMi: true,
      })

  }
  render() {

    return (
      <View style={styles.container}>

        <Modal animationType="slide"
          transparent={true}
          visible={this.state.yolcuID != ''}

          onRequestClose={() => {


          }}>

          <View style={{ backgroundColor: '#000000b0', justifyContent: 'center', position: 'absolute', left: 0, top: 0, width: 100 + '%', height: 100 + '%', zIndex: 2 }}>

            <View style={{ borderRadius: 3, padding: 20, backgroundColor: '#222', borderColor: '#000', borderWidth: 1, width: 90 + '%', height: 'auto', paddingVertical: 30, alignSelf: 'center', borderRadius: 5 }}>
              <Text style={{ color: '#fe4858', fontSize: 26, fontFamily: 'airbnbCereal-medium', textAlign: 'center', marginTop: 5, marginBottom: 15, }}>Eşleşme Sağlandı</Text>




              <View style={{ alignSelf: 'center', justifyContent: 'center' }}>
                <AnimatedProgressWheel
                  progress={100}
                  animateFromValue={0}
                  duration={20000}
                  color={'orange'}
                  fullColor={'red'}

                />
                <View style={{ position: 'absolute', top: 22, marginLeft: 25, }}>
                  <Avatar
                    source={{
                      uri:
                        'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
                    }}
                    rounded={true}
                    size={150}
                    containerStyle={{ borderWidth: 1, borderColor: '#000', marginTop: 3, alignSelf: 'center', justifyContent: 'center' }}
                  />
                </View>
                <View style={{ position: 'absolute', alignSelf: 'center', padding: 15, backgroundColor: '#000000ab', width: 150, height: 150, borderRadius: 150 / 2, }}></View>

                <View style={{ position: 'absolute', alignSelf: 'center', padding: 15, }}><Text style={{ color: '#FFF', fontSize: 35, fontFamily: 'airbnbCereal-medium' }}>{this.state.eslesmeSecond}</Text></View>
              </View>






              <View style={{ flexDirection: 'row', width: 85 + '%', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', marginTop: 15 }}>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#388E3C', padding: 15, paddingVertical: 10, borderRadius: 5, flexDirection: 'row' }}
                  onPress={() => {

                    this.eslesmeKabul();
                  }} containerStyle={{ marginBottom: 10, }}

                >
                  <Ionicons name="ios-checkmark-circle" size={42} color="#FFF" />
                  <Text style={{ color: '#EBEBEB', fontFamily: 'airbnbCereal-medium', fontSize: 20, marginLeft: 10, }}>KABUL</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ marginLeft: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#d32f2f', padding: 15, paddingVertical: 10, borderRadius: 5, flexDirection: 'row' }} onPress={() => {
                  this.setState({ durdur: true })
                  clearInterval(this.intervalsxD);
                  clearInterval(this.EslesmeTimer)
                  this.eslesmeRed();
                }} containerStyle={{ marginBottom: 10, }}>
                  <Ionicons name="ios-close-circle" size={42} color="#FFF" />
                  <Text style={{ color: '#EBEBEB', fontFamily: 'airbnbCereal-medium', fontSize: 20, marginLeft: 10, }}>İPTAL</Text>
                </TouchableOpacity>

              </View>


              <View style={{ backgroundColor: '#FFF', marginTop: 15, borderRadius: 5 }}>
                <View style={{ alignSelf: 'center', marginTop: 20, }}>
                  <Text style={{ fontFamily: 'airbnbCereal-medium', color: '#333', fontSize: 21, }}>{this.state.tripInformation.name}</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ marginLeft: 5, marginRight: 5, fontFamily: 'airbnbCereal-light', color: '#444' }}>Sürücü o o o o o o</Text>
                  </View>
                </View>

                <Text style={{ fontFamily: 'airbnbCereal-medium', color: '#333', fontSize: 18, alignSelf: 'center', marginTop: 10 }}>Araç Bilgileri</Text>
                <View style={{ flexDirection: 'row', marginTop: 15, marginBottom: 15, alignSelf: 'center' }}>
                  <Text style={{ fontFamily: 'airbnbCereal-medium', color: '#EBEBEB', fontSize: 16, backgroundColor: '#2b3138', padding: 10, borderRadius: 4, marginRight: 10 }}>{this.state.tripInformation.aracPlaka}</Text>
                  <Text style={{ fontFamily: 'airbnbCereal-medium', color: '#EBEBEB', fontSize: 16, backgroundColor: '#2b3138', padding: 10, borderRadius: 4, marginRight: 10 }}>{this.state.tripInformation.aracMarka}</Text>
                  <Text style={{ fontFamily: 'airbnbCereal-medium', color: '#EBEBEB', fontSize: 16, backgroundColor: '#2b3138', padding: 10, borderRadius: 4, marginRight: 10 }}>{this.state.tripInformation.aracModel}</Text>
                </View>

              </View>



            </View>
          </View>


        </Modal>


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
          <TouchableOpacity onPress={() => { this.props.navigation.navigate('BalanceScreen') }} style={{ borderRadius: 5, borderWidth: 1, borderColor: '#EBEBEB', flexDirection: 'row', height: 40, minWidth: 90, alignItems: 'center', justifyContent: 'center', borderRadius: 6, paddingHorizontal: 5 }}><Text style={{ fontSize: 20, fontFamily: 'airbnbCereal-medium', marginRight: 3, color: '#EBEBEB' }}>{this.state.userDetails.balance}</Text><Image style={{ height: 20, width: 15 }} source={require('../../assets/images/tlicon.png')} /></TouchableOpacity>










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



            {this.state.latitude > 0 && <TripsForDrivers ref={(drivercomponent) => { this.drivercomponent = drivercomponent; }} propsNav={this.props.navigation} latitude={this.state.latitude} longitude={this.state.longitude} />}



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

var registerTaskAsync = async () => {
  try {
    await BackgroundFetch.registerTaskAsync('ESLESME_YAKALAYICI', { minimumInterval: 3000000, stopOnTerminate: false, startOnBoot: false });
    await BackgroundFetch.registerTaskAsync('MESAJ_YAKALAYICI', { minimumInterval: 3000000, stopOnTerminate: false, startOnBoot: false });
    await BackgroundFetch.registerTaskAsync('ESLESME_TASK', { minimumInterval: 1, stopOnTerminate: false, startOnBoot: true });
    Location.startLocationUpdatesAsync('konumAl', { accuracy: Location.Accuracy.Highest, timeInterval: 5000, showsBackgroundLocationIndicator: true, activityType: Location.ActivityType.AutomotiveNavigation })



  }
  catch (e) {

  }
};
registerTaskAsync();