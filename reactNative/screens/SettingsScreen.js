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
      function:()=>{this.props.navigation.navigate('ProfilDuzenleScreen')}
    },
    {
      title: 'Bildirim Ayarları',
      icon: 'notifications',
      function:()=>{this.props.navigation.navigate('BildirimAyarScreen')}
    },
    {
      title: 'Mesajlaşma Ayarları',
      icon: 'email',
      function:()=>{this.props.navigation.navigate('MesajAyarScreen')}
    },
    {
      title: 'Çıkış',
      icon: 'power',
      function:()=>{this.logOut()}
    },

  ]

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Yolculuk Durumu',
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




  async componentDidMount() {
    CustomerSide_HomeController.Initial(this.props);
    // User Details'i Çek ve UserDetails'i State Durumuna Aktar. 
    CustomerSide_HomeController.getUserDetails().then((userdata) => { this.setState({ userDetails: userdata }); })
    this.props.navigation.setParams({ goBack: this.NavgoBack });

  }


  NavgoBack = () => {
    this.props.navigation.navigate('HomeStack')
  };
  logOut = async() => {
    
    var userUid = await AsyncStorage.getItem('userToken');

    const dbhRealtime = firebase.database();
    dbhRealtime.ref('users').child(userUid).remove().then(()=>{

      AsyncStorage.clear('userToken');
      this.props.navigation.navigate('Auth');
    });


   
  };


  render() {

    return (
      <View>

<View style={{flexDirection:'row',margin:15}}>
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
            <Text style={{ fontFamily: 'airbnbCereal-medium', color: '#444', fontSize: 21, }}>{this.state.userDetails.name}</Text>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: 12, height: 12, backgroundColor: 'green', borderRadius: 12 / 2, marginTop: 3, }}></View>
              <Text style={{ marginLeft: 5, marginRight: 5, fontFamily: 'airbnbCereal-light', color: 'green' }}>Online</Text>
              <Text style={{ marginLeft: 5, marginRight: 5, fontFamily: 'airbnbCereal-light', color: '#333' }}>Yolcu</Text>
            </View>

          </View>
  <TouchableOpacity onPress={()=>{this.props.navigation.navigate('BalanceScreen')}} style={{ flexDirection: 'row', backgroundColor: '#CCC', height: 50, minWidth: 90, alignItems: 'center', justifyContent: 'center', borderRadius: 6, paddingHorizontal: 5 }}><Text style={{ fontSize: 23, fontFamily: 'airbnbCereal-medium', marginRight: 3 }}>{this.state.userDetails.balance}</Text><Image style={{ height: 20, width: 15 }} source={require('../assets/images/tlicon.png')} /></TouchableOpacity>

  </View>
        <View>
          {
            this.list.map((item, i) => (
              <TouchableOpacity >
                <ListItem
                  key={i}
                  title={item.title}
                  leftIcon={{ name: item.icon }}
                  bottomDivider
                  chevron
                  style={{ backgroundColor: '#666' }}
                  friction={90} //
                  tension={100} // These props are passed to the parent component (here TouchableScale)
                  activeScale={0.95} //
                  onPress={item.function}


                />
              </TouchableOpacity>
            ))
          }
        </View>


      </View >
    );
  }


};
