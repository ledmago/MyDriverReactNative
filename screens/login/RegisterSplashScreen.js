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
  TextInput,
  KeyboardAvoidingView,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from 'react-native-elements';

import { MonoText } from '../../components/StyledText';

class SplashPage extends React.Component {
  constructor(props) {
    super(props);

  }
  state = {
 

  };
  // HeaderBar'ı Kapat
  static navigationOptions = ({ navigation }) => {
    return {
      header: () => null
    }
  }
 
  componentDidMount() {

  }
  render() {

    return (
      <ImageBackground style={styles.container} resizeMode='cover'
        blurRadius={0}
        height={100} source={require('../../assets/images/background4.jpg')} >
        <View style={styles.backgroundCover}>
          <View style={styles.lineDivisor}></View>
          <StatusBar barStyle="light-content" />
          {<View style={styles.header}>
            <Text style={styles.description}>
              Lütfen kayıt olmak istediğiniz pozisyonu seçin
             </Text>
          </View>}

          <View style={styles.mainContext}>

            <TouchableOpacity style={styles.flexBox} onPress={()=>this.props.navigation.navigate('RegisterDriver')}>
              <Ionicons name="ios-car" size={70} color="#FFC541" />
              <Text style={styles.textStyle}>SÜRÜCÜ</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.flexBox} onPress={()=>this.props.navigation.navigate('RegisterCustomer')}>
              <Ionicons name="ios-person" size={70} color="#FFC541" />
              <Text style={styles.textStyle}>KULLANICI</Text>
            </TouchableOpacity>

          </View>

          <View style={{ backgroundColor: '#222', opacity: 0.7, padding: 5, alignItems: 'center', position: 'absolute', bottom: 0, width: 100 + '%' }}><Text style={{ color: '#EBEBEB', fontSize: 13, }}>Tüm Hakları Saklıdır - Copyright © 2019</Text></View>


        </View>
      </ImageBackground>
    )


  }

}
var styles = StyleSheet.create({
  textStyle:
  {
    color:'#FFC541',
    fontSize:22,
  },
  flexBox:
  {
    backgroundColor: '#000000b0',
    width: 75 + '%',
    height: 200,
    marginTop: 20,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth:1,
    borderColor:'#FFC541'
  },
  mainContext:
  {

    width: 100 + '%',
    height: 100 + '%',
    alignSelf: 'center',
    zIndex: 1,
    marginTop: 15,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundCover:
  {
    backgroundColor: '#000000b0',

    flex: 1
  },

  mainContaier: {
    backgroundColor: '#1E1324',
    flex: 1,
    justifyContent: 'flex-end'
    //marginTop: StatusBar.currentHeight,
  },
  contextContainer: {
    backgroundColor: '#FFF',
    width: 75 + '%',
    alignSelf: 'center',
    //position:'absolute',
    //bottom:200


  },
  lineDivisor:
  {

    height: StatusBar.currentHeight,
  },
  container: {
    flex: 1,
    backgroundColor: '#1E1324',
  },
  header: {
    paddingTop: 20,
    padding: 20,
    backgroundColor: '#336699',
  },
  description: {
    fontSize: 14,
    color: 'white',
    textAlign:'center'
  },
  input: {
    width: 85 + '%',
    color: '#333',
    backgroundColor: '#FFF',
    opacity: 0.8,
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
  legal: {
    margin: 10,
    color: '#CCC',
    fontSize: 12,
    textAlign: 'center',
    position: 'absolute',
    bottom: 10,
    padding: 5,
    backgroundColor: '#336699',
  },


})
export default SplashPage;