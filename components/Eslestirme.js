import * as WebBrowser from 'expo-web-browser';
import React, { useRef } from "react";
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
  AsyncStorage,
  Vibration,
  Alert,
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
import * as EslestirmeController from '../Controller/EslestirmeController';
import { FlatGrid } from 'react-native-super-grid';
import firebase from '../components/Firebase';
import AnimatedProgressWheel from 'react-native-progress-wheel';
import { Audio } from 'expo-av';
import { Notifications } from 'expo';

export default class EslestirmeComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  _ISTEKTIME = 20;

  state = {

    IsCurrentTrip: false,
    curerntTrip: {},






    aktifMi: null,
    durdur: false,
    eslesmeSecond: 20,
    driverDetails: { aracPlaka: 'Plaka Bulunmadı' },
    surucuDurumText: '',
    okunmayanMesaj: 0,
    istekGonderilenDriverID: '',
    istekGonderilenDriverName: '',
    hepsiMesgul: false,
    istekSaniyesi: this._ISTEKTIME,
  }
  DriverIstekTimer = '';
  DriverControlListener = '';



  // ListenFinishTrip = async() => {
  //   var userUid = await AsyncStorage.getItem('userToken');
  //   firebase.database().ref('tripDatabase').child(userUid).on('child_removed',(e)=>{
  //     alert(JSON.stringify(e))
  //   });

  // }






  getUnreadMessages = async (tripID) => {
    var newOkunmayanMesaj = [];
    var userUid = await AsyncStorage.getItem('userToken');
    var upvotesRef = firebase.database().ref('chat/' + tripID).orderByChild('okunmadi').equalTo(true)
    upvotesRef.once('value', (e) => {
      if (e.exists()) {
        const okunmayanMesaj = Object.keys(e.val()).map(i => e.val()[i]);
        okunmayanMesaj.map((l, i) => { if (l.user._id != userUid) { newOkunmayanMesaj.push(l) } })
        this.setState({ okunmayanMesaj: newOkunmayanMesaj.length })
      }

    });

  }

  soundObject = new Audio.Sound();
  intervalsxD = null;
  EslesmeSaglandi = async () => {
    this.setState({ eslesmeSecond: 20 })
    this.intervalsxD = setInterval(() => { if (this.state.currentTrip.status != 2) { this.durdurHersey() } Vibration.vibrate(1000) }, 2000);


    try {


      await this.soundObject.playAsync();


      // Your sound is playing!
    } catch (error) {
      // An error occurred!
      alert(error)
    }
  }

  DriverGetir = async () => {

    this.setState({ hepsiMesgul: false })
    const YakinDriversIstek = await AsyncStorage.getItem('YakinDrivers');
    if (!YakinDriversIstek) {

      // Yoksa
      // Burada en yakındaki online driver'ı bulup ona istek atacak.
      var DriversArray = [];

      var getOnlineDrivers = firebase.database().ref('drivers').orderByChild('lat').startAt(this.state.currentTrip.userLat - 0.05).once('value', async (e) => {



        if (e.val() != null) {
          Object.keys(e.val()).map(i => {

            if (e.val()[i].yolcuVarMi == false) {
              // Eğer Driver'ın daha önce Yolcusu Yoksa
              DriversArray.push(e.val()[i])
            }

          })


          DriversArray.map((e) => {
            e.latFark = Math.abs(e.lat - this.state.currentTrip.userLat)
            e.longFark = Math.abs(e.long - this.state.currentTrip.userLong)
          });

          DriversArray.sort((a, b) => a.latFark - b.latFark || a.longFark - b.longFark);

          await AsyncStorage.setItem('YakinDrivers', JSON.stringify(DriversArray)); // Kaydet
          await AsyncStorage.setItem('YakinDriversIstekNum', 0 + '')

          this.istekYap(DriversArray);

          // Online Driverları getirdik

        }
        else {
          this.istekBitti();
          // Hiç Müsait Yolcu Yoksa
        }

      });
    }
    else {
      // Varsa

      this.istekYap();




    }



  };

  istekBitir = async () => {
    this.setState({ hepsiMesgul: true });
    clearInterval(this.DriverIstekTimerForShown);
    this.setState({ istekSaniyesi: this._ISTEKTIME });
    var userUid = await AsyncStorage.getItem('userToken');
    await AsyncStorage.removeItem('YakinDrivers'); // Kaydet
    await AsyncStorage.removeItem('YakinDriversIstekNum')

    // Driver Kabul Ettiyse
    clearInterval(this.DriverIstekTimer);
    firebase.database().ref('tripDatabase/' + userUid).off('value', this.DriverControlListener);

  }


  istekBitti = () => {

    this.istekBitir();
    // alert('Tüm Sürücüler Meşgul')


  }



  istekYap = async (DriversArray = '') => {
    var oncekiDriverNum = null;
    clearInterval(this.DriverIstekTimer);
    var LastDriver;
    var YakinDriversArray;
    if (DriversArray == '') {

      var LastDriver = parseInt(await AsyncStorage.getItem('YakinDriversIstekNum'));
      oncekiDriverNum = parseInt(LastDriver);

      var YakinDriversArray = JSON.parse(await AsyncStorage.getItem('YakinDrivers'));

      /*
           await AsyncStorage.removeItem('YakinDriversIstekNum');
          await AsyncStorage.removeItem('YakinDrivers')*/
    }
    else {
      // Yeni Baştansa

      LastDriver = 0;
      oncekiDriverNum = LastDriver;
      YakinDriversArray = DriversArray;
    }




    // İstek Göndermeye Başla
    var istekGonderGercek = async () => {
      clearInterval(this.DriverIstekTimerForShown);
      this.setState({ istekSaniyesi: this._ISTEKTIME });

      if (LastDriver > YakinDriversArray.length - 1) {
        this.istekBitti()
        this.IstekSilFromDatabase(YakinDriversArray[oncekiDriverNum].userUid);

        /* Eğer tümü Cevap Vermediyse*/
      }
      else {


        this.setState({ istekGonderilenDriverID: YakinDriversArray[LastDriver].userUid, istekGonderilenDriverName: YakinDriversArray[LastDriver].name, }) // İstek Gönderilen Kişiyi Göstermek için state yazdır
        // alert('gonderilen' + DriversArray[LastDriver].userUid)

        // Önceki Driver'ın İsteğini Sil

        if (parseInt(LastDriver) != parseInt(oncekiDriverNum)) {
          this.IstekSilFromDatabase(YakinDriversArray[oncekiDriverNum].userUid);
          oncekiDriverNum = LastDriver;
        }

        firebase.database().ref('driverIstek/').child(YakinDriversArray[LastDriver].userUid).once('value', (e) => {

          if (e.val() == null) {


          }
        }).catch(() => { alert('hata') }
        )

        var driverSet = firebase.database().ref('driverIstek').child(YakinDriversArray[LastDriver].userUid).update({
          yolcuID: this.state.currentTrip.from
        });


        // LastDriver = YakinDriversArray.length - 1 == LastDriver ? LastDriver : parseInt(LastDriver) + 1; // Eğer sonuncu Driverise 0'a Dön Değile Devam Et  
        LastDriver = parseInt(LastDriver) + 1; // Eğer sonuncu Driverise 0'a Dön Değile Devam Et  

      }
      this.GeriyeSarIstekTimer();
    }


    istekGonderGercek();
    this.DriverIstekTimer = setInterval(() => {

      istekGonderGercek();

    }, this._ISTEKTIME * 1000)

    // BURDA 20 SANİYE BEKLİCEK

    var userUid = await AsyncStorage.getItem('userToken');
    this.DriverControlListener = firebase.database().ref('tripDatabase/' + userUid).orderByChild('who').on('value', async (e) => {

      if (e.val().who != '') {
        await AsyncStorage.removeItem('YakinDrivers'); // Kaydet
        await AsyncStorage.removeItem('YakinDriversIstekNum');
        Vibration.vibrate(2500);
        Notifications.presentLocalNotificationAsync({ title: 'Eşleşme Sağlandı', body: 'Eşleşme Sağlandı Sürücü Yolda Geliyor..', android: { color: 'red' } })

        Alert.alert('Eşleşme', 'Sürücüyle Eşleşme Sağlandı');


        this.istekBitir();
        this.componentDidMount();

      }
    })

  };


  IstekSilFromDatabase = async (paramuserUid) => {
    firebase.database().ref('driverIstek').child(paramuserUid).once('value', async (e) => {

      var gelenYolcuID = e.val().yolcuID;
      var userUid = await AsyncStorage.getItem('userToken');

      if (gelenYolcuID == userUid) {
        firebase.database().ref('driverIstek').child(paramuserUid).remove();
      }

    });

  }


  DriverIstekTimerForShown = null;
  GeriyeSarIstekTimer = () => {

    this.DriverIstekTimerForShown = setInterval(() => {


      this.setState({ istekSaniyesi: this.state.istekSaniyesi - 1 })


    }, 1000)
  }

  async componentDidMount() {

    //  this.ListenFinishTrip();

    // try {
    //   await this.soundObject.loadAsync(require('../assets/eslesmeSesi.mp3'));
    //   await this.soundObject.setStatusAsync({ volume: 1.0 });
    //   await this.soundObject.setVolumeAsync(1.0);
    //   await this.soundObject.setIsLoopingAsync(true);
    // }
    // catch (e) {

    // }


    const currentTrip = await EslestirmeController.getCurrentTrip();
    if (!currentTrip) {
      this.setState({ IsCurrentTrip: false });
    }
    else {
      this.setState({ IsCurrentTrip: true, currentTrip: currentTrip });
    }
    this.setState({ aktifMi: false });



    // EslestirmeController.Initial().then(async (e) => {
    //   var userUid = await AsyncStorage.getItem('userToken');


    //   var ref = firebase.database().ref("tripDatabase/" + userUid).on('value', async (snapshot) => {
    //     try {

    //       let location = await Location.getCurrentPositionAsync({}).catch(() => { alert('Bir hata meydana geldi lütfen tekrar deneyin !') });
    //       var param1 = location.coords.latitude + ', ' + location.coords.longitude;
    //       var param2 = snapshot.val().kalkisCordinate.lat + ', ' + snapshot.val().kalkisCordinate.long;
    //       var Ortdakika = '25 Dakika';
    //       this.setState({ surucuDurumText: 'Sürücü Yolda (' + Ortdakika + ')' });
    //       EslestirmeController.calculateDriverDuration(param1, param2).then((e) => { Ortdakika = e; this.setState({ surucuDurumText: 'Sürücü Yolda (' + Ortdakika + ')' }); })



    //       this.setState({ currentTrip: snapshot.val(), aktifMi: snapshot.val().suan })
    //       if (this.state.currentTrip.status == 2) {
    //         // Get Driver Details
    //         EslestirmeController.getDriverDetails(this.state.currentTrip.who).then((e) => this.setState({ driverDetails: e }));
    //         var EslesmeTimer = setInterval(() => {


    //           var leftSecond = this.state.eslesmeSecond > 0 ? this.state.eslesmeSecond - 1 : 0;

    //           this.setState({ eslesmeSecond: leftSecond })


    //           if (this.state.eslesmeSecond < 1) {
    //             // Süre Bittiğinde

    //             this.durdurHersey(this.state.currentTrip.status);
    //             clearInterval(EslesmeTimer);
    //           }

    //         }, 1000);

    //         this.EslesmeSaglandi()
    //       }
    //       else if (this.state.currentTrip.status == 1) {

    //         this.getUnreadMessages(this.state.currentTrip.tripID)
    //         // Get Driver Details
    //         EslestirmeController.getDriverDetails(this.state.currentTrip.who).then((e) => this.setState({ driverDetails: e }));
    //       }
    //       else if (this.state.currentTrip.status == 4) {

    //         alert('Eşleştirmedeki Şöför, Eşleştirmeyi İptal Etti')
    //         firebase.database().ref('tripDatabase/' + userUid).update({ durum: 0 })

    //       }



    //       if (this.state.currentTrip.status == 0) { this.DriverGetir(); }
    //       else if (this.state.currentTrip.status == 1) { clearInterval(this.DriverIstekTimer); }

    //     }
    //     catch (e) {
    //       //Şöför  Bitirince Silince Buraya gelcek
    //       this.props.propsNav.navigate('userCreditCard')
    //       this.props.propsNav.navigate('Main')
    //     }



    //   });
    // }).catch((e) => this.setState({ aktifMi: false }));







  }


  durdurHersey = async (durumValue = 5) => {
    this.setState({ durdur: true })
    clearInterval(this.intervalsxD);
    this.soundObject.stopAsync();



    // Güncelle
    if (durumValue != 5) { // Eğer Default currentTripi Yoksa
      var oldStatecurrentTrip = this.state.currentTrip;
      oldStatecurrentTrip.status = durumValue;
      this.setState({ currentTrip: oldStatecurrentTrip });
      var userUid = await AsyncStorage.getItem('userToken');
      var ref = firebase.database().ref("tripDatabase/" + userUid)
        .update({
          durum: durumValue,
          baslayanTimeStamp: Math.floor(Date.now() / 1000),
        })

      if (durumValue == 0) {
        var ref = firebase.database().ref("tripDatabase/" + userUid)
          .update({
            who: '',
          })
      }
    }
  }
  eslesmeKabul = () => {
    this.durdurHersey(1)
  }
  eslesmeRed = () => {
    this.durdurHersey(0)
  }

  istekPause = () => {
    clearInterval(this.DriverIstekTimerForShown);
    this.setState({ istekSaniyesi: this._ISTEKTIME });
    this.istekBitir();
    this.IstekSilFromDatabase(this.state.istekGonderilenDriverID)
  }
  render() {

    // if (this.state.aktifMi == false) {
    // Hiç Aktif Yolculuk Eşleştirmesi Yok
    if (this.state.IsCurrentTrip == false) {
      return (

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 95 + '%', marginBottom: 10, marginRight: 1 + '%', padding: 8, backgroundColor: '#FFF', backgroundColor: '#2b3138', borderRadius: 4, borderColor: '#000', borderWidth: 1, }}>
            <Text style={{ color: '#FFF', fontFamily: 'airbnbCereal-medium', fontSize: 17, textAlign: 'center', marginBottom: 7 }}>Aktif bir yolculuğunuz bulunmadı.</Text>
            <Text style={{ fontFamily: 'airbnbCereal-light', color: '#EBEBEB', textAlign: 'center', marginTop: 10, marginBottom: 5 }}>Bir yolculuk isteğiniz yok, ama hemen başlatabilirsiniz</Text>
            <Button title='Yeni Yolculuk' onPress={() => this.props.propsNav.navigate('StartTrip')} containerStyle={{ marginTop: 10 }} icon={<Ionicons name="ios-add-circle" style={{ marginRight: 10 }} size={20} color="#EBEBEB" />} />
          </View>
        </View>

      )
    }
    else if (this.state.IsCurrentTrip == null) {

      return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 95 + '%', marginBottom: 10, marginRight: 1 + '%', padding: 8, backgroundColor: '#FFF', backgroundColor: '#2b3138', borderRadius: 4, borderColor: '#000', borderWidth: 1, }}>
            <ActivityIndicator color='#EBEBEB'></ActivityIndicator>
          </View>
        </View>

      );

    }
    else {
      return (

        <View>
          <Modal animationType="slide"
            transparent={true}
            visible={this.state.currentTrip.status == 2}

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
                    this.eslesmeRed();
                  }} containerStyle={{ marginBottom: 10, }}>
                    <Ionicons name="ios-close-circle" size={42} color="#FFF" />
                    <Text style={{ color: '#EBEBEB', fontFamily: 'airbnbCereal-medium', fontSize: 20, marginLeft: 10, }}>İPTAL</Text>
                  </TouchableOpacity>

                </View>


                <View style={{ backgroundColor: '#FFF', marginTop: 15, borderRadius: 5 }}>
                  <View style={{ alignSelf: 'center', marginTop: 20, }}>
                    <Text style={{ fontFamily: 'airbnbCereal-medium', color: '#333', fontSize: 21, }}>{this.state.driverDetails.name}</Text>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={{ marginLeft: 5, marginRight: 5, fontFamily: 'airbnbCereal-light', color: '#444' }}>Sürücü o o o o o o</Text>
                    </View>
                  </View>

                  <Text style={{ fontFamily: 'airbnbCereal-medium', color: '#333', fontSize: 18, alignSelf: 'center', marginTop: 10 }}>Araç Bilgileri</Text>
                  <View style={{ flexDirection: 'row', marginTop: 15, marginBottom: 15, alignSelf: 'center' }}>
                    <Text style={{ fontFamily: 'airbnbCereal-medium', color: '#EBEBEB', fontSize: 16, backgroundColor: '#2b3138', padding: 10, borderRadius: 4, marginRight: 10 }}>{this.state.driverDetails.aracPlaka}</Text>
                    <Text style={{ fontFamily: 'airbnbCereal-medium', color: '#EBEBEB', fontSize: 16, backgroundColor: '#2b3138', padding: 10, borderRadius: 4, marginRight: 10 }}>{this.state.driverDetails.aracMarka}</Text>
                    <Text style={{ fontFamily: 'airbnbCereal-medium', color: '#EBEBEB', fontSize: 16, backgroundColor: '#2b3138', padding: 10, borderRadius: 4, marginRight: 10 }}>{this.state.driverDetails.aracModel}</Text>
                  </View>

                </View>



              </View>
            </View>


          </Modal>
          {this.state.currentTrip.status == 0 &&
            // Sürücü Aranırken Loading Kısmı 


            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                {this.state.hepsiMesgul == false &&
                  <View style={{ width: 95 + '%', marginBottom: 0, marginRight: 1 + '%', padding: 8, backgroundColor: '#FFF', backgroundColor: '#DD4B4E', borderRadius: 4, borderColor: 'red', borderWidth: 1, }}>
                    <Text style={{ color: '#FFF', fontFamily: 'airbnbCereal-medium', fontSize: 17, textAlign: 'center', marginBottom: 7 }}>Mevcut Durum</Text>

                    <View>
                      <ActivityIndicator size={50} color='#FFF' /><Text style={{ fontFamily: 'airbnbCereal-light', color: '#EBEBEB', textAlign: 'center', marginTop: 10, marginBottom: 5 }}>Sürücü Eşleşmesi Aranıyor..</Text>
                      <Text style={{ position: 'absolute', alignSelf: 'center', marginTop: 15, fontFamily: 'airbnbCereal-medium', color: '#FFF' }}>{this.state.istekSaniyesi}</Text>
                    </View>

                    <View style={{ alignSelf: 'center', }}>
                      {/* <Text style={{color:'#EBEBEB'}}>İstek Gönderilen</Text> */}
                      <Text style={{ padding: 5, backgroundColor: '#FFF', fontFamily: 'airbnbCereal-medium', color: '#222', textAlign: 'center', borderRadius: 5, paddingHorizontal: 10 }}>Sürücü :  {this.state.istekGonderilenDriverName}</Text></View>

                    <View style={{ alignSelf: 'center', width: 48 + '%', marginRight: 1 + '%' }}><Button title='Aramayı Durdur' buttonStyle={{ backgroundColor: '#DD4B4E', width: 100 + '%', }} titleStyle={{ color: '#EBEBEB' }} onPress={() => { this.istekPause(); }} containerStyle={{ marginTop: 10 }} icon={<Ionicons name="ios-pause" style={{ marginRight: 10 }} size={20} color="#EBEBEB" />} /></View>
                  </View>
                }

                {this.state.hepsiMesgul == true && // Eğer herkes meşgulse yani istekBitti fonksyonu
                  <View style={{ width: 95 + '%', marginBottom: 0, marginRight: 1 + '%', padding: 8, backgroundColor: '#FFF', backgroundColor: '#0288D1', borderRadius: 4, borderColor: 'red', borderWidth: 1, }}>
                    <Text style={{ color: '#FFF', fontFamily: 'airbnbCereal-medium', fontSize: 17, textAlign: 'center', marginBottom: 7 }}>Mevcut Durum</Text>
                    <Text style={{ fontFamily: 'airbnbCereal-light', color: '#EBEBEB', textAlign: 'center', marginTop: 10, marginBottom: 5 }}>Tüm Sürücüler Şuan Meşgul, Lütfen Tekrar Deneyin</Text>
                  </View>
                }

              </View>
              <View style={{ width: 96 + '%', marginBottom: 10, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', flexDirection: 'row' }}>
                <View style={{ width: 48 + '%', marginRight: 1 + '%' }}><Button disabled={!this.state.hepsiMesgul} title='İptal Et' buttonStyle={{ backgroundColor: '#FFF', width: 100 + '%', }} titleStyle={{ color: '#2b3138' }} onPress={() => { EslestirmeController.IptalEt(this.state.currentTrip.price).then(() => this.componentDidMount()) }} containerStyle={{ marginTop: 10 }} icon={<Ionicons name="ios-trash" style={{ marginRight: 10 }} size={20} color="#2b3138" />} /></View>
                <View style={{ width: 48 + '%', marginLeft: 1 + '%' }}><Button disabled={!this.state.hepsiMesgul} title='Tekrar Eşleş' buttonStyle={{ backgroundColor: '#FFF', width: 100 + '%', }} titleStyle={{ color: '#2b3138' }} onPress={async () => {

                  this.istekBitir();

                  this.DriverGetir();
                }
                } containerStyle={{ marginTop: 10 }} icon={<Ionicons name="ios-refresh" style={{ marginRight: 10 }} size={20} color="#2b3138" />} /></View>
              </View>
            </View>

          }

          {this.state.currentTrip.status == 1 &&

            // Sürücü Buludu Kısmı 

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ width: 95 + '%', marginBottom: 10, marginRight: 1 + '%', padding: 8, backgroundColor: '#FFF', backgroundColor: '#DD4B4E', borderRadius: 4, borderColor: 'red', borderWidth: 1, }}>
                <Text style={{ color: '#FFF', fontFamily: 'airbnbCereal-medium', fontSize: 17, textAlign: 'center', marginBottom: 7 }}>Sürücüyle Eşleşildi</Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', width: 95 + '%' }}>

                  <Avatar
                    source={{
                      uri:
                        'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
                    }}
                    rounded={true}
                    size={60}
                    containerStyle={{ borderWidth: 1, borderColor: '#CCC', marginTop: 3, }}
                  />
                  <View style={{ marginLeft: 10, width: 100 + '%' }}>
                    <Text style={{ fontFamily: 'airbnbCereal-medium', color: '#EBEBEB', fontSize: 21, }}>{this.state.driverDetails.name}</Text>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={{ marginLeft: 3, marginRight: 5, fontFamily: 'airbnbCereal-light', color: '#EBEBEB' }}>Sürücü ({this.state.driverDetails.aracPlaka})</Text>
                    </View>
                  </View>






                  <TouchableOpacity style={{ justifyContent: 'center', position: 'absolute', right: 40, }}
                    onPress={async () => { this.props.propsNav.navigate('HaritaforTripUser'); }}>
                    <View style={{ alignSelf: 'center', marginRight: 15, }}>
                      <Ionicons name="ios-pin" size={42} color="#EBEBEB" /></View>
                  </TouchableOpacity>




                  <TouchableOpacity style={{ justifyContent: 'center', position: 'absolute', right: 0, }}
                    onPress={async () => {
                      await AsyncStorage.removeItem('ChatID').then(async () => { await AsyncStorage.setItem('ChatID', '' + this.state.currentTrip._id).then(() => { this.props.propsNav.navigate('ChatScreen') }) })
                    }}>
                    <View style={{ alignSelf: 'center', marginRight: 0, }}>
                      <Ionicons name="ios-mail-open" size={35} color="#EBEBEB" /></View>
                    <Badge
                      status="error"
                      value={this.state.okunmayanMesaj}
                      containerStyle={{ position: 'absolute', top: 13, left: 23 }}
                      textStyle={{ fontSize: 11 }}
                    />
                  </TouchableOpacity>




                </View>

              </View>
            </View>
          }


          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 47 + '%', marginRight: 1 + '%', padding: 8, backgroundColor: '#FFF', borderRadius: 4 }}>
              <Text style={{ color: '#333', fontFamily: 'airbnbCereal-medium', }}>Kalkış Konumu</Text>
              <Text style={{ fontFamily: 'airbnbCereal-light', color: '#555', minHeight: 34 }}>{this.state.currentTrip.kalkisAddress.substring(0, 50)}</Text>
            </View>
            <View style={{ width: 47 + '%', marginLeft: 1 + '%', padding: 8, backgroundColor: '#FFF', borderRadius: 4 }}>
              <Text style={{ color: '#333', fontFamily: 'airbnbCereal-medium', }}>Varış Konumu</Text>
              <Text style={{ fontFamily: 'airbnbCereal-light', color: '#555', }}>{this.state.currentTrip.varisAddress.substring(0, 50)}</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10, }}>
            <View style={{ width: 31 + '%', marginRight: 1 + '%', padding: 8, backgroundColor: '#2b3138', borderRadius: 4, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Ionicons name="ios-car" size={17} color="#FFF" style={{ marginRight: 5 }} />
              <Text style={{ color: '#FFF', fontFamily: 'airbnbCereal-medium', textAlign: 'center' }}>{this.state.currentTrip.distance} Km</Text>
            </View>
            <View style={{ width: 31 + '%', marginRight: 1 + '%', padding: 8, backgroundColor: '#2b3138', borderRadius: 4, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Ionicons name="ios-time" size={17} color="#FFF" style={{ marginRight: 5 }} />
              <Text style={{ color: '#FFF', fontFamily: 'airbnbCereal-medium', textAlign: 'center' }}>{this.state.currentTrip.duration} Dakika</Text>
            </View>
            <View style={{ width: 31 + '%', marginRight: 1 + '%', padding: 8, backgroundColor: '#2b3138', borderRadius: 4, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Ionicons name="ios-cash" size={17} color="#FFF" style={{ marginRight: 5 }} />
              <Text style={{ color: '#FFF', fontFamily: 'airbnbCereal-medium', textAlign: 'center' }}>{this.state.currentTrip.price} TL</Text>
            </View>


          </View>
          {this.state.currentTrip.status == 1 && <View style={{ width: 95 + '%', marginRight: 1 + '%', padding: 8, margin: 6, backgroundColor: '#2b3138', borderRadius: 4, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name="ios-information-circle" size={17} color="#FFF" style={{ marginRight: 5 }} />
            <Text style={{ color: '#FFF', fontFamily: 'airbnbCereal-medium', textAlign: 'center' }}>Durum:  {this.state.surucuDurumText}</Text>
          </View>
          }
          {this.state.currentTrip.status == 1 &&
            <TouchableOpacity onPress={() => { this.props.propsNav.navigate('HaritaforTripUser'); }} style={{ width: 95 + '%', marginRight: 1 + '%', padding: 8, margin: 6, backgroundColor: '#2b3138', borderRadius: 4, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Ionicons name="ios-map" size={17} color="#FFF" style={{ marginRight: 5 }} />
              <Text style={{ color: '#FFF', fontFamily: 'airbnbCereal-medium', textAlign: 'center' }}>Canlı Haritaya Bak</Text>
            </TouchableOpacity>
          }
        </View>


      )



    }
    // }
    // else if (this.state.aktifMi == true) {


    //   
    // }

  };
}