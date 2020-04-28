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
  AsyncStorage,
  SafeAreaView
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
import CreditCardComponent from '../components/CreditCardList';
import firebase from '../components/Firebase';
import config from '../config.json';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);

  }
  state = {
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
  }



  list = [
    {
      title: 'Profili Düzenle',
      icon: 'people',
      function: () => { this.props.navigation.navigate('ProfilDuzenleScreen') }
    },
    {
      title: 'Bildirim Ayarları',
      icon: 'notifications',
      function: () => { this.props.navigation.navigate('BildirimAyarScreen') }
    },
    {
      title: 'Ödeme ayarları',
      icon: 'credit-card',
      function: () => { this.props.navigation.navigate('userCreditCard') }
    },
    {
      title: 'Mesajlaşma Ayarları',
      icon: 'email',
      function: () => { this.props.navigation.navigate('MesajAyarScreen') }
    },
    {
      title: 'Çıkış',
      icon: 'power',
      function: () => { this.logOut() }
    },

  ]





  async componentDidMount() {
   
  }


  NavgoBack = () => {
    this.props.navigation.navigate('HomeStack')
  };
  logOut = async () => {

    let response = await fetch(config.apiURL + 'Logout' + '/', { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json', } });
    await AsyncStorage.removeItem('userHash');
    this.props.navigation.navigate('Auth');
  };

  render() {

    return (
      <SafeAreaView style={{ flex: 1,backgroundColor:'#161a1e'}}>
        <View style={styles.header}>
                    <View style={styles.headerContainer}>
                        <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => this.props.navigation.pop()}><Ionicons name="ios-arrow-back" size={35} color="#CCC" /></TouchableOpacity>
                        <Text style={styles.headerTitle}>Ayarlar</Text>
                    </View>

                </View>
       
        <View>
          {
            this.list.map((item, i) => (
              <TouchableOpacity >
                <ListItem
                  containerStyle={{backgroundColor:'#161a1e'}}
                  titleStyle={{color:'#FFF'}}
                  key={i}
                  title={item.title}
                  leftIcon={{ name: item.icon,color:'#FFF' }}
                  bottomDivider
                  chevron
                  friction={90} //
                  tension={100} // These props are passed to the parent component (here TouchableScale)
                  activeScale={0.95} //
                  onPress={item.function}


                />
              </TouchableOpacity>
            ))
          }
        </View>


      </SafeAreaView >
    );
  }


};
const styles = StyleSheet.create({

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