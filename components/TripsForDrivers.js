import * as WebBrowser from 'expo-web-browser';
import React, { useRef } from "react";
import FlashMessage from "react-native-flash-message";
import { showMessage, hideMessage } from "react-native-flash-message";
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
import * as BalanceController from '../Controller/BalanceController';
import AnimatedProgressWheel from 'react-native-progress-wheel';
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
import { Audio } from 'expo-av';

export default class YakindakiYolcular extends React.Component {
    constructor(props) {
        super(props);
    }

    newTimer = '';
    dinle = '';
    MevcutTripArray = [];
    state = {
        mevcutTrip: false,
        mevcutTripDetay: {},
        yolcular: [{ name: 'Fırat Doğan' }, { name: 'Hakan Balamür' }, { name: 'Okan Bıyık' },],

        onlineUsers: [],
        ModalOpen: false,
        ModalID: '',
        tripDetails: { destination: '', duration: '', kisiSayisi: '', fiyat: '', baslangicAddress: '', varisAddress: '', ekAciklama: '', tripPrice: '', },
        BeklemeView: false,
        timer: 20,
        okunmayanMesaj: 0,
        yolcukBitirButtonLoading: false,


    }
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

    getOnlineUser = () => {


        var onlineUsers = this.state.onlineUsers;
        var now = Math.floor(Date.now() / 1000);

        const dbhRealtime = firebase.database();
        dbhRealtime.ref('tripDatabase').orderByChild('userLat').startAt(this.props.longitude - 0.02).on('child_removed', (e) => {
            if (e.val().userLat > this.props.latitude - 0.02 && e.val().userLat < this.props.latitude + 0.02 && e.val().userLong > this.props.longitude - 0.02 && e.val().userLong < this.props.longitude + 0.02) {
                onlineUsers.map((l, i) => {
                    if (l.from == e.val().from) {

                        //  alert(this.state.onlineUsers.length)
                        onlineUsers.splice(i, 1)
                        this.setState({ onlineUsers: onlineUsers })
                        // alert('Burası Çalıştı' + this.state.onlineUsers.length)

                    }
                })
            }


        });


        //MQVQ1L

        const dbhRealtime2 = firebase.database();


        dbhRealtime2.ref('tripDatabase').orderByChild('userLat').startAt(this.props.longitude - 0.02).on('child_added', async (e) => {



            if (e.val().durum != 1 && e.val().userLat > this.props.latitude - 0.02 && e.val().userLat < this.props.latitude + 0.02 && e.val().userLong > this.props.longitude - 0.02 && e.val().userLong < this.props.longitude + 0.02) {
                var now = Math.floor(Date.now() / 1000);

                var onlineUsersTemp = this.state.onlineUsers;

                var bulundu = false;
                await onlineUsersTemp.map((l, i) => { if (l.from == e.val().from) { bulundu = true } });

                if (bulundu == false) {

                    if (now - 900 < e.val().date && now + 900 > e.val().date) {


                        onlineUsersTemp.push(e.val());
                        this.setState({ onlineUsers: onlineUsersTemp })




                    }
                }
            }
        });








        const dbhRealtime3 = firebase.database();
        dbhRealtime3.ref('tripDatabase').orderByChild('userLat').startAt(this.props.longitude - 0.02).on('child_changed', (e) => {

            // Burada Filtreleme Yapılıyor

            if (e.val().userLat > this.props.latitude - 0.02 && e.val().userLat < this.props.latitude + 0.02 && e.val().userLong > this.props.longitude - 0.02 && e.val().userLong < this.props.longitude + 0.02) {

                var tempDrivers = this.state.onlineUsers;
                var bulundu = false;
                tempDrivers.map((l, i) => {
                    if (l.from == e.val().from) {
                        bulundu = true;

                        if (e.val().durum != 1) { tempDrivers[i] = e.val(); } else { tempDrivers.splice(i, 1) }

                        this.setState({ onlineUsers: tempDrivers });

                    }
                });


                if (bulundu == false) {
                    if (now - 900 < e.val().date && now + 900 > e.val().date && e.val().durum != 1) {

                        var onlineUsersTemp = this.state.onlineUsers;
                        if (e.val().durum != 1) { onlineUsersTemp.push(e.val()); }
                        this.setState({ onlineUsers: onlineUsersTemp })




                    }
                }
            }


        });




    }

