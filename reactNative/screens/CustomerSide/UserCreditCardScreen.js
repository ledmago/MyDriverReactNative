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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { MonoText } from '../../components/StyledText';
import MapView from 'react-native-maps';
import { Divider, SearchBar, Avatar, ListItem, Button, Badge } from 'react-native-elements';
import * as Font from 'expo-font';
import * as CustomerSide_HomeController from '../../Controller/CustomerSide_HomeController';
import CreditCardComponent from '../../components/CreditCardList';


export default class HomeScreen extends React.Component {
    constructor(props) {
      super(props);
  
    }
     


    static navigationOptions = ({ navigation }) => {
      return {
        title:'Ödeme Ayarları',
        headerLeft: () => (
          <TouchableOpacity
        style={{marginLeft:20}}
          onPress={navigation.getParam('goBack')}
          title="Info"
          color="#fff"
        ><Ionicons name="ios-arrow-back" size={35} color="#444"/></TouchableOpacity>

        
        ),
      };
    };
  




    state = {
    };
    componentDidMount() {
      this.props.navigation.setParams({ goBack: this.NavgoBack });
    }
    NavgoBack = () => {
    this.props.navigation.navigate('Main')
    };
    
    render()
    {
      return(
<View style={{padding:10}}>

  <CreditCardComponent />
</View>

      )
    };
}