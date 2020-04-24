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
import * as LoginController from '../../Controller/LoginController';

import { MonoText } from '../../components/StyledText';

class SplashPage extends React.Component {
  constructor(props) {
    super(props);

  }
  state = {
    email: '',
    password: '',
    btnLoading: false,
    btnLoading2: false,

  };
  // HeaderBar'ı Kapat
  static navigationOptions = ({ navigation }) => {
    return {
      header: () => null
    }
  }
  _submit = () => {
    this.setState({ btnLoading: true })
    LoginController.Login(this.state.email, this.state.password, 'user').then(() => this.setState({ btnLoading: false }));
   }

   _submit2 = () => {
    this.setState({ btnLoading2: true })
    LoginController.Login(this.state.email, this.state.password, 'driver').then(() => this.setState({ btnLoading2: false }));
   }

  componentDidMount() {
    LoginController.Initial(this.props);
  }
  render() {

    return (
      <ImageBackground style={styles.container} resizeMode='cover'
        blurRadius={0}
        height={100} source={require('../../assets/images/background.jpg')} >
        <View style={styles.backgroundCover}>
          <View style={styles.lineDivisor}></View>
          <StatusBar barStyle="light-content" />
          {/*<View style={styles.header}>
          <Text style={styles.description}>
            Uygulamayı kullanabilmeniz için telefonunuzun konum hizmetlerini açmanız gerekmektedir.

              </Text>
    </View>*/}
          <KeyboardAvoidingView behavior="padding" style={styles.form}>
            <View style={styles.formArea}>
              <View>
                <Image style={{ width: 80 + '%', height: 100, marginBottom: 150, alignSelf: 'center', marginTop: -50 }} source={require('../../assets/images/logo.png')}></Image>
              </View>
              <TextInput
                placeholderTextColor={'#CCC'}
                style={styles.input}
                value={this.state.email}
                onChangeText={email => this.setState({ email })}
                ref={ref => { this._emailInput = ref }}
                placeholder="Kullanıcı Adı Veya Email"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                returnKeyType="send"
                onSubmitEditing={this._submit}
                blurOnSubmit={true}

              />
              <TextInput
                placeholderTextColor={'#CCC'}
                style={styles.input}
                value={this.state.password}
                onChangeText={password => this.setState({ password })}
                placeholder="Şifre"
                secureTextEntry={true}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="send"
                onSubmitEditing={this._submit}
                blurOnSubmit={true}
              />
              <Button title="Yolcu Olarak Giriş Yap" loading={this.state.btnLoading} buttonStyle={{ height: 50, borderRadius: 1, backgroundColor: '#444' }} containerStyle={{ marginTop: 20, width: 85 + '%', alignSelf: 'center', }} onPress={this._submit} />
              <Button title="Sürücü Olarak Giriş Yap" loading={this.state.btnLoading2} buttonStyle={{ height: 50, borderRadius: 1, backgroundColor: '#af2f99' }} containerStyle={{ marginTop: 1, width: 85 + '%', alignSelf: 'center', }} onPress={this._submit2} />
              <View style={styles.forgetPassowrd}>
                <TouchableOpacity style={{ alignSelf: 'flex-start', width: 50 + '%' }}><Text style={{ color: '#8c8c8c', fontSize: 16 }}>Şifremi Unuttum</Text></TouchableOpacity>
                <TouchableOpacity style={{ alignSelf: 'flex-end', width: 50 + '%' }} onPress={() => this.props.navigation.navigate('RegisterSplash')}><Text style={{ color: '#8c8c8c', textAlign: 'right', fontSize: 16 }}>Kayıt Ol</Text></TouchableOpacity>
              </View>
            </View>


          </KeyboardAvoidingView>
          <View style={{ backgroundColor: '#222', opacity: 0.7, padding: 5, alignItems: 'center' }}><Text style={{ color: '#EBEBEB', fontSize: 13, }}>Tüm Hakları Saklıdır - Copyright © 2019</Text></View>
        </View>
      </ImageBackground>
    )


  }

}
var styles = StyleSheet.create({
  forgetPassowrd:
  {
    alignSelf: 'center',
    marginTop: 10,
    flexDirection: 'row',
    width: 85 + '%',
  },
  backgroundCover:
  {
    backgroundColor: '#000000b0',

    flex: 1
  },
  formArea: {
    paddingTop: 50,
    justifyContent: 'center',
    flex: 1,
  },
  ButtonArea:
  {
    backgroundColor: '#336699',
    height: 50,

    width: 100 + '%',
    justifyContent: 'center',
    alignItems: 'center',

  },
  form: {
    flex: 1,
    justifyContent: 'flex-start',



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