    refreshPageForce = () => {
        this.componentDidMount();
        this.mevcutDurumSorgula();
      
    }
    yolculukBitir = async () => {
        this.setState({ yolcukBitirButtonLoading: true })
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        let location = await Location.getCurrentPositionAsync({}).catch(() => { alert('Bir hata meydana geldi lütfen tekrar deneyin !') });
        this.setState({ yolcukBitirButtonLoading: false })
        var differenceLat = Math.abs(location.coords.latitude - this.state.mevcutTripDetay.varisCordinate.lat)
        var differenceLong = Math.abs(location.coords.longitude - this.state.mevcutTripDetay.varisCordinate.long)
        if (differenceLat < 0.01 && differenceLong < 0.01) {
            // Yolculuğu Bitir
            alert('Ücret Tahsil Edildi, Bakiyeniz Güncellendi')
            BalanceController.UpdateBalanceDriver(this.state.mevcutTripDetay.tripPrice);


            var db = firebase.database().ref('tripDatabase/' + this.state.mevcutTripDetay.from).update({
                durum: 3,
            }).then(() => {


                var db2 = firebase.database().ref('tripDatabase/' + this.state.mevcutTripDetay.from).remove()
                    .then(() => {
                        this.MevcutTripArray = [];
                        this.refreshPageForce();
                    })
            })
        }


    }
    mevcutDurumSorgula = async () => {

        var userUid = await AsyncStorage.getItem('userToken');
        const dbhRealtime = firebase.database();

        dbhRealtime.ref('tripDatabase').orderByChild('who').equalTo(userUid).once('value', (e) => {
            if (e.exists && e.val() != null) {
                var snapshot = e.val();

                this.MevcutTripArray = Object.keys(snapshot).map(i => snapshot[i])

                this.MevcutTripArray.map((l, i) => {
                    if (l.durum != 1) { this.MevcutTripArray.splice(i, 1) }

                })


            }
            else{
                this.MevcutTripArray = [];
            }
        }).then(() => {
            if (this.MevcutTripArray.length > 0) { this.getUnreadMessages(this.MevcutTripArray[0].tripID); this.setState({ mevcutTrip: true, mevcutTripDetay: this.MevcutTripArray[0] }) }
        });
    };
    componentDidMount() {
       
        this.getOnlineUser();
        this.mevcutDurumSorgula();
    }

