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
  }
 chatDetails = {
   username: this.props.navigation.state.params.username,
   profilePicture:this.props.navigation.state.params.profilePicture,
   firstName:this.props.navigation.state.params.firstName,
   lastName:this.props.navigation.state.params.lastName,
  };
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
        header: () => null
    }
}


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
 var allMessagelist = await MessageController.getAllMessages(this.chatDetails.username);
 var convertMessages = [];
 allMessagelist.map((item)=>{
  convertMessages.push({
    _id: item.id,
    text: item.message,
    createdAt: new Date(),
    user: {
      _id: 21,
      name: item.name,
      avatar: this.chatDetails.profilePicture,
    },

  })

 })
 this.setState({messages:convertMessages})

    // var userUid = await AsyncStorage.getItem('userToken');
    // this.setState({ userUid: userUid });
    // this.props.navigation.setParams({ goBack: this.NavgoBack });
    // this.getMessages(await AsyncStorage.getItem('ChatID'))
    // this.setUnreadMessages(await AsyncStorage.getItem('ChatID'))


  }

  async onSend(messages = []) {


    var messageObj = messages[0];
    messageObj.createdAt = new Date() / 1000;
    messageObj.okunmadi = true;
    firebase.database().ref('chat/' + await AsyncStorage.getItem('ChatID')).push(messageObj)


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


            <GiftedChat
        placeholder='Mesaj Yazın'
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: this.state.userUid,
          avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg'
        }}
      />  

     
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
