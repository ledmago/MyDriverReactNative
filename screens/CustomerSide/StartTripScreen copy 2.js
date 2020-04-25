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
import * as BalanceController from '../../Controller/BalanceController';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Polyline from '@mapbox/polyline';
import EslestirmeComponent from '../../components/Eslestirme';


export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);

  }
  state = {
    userDetails: '',
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
    latitudeDelta: 0.0025,
    longitudeDelta: 0.0025,
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
    yolculukVarMi: false,


  };


  static navigationOptions = ({ navigation }) => {
    return {
        title: 'Bakiye İşlemleri',
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
NavgoBack = () => {
  this.props.navigation.navigate('Main')
};


  CheckLocation = async (buttondanGeldi = false) => {
    if (buttondanGeldi) { this.setState({ Modal1OpenLoadingButton: true }) }
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    let location = await Location.getCurrentPositionAsync({}).catch(() => { this.setState({ Modal1Open: true }) });
    this.setState({ location: location });

    this.setState({ kalkisCordinate: { latitude: location.coords.latitude, longitude: location.coords.longitude } })


    this.setState({ latitude: location.coords.latitude, longitude: location.coords.longitude, ModalLoading: false });
    this.setState({ geoCoding: await CustomerSide_HomeController.GET_ADRESS(location.coords.latitude, location.coords.longitude) });
  }



  async componentDidMount() {
    this.props.navigation.setParams({ goBack: this.NavgoBack });
    CustomerSide_StartTripController.Initial(this.props).then(() => {
      // Yolculuk Yoksa
      this.setState({ yolculukVarMi: false });
      CustomerSide_HomeController.Initial(this.props);

      this.CheckLocation();
      CustomerSide_StartTripController.getUserDetails().then((userDetails) => this.setState({ userDetails: userDetails }))
    }).catch(() => {
      // Yolculuk Varsa Daha Önceden
      this.setState({ yolculukVarMi: true, ModalLoading: false });
    })


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









  render() {

    if (this.state.yolculukVarMi == false) {
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



          <View>
            <View style={{ position: 'absolute', width: 100 + '%', top: StatusBar.currentHeight, left: 0, zIndex: 999999 }}>

              {(this.state.step == 1 || this.state.step == 2) && <View style={styles.searchBar}>

                <TextInput style={styles.searchInput}
                  placeholder="Konum Arayın"
                  onSubmitEditing={(e) => {



                    this.findPlacesFromApi(e.nativeEvent.text)
                    this.setState({ ModalLoading: true });


                  }} />

              </View>
              }

              {this.state.step == 1 &&
                <View style={styles.MainContext}>

                  <Text style={styles.baslikText}>Adım 1: Kalkış Yeri</Text>
                  <CheckBox
                    title='Konumum'
                    checked={this.state.neredenSecilcek}
                    onPress={() => {
                      this.setState({ neredenSecilcek: true })
                      this.setState({ kalkisCordinate: { latitude: this.state.latitude, longitude: this.state.longitude } })

                    }}
                  />
                  <CheckBox
                    title='Haritadan Seç'
                    checked={!this.state.neredenSecilcek}
                    onPress={() => {
                      this.setState({ neredenSecilcek: false })
                      alert('Kırmızı İşaretçiye Basılı Tutup İstediğiniz Yere Bırakın.')

                    }}
                  />

                </View>
              }
              {this.state.step == 2 &&
                <View style={styles.MainContext}>

                  <Text style={styles.baslikText}>Adım 2: Varış Yeri</Text>
                  {/* <CheckBox
                    title='Konumum'
                    checked={this.state.neredenSecilcek}
                    onPress={() => {
                      this.setState({ neredenSecilcek: true })
                      this.setState({ kalkisCordinate: { latitude: this.state.latitude, longitude: this.state.longitude } })
  
                    }}
                  />
                   */}
                  <CheckBox
                    title='Haritadan Seç'
                    checked={true}
                    onPress={() => {
                      this.setState({ neredenSecilcek: false })
                      alert('Kırmızı İşaretçiye Basılı Tutup İstediğiniz Yere Bırakın')

                    }}
                  />

                </View>
              }
              {this.state.step == 3 &&
                <View style={styles.MainContext}>

                  <Text style={styles.baslikText}>Adım 3: Onayla</Text>

                  <Text style={{ paddingLeft: 15 }}>Varış ve Kalkış Noktasını Onaylayın</Text>
                  <Text style={{ alignSelf: 'center', marginTop: 10, padding: 15, width: 95 + '%', backgroundColor: '#EBEBEB', fontFamily: 'airbnbCereal-medium', borderWidth: 1, borderRadius: 2, borderColor: '#CCC' }}><Text style={{ color: '#256acc', fontSize: 16 }}>Kalkış Adresi :</Text> {"\n"}{this.state.kalkisAdress}</Text>
                  <Text style={{ alignSelf: 'center', marginTop: 10, padding: 15, width: 95 + '%', backgroundColor: '#EBEBEB', fontFamily: 'airbnbCereal-medium', borderWidth: 1, borderRadius: 2, borderColor: '#CCC' }}><Text style={{ color: '#256acc', fontSize: 16 }}>Varış Adresi :</Text> {"\n"}{this.state.varisAddress}</Text>
                </View>
              }
              {this.state.step == 4 &&
                <View style={styles.MainContext}>

                  <Text style={styles.baslikText}>Adım 4: Yolculuk Bilgileri</Text>

                  <Text style={{ paddingLeft: 15, fontFamily: 'airbnbCereal-light', fontSize: 16, }}>Yolculuk Bilgilerini Girin</Text>

                  <TextInput
                    placeholderTextColor={'#CCC'}
                    style={styles.input}
                    value={this.state.kisiSayisi}
                    onChangeText={kisiSayisi => this.setState({ kisiSayisi })}
                    placeholder="Kişi Sayısı"
                    autoCorrect={false}
                    keyboardType='decimal-pad'
                    returnKeyType='none'
                    onSubmitEditing={this._submit}
                    blurOnSubmit={true}
                  />
                  <Text style={{ paddingLeft: 15, marginTop: 10, fontFamily: 'airbnbCereal-light', }}>Tercih Edilen Araç Tipi</Text>


                  <CheckBox containerStyle={{ width: 90 + '%' }} checked={this.state.hepsi} onPress={() => this.setState({ hepsi: !this.state.hepsi })} title='Farketmez' />
                  <View style={{ flexDirection: 'row', width: 350 }}>
                    <CheckBox containerStyle={{ width: 40 + '%', marginRight: 0 }} checked={this.state.hepsi || this.state.hatchback} onPress={() => this.setState({ hatchback: !this.state.hatchback })} title='Hatchback' />
                    <CheckBox containerStyle={{ width: 40 + '%' }} title='Sedan' checked={this.state.hepsi || this.state.sedan} onPress={() => this.setState({ sedan: !this.state.sedan })} />
                  </View>
                  <View style={{ flexDirection: 'row', width: 350 }}>
                    <CheckBox containerStyle={{ width: 40 + '%', marginRight: 0 }} title='Arazi,Suv' checked={this.state.hepsi || this.state.suv} onPress={() => this.setState({ suv: !this.state.suv })} />
                    <CheckBox containerStyle={{ width: 40 + '%' }} title='Minibüs' checked={this.state.hepsi || this.state.minibus} onPress={() => this.setState({ minibus: !this.state.minibus })} />
                  </View>


                </View>
              }
              {
                this.state.step == 5 &&
                <View style={styles.MainContext}>

                  <Text style={styles.baslikText}>Adım 5: Bilgi ve Fiyatlandırma</Text>
                  <Text style={{ alignSelf: 'center', marginTop: 10, padding: 15, width: 95 + '%', backgroundColor: '#EBEBEB', fontFamily: 'airbnbCereal-medium', borderWidth: 1, borderRadius: 2, borderColor: '#CCC' }}><Text style={{ color: '#256acc', fontSize: 16 }}>Tahmini Mesafe :</Text> {"\n"}{this.state.distance}</Text>
                  <Text style={{ alignSelf: 'center', marginTop: 10, padding: 15, width: 95 + '%', backgroundColor: '#EBEBEB', fontFamily: 'airbnbCereal-medium', borderWidth: 1, borderRadius: 2, borderColor: '#CCC' }}><Text style={{ color: '#256acc', fontSize: 16 }}>Tahmini Yoluculuk Süresi :</Text> {"\n"}{this.state.duration}</Text>
                  <View style={{ alignSelf: 'center', marginTop: 10, padding: 15, width: 95 + '%', backgroundColor: '#EBEBEB', borderWidth: 1, borderRadius: 2, borderColor: '#CCC', fontFamily: 'airbnbCereal-medium', flexDirection: 'row', alignItems: 'center' }}><Text style={{ color: '#256acc', fontSize: 16, fontFamily: 'airbnbCereal-medium' }}>Fiyat :</Text><Text style={{ textAlign: 'center', width: 70 + '%', fontFamily: 'airbnbCereal-medium', fontSize: 30, alignSelf: 'center' }}>{this.state.TripPrice} TL</Text></View>

                </View>
              }
              {
                this.state.step == 6 &&
                <View style={styles.MainContext}>

                  <Text style={styles.baslikText}>Adım 6: Ek Açıklamalar</Text>
                  <TextInput
                    multiline={true}
                    numberOfLines={4}
                    maxLength={200}
                    onChangeText={(EkAciklama) => this.setState({ EkAciklama })}
                    value={this.state.EkAciklama}
                    style={{ width: 90 + '%', maxHeight: 100, alignSelf: 'center', borderWidth: 1, borderColor: '#EBEBEB', borderRadius: 4 }}
                    placeholder='Ek Olarak Yazmak İstediğiniz Açıklama' />

                </View>
              }
            </View >
            <Button disabled={this.state.step == 1} containerStyle={{ position: 'absolute', width: 70, left: 20, bottom: 70, zIndex: 999999999 }} title='Geri'

              onPress={() => {
                this.setState({ step: this.state.step - 1 })
              }}
            />
            <Button disabled={(this.state.kalkisCordinate.latitude < 1)} containerStyle={{ position: 'absolute', width: 70, right: 20, bottom: 70, zIndex: 999999999 }} title={this.state.step != 6 ? 'İleri' : 'Bitir'}
              onPress={async () => {

                var nextStep = this.state.step + 1;
                if (nextStep != 7) { this.setState({ step: nextStep }) }
                if (nextStep == 2) {
                  alert("Yeşil İşaretçiye Basılı Tutup İstediğiniz Yere Bırakın.");

                  var newCordinates = { latitude: this.state.kalkisCordinate.latitude - 0.0005, longitude: this.state.kalkisCordinate.longitude - 0.0005 };
                  this.setState({ varisCordinate: newCordinates });
                }
                if (nextStep == 3) {
                  this.setState({ ModalLoading: true });
                  var kalkisAdress = await CustomerSide_HomeController.GET_ADRESS(this.state.kalkisCordinate.latitude, this.state.kalkisCordinate.longitude);
                  var varisAddress = await CustomerSide_HomeController.GET_ADRESS(this.state.varisCordinate.latitude, this.state.varisCordinate.longitude);
                  this.setState({ kalkisAdress: kalkisAdress.display_name, varisAddress: varisAddress.display_name })
                  var ortalama_latitude = (this.state.kalkisCordinate.latitude + this.state.varisCordinate.latitude) / 2
                  var ortalama_longitude = (this.state.kalkisCordinate.longitude + this.state.varisCordinate.longitude) / 2
                  var ortalama_latitudeDelta = Math.abs(this.state.kalkisCordinate.latitude - this.state.varisCordinate.latitude) + 0.01;
                  var ortalama_longitudeDelta = Math.abs(this.state.kalkisCordinate.longitude - this.state.varisCordinate.longitude) + 0.01;

                  this.setState({ latitude: ortalama_latitude, longitude: ortalama_longitude, latitudeDelta: ortalama_latitudeDelta, longitudeDelta: ortalama_longitudeDelta });

                  var param1 = this.state.kalkisCordinate.latitude + ', ' + this.state.kalkisCordinate.longitude;
                  var param2 = this.state.varisCordinate.latitude + ', ' + this.state.varisCordinate.longitude;
                  this.getDirections(param1, param2)
                  this.setState({ ModalLoading: false });

                }
                if (nextStep == 7) {
                  // Şuan Zaten Step 6 Dasın
                  //Bitir
                  if (parseFloat(this.state.userDetails.balance) > parseFloat(this.state.TripPrice)) {

                    this.setState({ ModalLoading: true }) // loading Ekranını Aç
                    // Veritabanına Kayıt Et
                    CustomerSide_StartTripController.saveTripInformation(
                      this.state.userDetails.name,
                      this.state.latitude,
                      this.state.longitude,
                      this.state.kalkisCordinate.latitude,
                      this.state.kalkisCordinate.longitude,
                      this.state.kalkisAdress,
                      this.state.varisAddress,
                      this.state.varisCordinate.latitude,
                      this.state.varisCordinate.longitude,
                      this.state.kisiSayisi,
                      {
                        hepsi: this.state.hepsi,
                        hatchback: this.state.hatchback,
                        sedan: this.state.sedan,
                        minibus: this.state.minibus,
                        suv: this.state.suv,
                      },
                      this.state.distance,
                      this.state.duration,
                      this.state.TripPrice,
                      this.state.EkAciklama,
                    ).then((e) => {

                      CustomerSide_StartTripController.reduceBalance(this.state.TripPrice).then(() => {

                        BalanceController.addLogs({ cardNumber: 'Yolculuk Ücreti', date: new Date().toISOString().slice(0, 10), amount: this.state.TripPrice })

                        CustomerSide_StartTripController.onayTrip().then(() => {
                          alert('Yolculuğunuz kaydedildi. Şöför Aranıyor..');
                          this.setState({ ModalLoading: false });
                          this.props.navigation.navigate('EslestirmeScreen');
                        });
                      });
                    });
                  }
                  else {
                    alert('Paranız Yok ');
                    // NOT SUFFICIENT BALANCE
                  }


                }



              }}

            />
            <MapView
              style={{ width: Dimensions.get('screen').width, height: Dimensions.get('screen').height, }} region={{ latitude: this.state.latitude, longitude: this.state.longitude, latitudeDelta: this.state.latitudeDelta, longitudeDelta: this.state.longitudeDelta }} showsUserLocation={true}>
              <MapView.Marker draggable={this.state.step == 1} coordinate={this.state.kalkisCordinate} onDragEnd={(e) => this.setState({ kalkisCordinate: e.nativeEvent.coordinate })} title={'Kalkış Noktası'} description={'Yolcu Adı : Fırat'}></MapView.Marker>

              {this.state.step > 1 &&
                <MapView.Marker pinColor='green' draggable={this.state.step == 2} coordinate={this.state.varisCordinate} onDragEnd={(e) => this.setState({ varisCordinate: e.nativeEvent.coordinate })} title={'Varış Noktası'} description={'Yolcu Adı : Fırat'}></MapView.Marker>
              }
              {this.state.step > 2 && <MapView.Polyline
                coordinates={this.state.coords}
                strokeWidth={2}
                strokeColor="red" />
              }
            </MapView>
          </View >

        </View >
      );
    }
    else {
      return (
        <View style={styles2.container}>
          <View style={{ height: StatusBar.currentHeight, backgroundColor: '#2b3138' }}></View>
          <View style={styles2.header}>
            <View style={styles2.headerContainer}>
              <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => this.props.navigation.navigate('HomeStack')}><Ionicons name="ios-arrow-back" size={35} color="#CCC" /></TouchableOpacity>
              <Text style={styles2.headerTitle}>Yolculuk Durumu</Text>
            </View>

          </View>
          <ScrollView style={{ padding: 10, backgroundColor: '#333' }}>
            <EslestirmeComponent propsNav={this.props.navigation}></EslestirmeComponent>
          </ScrollView>
        </View>
      )
    }

  }


};
const styles2 = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#202329',

  },
  header: {
    width: 100 + '%',
    backgroundColor: '#2b3138',
    height: 83,
    alignContent: 'center',
    justifyContent: 'center',
    paddingLeft: 10

  },
  headerContainer: {
    flexDirection: 'row',

  },
  headerTitle: {
    fontSize: 20,
    paddingLeft: 25,
    textAlignVertical: 'center',
    color: '#CCC',
    textAlign: 'left',
    fontFamily: 'airbnbCereal-medium',
  },
});


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