    render() {
        return (
            <View style={{ backgroundColor: '#1a1e23', paddingHorizontal: 20, paddingVertical: 10, width: 100 + '%', borderRadius: 5, alignSelf: 'center', marginTop: 15,borderColor:'#ccc',borderWidth:3,borderStyle:'dashed'}}>



                <Modal animationType="slide"
                    transparent={true}
                    visible={this.state.ModalOpen}

                    onRequestClose={() => {


                    }}>



                    <View style={{ backgroundColor: '#000000b0', justifyContent: 'center', position: 'absolute', left: 0, top: 0, width: 100 + '%', height: 100 + '%', zIndex: 2 }}>

                        <View style={{ borderRadius: 5, width: 90 + '%', backgroundColor: '#202329', height: Dimensions.get('screen').height - 200, alignSelf: 'center' }}>

                            {this.state.BeklemeView == true && <View style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', width: 100 + '%', height: 100 + '%', backgroundColor: '#202329', zIndex: 999999 }}>

                                <View>
                                    <AnimatedProgressWheel
                                        progress={100}
                                        animateFromValue={0}
                                        duration={20000}
                                        width={20}
                                    />

                                    <View style={{ position: 'absolute', width: 200, alignItems: 'center', height: 200, justifyContent: 'center' }}>
                                        <Text style={{ fontSize: 35, color: '#CCC', fontFamily: 'airbnbCereal-medium' }}>{this.state.timer}</Text>
                                        <Text style={{ fontSize: 20, color: '#CCC', fontFamily: 'airbnbCereal-light' }}>Saniye</Text>
                                    </View>
                                    <Button title='İptal et' containerStyle={{ marginTop: 15 }} onPress={() => {



                                        firebase.database().ref('tripDatabase').child(this.state.ModalID).off('child_changed', this.dinle)

                                        this.setState({ BeklemeView: false, timer: 20, ModalOpen: false });
                                        clearInterval(this.newTimer);
                                        var db = firebase.database().ref('tripDatabase').child(this.state.ModalID)
                                        db.update({
                                            who: '',
                                            durum: 0
                                        });

                                 



                                    }}></Button>

                                </View>
                            </View>
                            }


                            <TouchableOpacity style={{ position: 'absolute', right: -10, top: -12, zIndex: 9999999999, }} onPress={() => this.setState({ ModalOpen: false })}>
                                <Ionicons name="ios-close-circle" size={37} color="#333" />
                            </TouchableOpacity>

                            <View style={{ backgroundColor: '#fed32c', flexDirection: 'row', paddingVertical: 20, paddingLeft: 10, borderTopRightRadius: 5, borderTopLeftRadius: 5 }}>
                                <Avatar
                                    source={{
                                        uri:
                                            'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
                                    }}
                                    rounded={true}
                                    size={50}
                                    containerStyle={{ borderWidth: 1, borderColor: '#CCC', marginTop: 3, }}
                                />
                                <View style={{ marginLeft: 15, width: Dimensions.get('screen').width - 160, marginTop: 5, }}>
                                    <Text style={{ fontFamily: 'airbnbCereal-medium', color: '#1E1324', fontSize: 22, }}>Fırat Doğan</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ marginLeft: 0, marginRight: 4, fontFamily: 'airbnbCereal-light', color: '#333' }}>Yolcu</Text>

                                    </View>



