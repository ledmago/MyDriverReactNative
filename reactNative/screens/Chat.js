import React from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
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
  AsyncStorage,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import firebase from '../components/Firebase';

export default class Example extends React.Component {
  state = {
    okunmayanMesaj: 0,
    userUid: '',
    messages: [
      {
        _id: 1,
        text: 'Hello developers',
        createdAt: new Date(),
        user: {
          _id: 21,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ],
  }
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
  NavgoBack = async () => {
    this.props.navigation.navigate('Main')

  };

  setUnreadMessages = async(tripID) => {
    var userUid = await AsyncStorage.getItem('userToken');
    let dbCon = firebase.database().ref("chat/" + tripID);
    dbCon.once("value", async (snapshot) => {
      snapshot.forEach((child) => {
        if (child.val().user._id != userUid) {
          child.ref.update({
            okunmadi: false
          });
        }
      });
    });
  }

  getMessages = (tripID) => {



    firebase.database().ref('chat/' + tripID).orderByChild('createdAt').on('child_added', (e) => {

      /*
            var TempMessages = this.state.messages;
            TempMessages.push(e.val())
            this.setState({ messages: TempMessages })
      */

      this.setState(previousState => ({

        messages: GiftedChat.append(previousState.messages, e.val()),
      }))



    })

  }
  async componentDidMount() {
    var userUid = await AsyncStorage.getItem('userToken');
    this.setState({ userUid: userUid });
    this.props.navigation.setParams({ goBack: this.NavgoBack });
    this.getMessages(await AsyncStorage.getItem('ChatID'))
    this.setUnreadMessages(await AsyncStorage.getItem('ChatID'))


  }

  async onSend(messages = []) {


    var messageObj = messages[0];
    messageObj.createdAt = new Date() / 1000;
    messageObj.okunmadi = true;
    firebase.database().ref('chat/' + await AsyncStorage.getItem('ChatID')).push(messageObj)


  }

  render() {
    return (
      <GiftedChat
        placeholder='Mesaj Yazın'
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: this.state.userUid,
          avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg'
        }}
      />
    )
  }
}