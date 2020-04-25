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

export default class YakindakiYolcular extends React.Component {
    constructor(props) {
        super(props);
    }


    state = {
        yolcular: [{ name: 'Fırat Doğan' }, { name: 'Hakan Balamür' }, { name: 'Okan Bıyık' },],

        onlineUsers: [],

    }
    getOnlineUser = () => {


        var onlineUsers = this.state.onlineUsers;
        var now = Math.floor(Date.now() / 1000);

        const dbhRealtime = firebase.database();
        dbhRealtime.ref('users').orderByChild('lat').startAt(this.props.longitude - 0.02).on('child_removed', (e) => {
            if (e.val().lat < this.props.latitude + 0.02 && e.val().long > this.props.longitude - 0.02 && e.val().long < this.props.longitude + 0.02) {
                onlineUsers.map((l, i) => {
                    if (l.userUid == e.val().userUid) {
                        //  alert(this.state.onlineUsers.length)
                        onlineUsers.splice(i, 1)
                        this.setState({ onlineUsers: onlineUsers })
                        // alert('Burası Çalıştı' + this.state.onlineUsers.length)
                       
                    }
                })
            }


        });

        const dbhRealtime2 = firebase.database();


        dbhRealtime2.ref('users').orderByChild('lat').startAt(this.props.longitude - 0.02).on('child_added', (e) => {
           

            if (e.val().lat < (parseFloat(this.props.latitude) + 0.02) && e.val().long > (parseFloat(this.props.longitude) - 0.02) && e.val().long < (parseFloat(this.props.longitude) + 0.02)) {

        
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
            }
        });





        const dbhRealtime3 = firebase.database();
        dbhRealtime3.ref('users').orderByChild('lat').startAt(this.props.longitude - 0.02).on('child_changed', (e) => {
            // Burada Filtreleme Yapılıyor
            var bulundu = false;
            if (e.val().lat < this.props.latitude + 0.02 && e.val().long > this.props.longitude - 0.02 && e.val().long < this.props.longitude + 0.02) {
                var tempDrivers = this.state.onlineUsers;
                tempDrivers.map((l, i) => {
                    if (l.userUid == e.val().userUid) {
                        bulundu = true
                        tempDrivers[i].lat = e.val().lat;
                        tempDrivers[i].long = e.val().long;
                        this.setState({ onlineUsers: tempDrivers });
                    }
                });

                if(bulundu == false)
                {
                    var now = Math.floor(Date.now() / 1000);

                    var onlineUsersTemp = this.state.onlineUsers;

                    if (now - 10 < e.val().timestamp && now + 10 > e.val().timestamp) {

                        //if(onlineUsersTemp.length == 1){onlineUsersTemp = []}
                        onlineUsersTemp.push(e.val());
                        console.log(onlineUsersTemp)
                        this.setState({ onlineUsers: onlineUsersTemp })

                      


                    }
                }
            }


        });




    }

componentDidMount()
{
   
    this.getOnlineUser();
}

    render() {
        return (
            <View style={{ backgroundColor: '#1a1e23', paddingHorizontal: 20, paddingVertical: 10, width: 90 + '%', borderRadius: 5, alignSelf: 'center', marginTop: 15 }}>

{this.state.onlineUsers.length < 1 && <TouchableOpacity style={{ flexDirection: 'row', marginTop: 5, marginBottom: 5 }}>
                          <View style={{ width: 100 +'%', marginTop: 5, }}>
                                <Text style={{ fontFamily: 'airbnbCereal-medium', color: '#EBEBEB', fontSize: 18, textAlign:'center' }}>Etrafında Hiç Yolcu Yok</Text>
                                

                            </View>
                           
                        </TouchableOpacity>
                        }
                {this.state.onlineUsers.map((l, i) => {

                    return (
                        <TouchableOpacity style={{ flexDirection: 'row', marginTop: 5, marginBottom: 5 }}>
                            <Avatar
                                source={{
                                    uri:
                                        'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
                                }}
                                rounded={true}
                                size={50}
                                containerStyle={{ borderWidth: 1, borderColor: '#CCC', marginTop: 3, }}
                            />
                            <View style={{ marginLeft: 15, width: Dimensions.get('screen').width - 200, marginTop: 5, }}>
                                <Text style={{ fontFamily: 'airbnbCereal-medium', color: '#EBEBEB', fontSize: 18, }}>{l.name}</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ width: 12, height: 12, backgroundColor: 'green', borderRadius: 12 / 2, marginTop: 3, }}></View>
                                    <Text style={{ marginLeft: 5, marginRight: 5, fontFamily: 'airbnbCereal-light', color: 'green' }}>Online</Text>
                                    <Text style={{ marginLeft: 5, marginRight: 5, fontFamily: 'airbnbCereal-light', color: '#888' }}>Yolcu</Text>

                                </View>

                            </View>
                            <Ionicons name="ios-navigate" size={42} color="#666" />
                        </TouchableOpacity>
                    )
                })}




            </View>

        );

    };
}