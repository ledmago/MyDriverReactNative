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
import * as MessageController from '../Controller/MesajController';

export default class Example extends React.Component {
  constructor(props) {
    super(props);
    this.userDetails = {};
  }
  chatDetails = {
    username: this.props.navigation.state.params.username,
    userType: this.props.navigation.state.params.userType,
    profilePicture: this.props.navigation.state.params.profilePicture,
    firstName: this.props.navigation.state.params.firstName,
    lastName: this.props.navigation.state.params.lastName,
  };
  state = {
    okunmayanMesaj: 0,
    userUid: '',
    messages:[],
  }

  static navigationOptions = ({ navigation }) => {
    return {
      header: () => null
    }
  }





  async componentDidMount() {
    this.userDetails = JSON.parse(await AsyncStorage.getItem('userDetails'));
    var allMessagelist = await MessageController.getAllMessages(this.chatDetails.username);
    var convertMessages = [];
    allMessagelist.map((item) => {
      convertMessages.push({
        _id: item.id,
        text: item.message,
        createdAt: new Date(),
        user: {
          _id: item.senderUsername,
          name: item.name,
          avatar: this.chatDetails.profilePicture,
        },

      })

    })
    this.setState({ messages: convertMessages })


  }

  async onSend(messages = []) {


    var messageObj = messages[0];
    messageObj.createdAt = Date.now();
    const MesajGonder = await MessageController.sendMesage(this.chatDetails.username, messageObj.text, this.chatDetails.userType);
    if (MesajGonder) {
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, {

          _id: MesajGonder.id,
          text: MesajGonder.message,
          createdAt: new Date(),
          user: {
            _id: MesajGonder.senderUsername,
            name: MesajGonder.name,
          },




        }),
      }))


    }


  }

  render() {
    return (

      <View style={styles.container}>

        <View style={styles.header}>
          <View style={styles.headerContainer}>
            <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => this.props.navigation.pop()}><Ionicons name="ios-arrow-back" size={35} color="#CCC" /></TouchableOpacity>
            <Text style={styles.headerTitle}>{this.chatDetails.firstName} {this.chatDetails.lastName}</Text>
          </View>

        </View>


        {this.state.messages.length < 1 && <ActivityIndicator size={40} style={{marginTop:50}} />}
        {this.state.messages.length > 0 && <GiftedChat
          multiline={false}
          loadEarlier={false}
          placeholder='Mesaj Yazın'
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: this.userDetails.username,
            avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg'
          }}
        />}


      </View>
    )
  }
}
const styles = StyleSheet.create({
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
  listItemContainer: {
    backgroundColor: '#202329',
    borderBottomWidth: 0.5,
    borderBottomColor: '#000'
  }
});