                                </View>
                            </View>
                            <ScrollView>
                                <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 10 }}>
                                    <Ionicons name="ios-car" size={42} color="#666" />
                                    <View style={{ marginLeft: 15, borderRadius: 5, padding: 5, alignItems: 'center', backgroundColor: '#2b3138', width: 160, alignSelf: 'center' }}>

                                        <Text style={{ marginLeft: 0, alignSelf: 'center', marginRight: 4, fontSize: 17, fontFamily: 'airbnbCereal-light', color: '#EBEBEB', textAlign: 'center' }}>Mesafe : {this.state.tripDetails.destination}</Text>

                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 10 }}>
                                    <Ionicons name="ios-clock" size={42} color="#666" />
                                    <View style={{ marginLeft: 15, borderRadius: 5, padding: 5, alignItems: 'center', backgroundColor: '#2b3138', width: 160, alignSelf: 'center' }}>

                                        <Text style={{ marginLeft: 0, alignSelf: 'center', marginRight: 4, fontSize: 17, fontFamily: 'airbnbCereal-light', color: '#EBEBEB', textAlign: 'center' }}>Ort. Süre : {this.state.tripDetails.duration}</Text>

                                    </View>
                                </View>


                                <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 10 }}>
                                    <Ionicons name="ios-people" size={42} color="#666" />
                                    <View style={{ marginLeft: 15, borderRadius: 5, padding: 5, alignItems: 'center', backgroundColor: '#2b3138', width: 160, alignSelf: 'center' }}>

                                        <Text style={{ marginLeft: 0, alignSelf: 'center', marginRight: 4, fontSize: 17, fontFamily: 'airbnbCereal-light', color: '#EBEBEB', textAlign: 'center' }}>Kişi Sayısı : {this.state.tripDetails.kisiSayisi}</Text>

                                    </View>
                                </View>


                                <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 10 }}>
                                    <Ionicons name="ios-card" size={42} color="#666" />
                                    <View style={{ marginLeft: 15, borderRadius: 5, padding: 5, alignItems: 'center', backgroundColor: '#2b3138', width: 160, alignSelf: 'center' }}>

                                        <Text style={{ marginLeft: 0, alignSelf: 'center', marginRight: 4, fontSize: 17, fontFamily: 'airbnbCereal-light', color: '#EBEBEB', textAlign: 'center' }}>Fiyat : {this.state.tripDetails.tripPrice} TL</Text>

                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 10 }}>
                                    <Ionicons name="ios-locate" size={42} color="#666" />
                                    <View style={{ marginLeft: 15, borderRadius: 5, padding: 5, alignItems: 'center', backgroundColor: '#2b3138', width: 160, alignSelf: 'center' }}>

                                        <Text style={{ marginLeft: 0, alignSelf: 'center', marginRight: 4, fontSize: 17, fontFamily: 'airbnbCereal-light', color: '#EBEBEB', textAlign: 'center' }}>Başlangıç : {this.state.tripDetails.baslangicAddress}</Text>

                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 10 }}>
                                    <Ionicons name="ios-navigate" size={42} color="#666" />
                                    <View style={{ marginLeft: 15, borderRadius: 5, padding: 5, alignItems: 'center', backgroundColor: '#2b3138', width: 160, alignSelf: 'center' }}>

                                        <Text style={{ marginLeft: 0, alignSelf: 'center', marginRight: 4, fontSize: 17, fontFamily: 'airbnbCereal-light', color: '#EBEBEB', textAlign: 'center' }}>Varış : {this.state.tripDetails.varisAddress}</Text>

                                    </View>
                                </View>


                                <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 10 }}>
                                    <Ionicons name="ios-chatbubbles" size={42} color="#666" />
                                    <View style={{ marginLeft: 15, borderRadius: 5, padding: 5, alignItems: 'center', backgroundColor: '#2b3138', width: 160, alignSelf: 'center' }}>

                                        <Text style={{ marginLeft: 0, alignSelf: 'center', marginRight: 4, fontSize: 17, fontFamily: 'airbnbCereal-light', color: '#EBEBEB', textAlign: 'center' }}>Ek Açıklamalar : {this.state.tripDetails.ekAciklama}</Text>

                                    </View>
                                </View>
                            </ScrollView>
                            <Button title='İstek Gönder'

                                onPress={async () => {

                                    var db = firebase.database().ref('tripDatabase').child(this.state.ModalID)
                                    db.once('value', async (exx) => {
                                        if (exx.val().durum == 0) {


                                            this.setState({ BeklemeView: true, timer: 20 });

                                            var userUid = await AsyncStorage.getItem('userToken');
                                            var db = firebase.database().ref('tripDatabase').child(this.state.ModalID)
                                            db.update({
                                                who: userUid,
                                                durum: 2
                                            });


                                            this.newTimer = setInterval(async () => {
                                                this.setState({ timer: this.state.timer - 1 });
                                                if (this.state.timer < 1) {
                                                    this.setState({ BeklemeView: false, timer: 20, ModalOpen: false });
                                                    alert('Kullanıcı Cevap Vermedi')
                                                    clearInterval(this.newTimer);
                                                    var db = firebase.database().ref('tripDatabase').child(this.state.ModalID)
                                                    db.update({
                                                        who: '',
                                                        durum: 0
                                                    });
                                                    db.off('child_changed', this.dinle)
                                                }
                                            }, 1000);



                                            this.dinle = db.on('child_changed', async (e) => {
                                                if (e.val() == 0) {

                                                    this.setState({ BeklemeView: false, timer: 20, ModalOpen: false });
                                                    alert('Yolcu Reddetti')
                                                    this.componentDidMount();
                                                    clearInterval(this.newTimer);


                                                }
                                                if (e.val() == 1) {
                                                    clearInterval(this.newTimer);
                                                    this.setState({ BeklemeView: false, timer: 20, ModalOpen: false });
                                                    alert('Yolcu Kabul Etti');
                                                    //this.componentDidMount();
                                                    await AsyncStorage.setItem('yolcuUid', this.state.tripDetails.from);
                                                    this.props.propsNav.navigate('HaritaforTripDriver')

                                                }
                                                db.off('child_changed', this.dinle)
                                            })
                                        }
                                        else if (exx.val().durum == 1) {
                                            alert("Kullanıcı daha önceden bir sürücüyü kabul etmiş");
                                        }
                                        else {
                                            alert("Kullanıcı şuan meşgul");
                                        }
                                    });







                                }}></Button>



                        </View>

                    </View>


                </Modal>



                {this.MevcutTripArray.length > 0 && this.MevcutTripArray.map((l, i) => {

                    return (
                        <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 5 }}>
                            <View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <View style={{ width: 100 + '%', marginBottom: 0,  }}>



                                        <Text style={{ color: '#fed32c', fontFamily: 'airbnbCereal-medium', fontSize: 17, textAlign: 'center', marginBottom: 7, }}>Mevcut Yolculuk Bilgileri</Text>
                                       



                                      




                                        <View style={{ flexDirection: 'row', paddingVertical: 15, marginLeft: 5 }}>


                                            <Avatar
                                                source={{
                                                    uri:
                                                        'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
                                                }}
                                                rounded={true}
                                                size={50}
                                                containerStyle={{ borderWidth: 1, borderColor: '#CCC', marginTop: 3, }}
                                            />
                                            <View style={{ marginLeft: 15, width: Dimensions.get('screen').width - 50, marginTop: 5, justifyContent: 'center', }}>
                                                <Text style={{ fontFamily: 'airbnbCereal-medium', color: '#EBEBEB', fontSize: 18, }}>{l.name}</Text>


                                            </View>
                                            <Ionicons name="ios-email" size={42} color="#666" />
                                            <TouchableOpacity style={{ justifyContent: 'center', position: 'absolute', right: 15 }}
                                                onPress={async () => {
                                                    this.props.propsNav.navigate('HaritaforTripDriver')
                                                    await AsyncStorage.removeItem('ChatID').then(async () => { await AsyncStorage.setItem('ChatID', '' + l.tripID).then(() => { this.props.propsNav.navigate('ChatScreen') }) })


                                                }}
                                            >
                                                
                                            </TouchableOpacity>
                                        </View>

                                        




                                        <View style={{ width: 99 + '%', marginBottom: 10, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', flexDirection: 'row' }}>
                                            <View style={{ width: 48 + '%', marginRight: 1 + '%' }}><Button title='İptal Et' buttonStyle={{ backgroundColor: '#FFF', width: 100 + '%', }} titleStyle={{ color: '#1E1324' }} onPress={() => { EslestirmeController.IptalEtDriver(this.MevcutTripArray[0].from).then(() => { this.refreshPageForce(); }) }} containerStyle={{ marginTop: 10 }} icon={<Ionicons name="ios-trash" style={{ marginRight: 10 }} size={20} color="#1E1324" />} /></View>
                                            <View style={{ width: 48 + '%', marginLeft: 1 + '%' }}><Button title='Mesajlar' buttonStyle={{ backgroundColor: '#FFF', width: 100 + '%', }} titleStyle={{ color: '#1E1324' }} onPress={async () => {
                                                await AsyncStorage.removeItem('ChatID').then(async () => { await AsyncStorage.setItem('ChatID', '' + l.tripID).then(() => { this.props.propsNav.navigate('ChatScreen') }) })

                                            }} containerStyle={{ marginTop: 10 }} icon={<Ionicons name="ios-mail" style={{ marginRight: 10 }} size={20} color="#1E1324" />} /></View>

                                        </View>

                                        <View style={{ width: 99 + '%', marginBottom: 10, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', flexDirection: 'row' }}>
                                          
                                            <View style={{ width: 98 + '%', marginRight: 1 + '%' }}><Button title='Harita' buttonStyle={{ backgroundColor: '#FFF', width: 100 + '%', }} titleStyle={{ color: '#1E1324' }} onPress={async () => { await AsyncStorage.setItem('yolcuUid', l.from); this.props.propsNav.navigate('HaritaforTripDriver') }} containerStyle={{ marginTop: 10 }} icon={<Ionicons name="ios-map" style={{ marginRight: 10 }} size={20} color="#1E1324" />} /></View>
                                        </View>










                                        <View style={{ backgroundColor: '#222', borderRadius: 5, paddingBottom: 15, paddingTop: 5 }}>
                                            <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 10 }}>
                                                <Ionicons name="ios-car" size={42} color="#666" />
                                                <View style={{ marginLeft: 15, borderRadius: 5, padding: 5, alignItems: 'center', backgroundColor: '#2b3138', width: 160, alignSelf: 'center' }}>

                                                    <Text style={{ marginLeft: 0, alignSelf: 'center', marginRight: 4, fontSize: 17, fontFamily: 'airbnbCereal-light', color: '#EBEBEB', textAlign: 'center' }}>Mesafe : {l.distance}</Text>

                                                </View>
                                            </View>

                                            <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 10 }}>
                                                <Ionicons name="ios-clock" size={42} color="#666" />
                                                <View style={{ marginLeft: 15, borderRadius: 5, padding: 5, alignItems: 'center', backgroundColor: '#2b3138', width: 160, alignSelf: 'center' }}>

                                                    <Text style={{ marginLeft: 0, alignSelf: 'center', marginRight: 4, fontSize: 17, fontFamily: 'airbnbCereal-light', color: '#EBEBEB', textAlign: 'center' }}>Ort. Süre : {l.duration}</Text>

                                                </View>
                                            </View>


                                            <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 10 }}>
                                                <Ionicons name="ios-people" size={42} color="#666" />
                                                <View style={{ marginLeft: 15, borderRadius: 5, padding: 5, alignItems: 'center', backgroundColor: '#2b3138', width: 160, alignSelf: 'center' }}>

                                                    <Text style={{ marginLeft: 0, alignSelf: 'center', marginRight: 4, fontSize: 17, fontFamily: 'airbnbCereal-light', color: '#EBEBEB', textAlign: 'center' }}>Kişi Sayısı : {l.kisiSayisi}</Text>

                                                </View>
                                            </View>


                                            <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 10 }}>
                                                <Ionicons name="ios-card" size={42} color="#666" />
                                                <View style={{ marginLeft: 15, borderRadius: 5, padding: 5, alignItems: 'center', backgroundColor: '#2b3138', width: 160, alignSelf: 'center' }}>

                                                    <Text style={{ marginLeft: 0, alignSelf: 'center', marginRight: 4, fontSize: 17, fontFamily: 'airbnbCereal-light', color: '#EBEBEB', textAlign: 'center' }}>Fiyat : {l.tripPrice} TL</Text>

                                                </View>
                                            </View>

                                            <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 10 }}>
                                                <Ionicons name="ios-locate" size={42} color="#666" />
                                                <View style={{ marginLeft: 15, borderRadius: 5, padding: 5, alignItems: 'center', backgroundColor: '#2b3138', width: 160, alignSelf: 'center' }}>

                                                    <Text style={{ marginLeft: 0, alignSelf: 'center', marginRight: 4, fontSize: 17, fontFamily: 'airbnbCereal-light', color: '#EBEBEB', textAlign: 'center' }}>Başlangıç : {l.kalkisCordinate.text}</Text>

                                                </View>
                                            </View>

                                            <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 10 }}>
                                                <Ionicons name="ios-navigate" size={42} color="#666" />
                                                <View style={{ marginLeft: 15, borderRadius: 5, padding: 5, alignItems: 'center', backgroundColor: '#2b3138', width: 160, alignSelf: 'center' }}>

                                                    <Text style={{ marginLeft: 0, alignSelf: 'center', marginRight: 4, fontSize: 17, fontFamily: 'airbnbCereal-light', color: '#EBEBEB', textAlign: 'center' }}>Varış : {l.varisCordinate.text}</Text>

                                                </View>
                                            </View>


                                            <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 10 }}>
                                                <Ionicons name="ios-chatbubbles" size={42} color="#666" />
                                                <View style={{ marginLeft: 15, borderRadius: 5, padding: 5, alignItems: 'center', backgroundColor: '#2b3138', width: 160, alignSelf: 'center' }}>

                                                    <Text style={{ marginLeft: 0, alignSelf: 'center', marginRight: 4, fontSize: 17, fontFamily: 'airbnbCereal-light', color: '#EBEBEB', textAlign: 'center' }}>Ek Açıklamalar : {l.ekAciklama}</Text>

                                                </View>
                                            </View>
                                        </View>




                                    </View>

                                </View>

                            </View>

                        </View>
                    )
                })}




                {(this.state.onlineUsers.length < 1 && this.MevcutTripArray.length < 1) && <TouchableOpacity style={{ flexDirection: 'row', marginTop: 5, marginBottom: 5 }}>
                    <View style={{ width: 100 + '%', marginTop: 5, }}>
                        <Text style={{ fontFamily: 'airbnbCereal-medium', color: '#EBEBEB', fontSize: 18, textAlign: 'center' }}>Etrafında Hiç Yolcu Yok</Text>


                    </View>

                </TouchableOpacity>
                }
                {this.state.onlineUsers.map((l, i) => {

                    return (
                        <TouchableOpacity style={{ flexDirection: 'row', marginTop: 5, marginBottom: 5 }}

                            onPress={() => {
                                var newtripDetails = { destination: l.distance, duration: l.duration, kisiSayisi: l.kisiSayisi, fiyat: l.tripPrice, baslangicAddress: l.kalkisCordinate.text, varisAddress: l.varisCordinate.text, ekAciklama: l.ekAciklama, tripPrice: l.tripPrice, from: l.from }

                                this.setState({ ModalOpen: true, ModalID: l.from, tripDetails: newtripDetails })
                            }}

                        >
                            <Avatar
                                source={{
                                    uri:
                                        'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
                                }}
                                rounded={true}
                                size={50}
                                containerStyle={{ borderWidth: 1, borderColor: '#CCC', marginTop: 3, }}
                            />
                            <View style={{ marginLeft: 15, width: Dimensions.get('screen').width - 160, marginTop: 5, }}>
                                <Text style={{ fontFamily: 'airbnbCereal-medium', color: '#EBEBEB', fontSize: 18, }}>{l.name}</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ marginLeft: 0, marginRight: 4, fontFamily: 'airbnbCereal-light', color: '#888' }}>{l.distance}</Text>
                                    <Text style={{ marginLeft: 4, marginRight: 4, fontFamily: 'airbnbCereal-light', color: '#888' }}>{l.duration}</Text>
                                    <Text style={{ marginLeft: 4, marginRight: 4, fontFamily: 'airbnbCereal-light', color: '#888' }}>{l.kisiSayisi} Kişi</Text>
                                    <Text style={{ marginLeft: 4, marginRight: 4, fontFamily: 'airbnbCereal-medium', color: 'green', fontSize: 15 }}>{l.tripPrice} TL</Text>

                                </View>

                            </View>
                            <Ionicons name="ios-navigate" size={42} color="#666" />

                        </TouchableOpacity>
                    )
                })}



                <FlashMessage position="bottom" />
            </View>

        );

    };
}