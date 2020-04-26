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
    SafeAreaView,
    FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { MonoText } from '../components/StyledText';
import MapView from 'react-native-maps';
import { Divider, SearchBar, Avatar, Button, Badge } from 'react-native-elements';
import * as Font from 'expo-font';
import * as CustomerSide_HomeController from '../Controller/CustomerSide_HomeController';
import CreditCardComponent from '../components/CreditCardList';
import firebase from '../components/Firebase';
import { ListItem } from 'react-native-elements'

export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props);

    }
    state = {

    }
    

    addNewItemToStorage = async(tripID,newItem) => 
    {
        var tempChatRooms = JSON.parse(await AsyncStorage.getItem('chatRooms'));
        var isFind = false;
        tempChatRooms.map((item) => {
            if(item.id == tripID){isFind = true}
        })
        if(isFind == false)
        {
            tempChatRooms.push(newItem);
            await AsyncStorage.setItem(JSON.stringify(tempChatRooms));
        }
    }

    addCurrentChat = async(ifExist) =>{
        var userUid = await AsyncStorage.getItem('userToken');
        const dbhRealtime = firebase.database();

        dbhRealtime.ref('tripDatabase').orderByChild('who').equalTo(userUid).once('value', async(e) => {
            if (e.exists && e.val() != null) {
                var snapshot = Object.keys(e.val()).map(i => e.val()[i])

                const newItem = {
                    name:snapshot[0].name,
                    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
                    subtitle:'Yolculuk Mesajlaşması',
                    id:snapshot[0].tripID,
                    user:snapshot[0].from,
                };
               

                if(ifExist)
                {
                   
                    this.addNewItemToStorage(snapshot[0].tripID,newItem);

                }
                else{
                    await AsyncStorage.setItem('chatRooms',JSON.stringify(newItem))
                    this.list.push(newItem);
                }
               

            }
          
        });
    }
    
    chatRoomVar = async(chatRoom)=>{
      
    
         this.list.push(chatRoom);
   
     this.addCurrentChat(true);
    }

    chatRoomYok = async()=>{
     this.addCurrentChat(false);
    }
  
   chatRoomInitialize = async() =>
   {
     //  this.list = []; // Clear list variable
     
    const chatRooms = await AsyncStorage.getItem('chatRooms');
    if(chatRooms){
       this.chatRoomVar(JSON.parse(chatRooms))
       
    }else{
        this.chatRoomYok()
    }
       
   }

    list = [
        {
            name: '',
            avatar_url: '',
            subtitle: ''
        },
      

    ];



    async componentDidMount() {
        // this.chatRoomInitialize();
        // this.props.navigation.setParams({ goBack: this.NavgoBack });

    }

    listEmptyComponent = () => {
        return (
            <View>
                <Text>Henüz Mesajınız Yok</Text>
            </View>
        )
    }
    keyExtractor = (item, index) => index.toString();

    renderItem = ({ item }) => {
        if(item.name != '')
        {
        return (
            <TouchableOpacity onPress={async()=>{await AsyncStorage.removeItem('ChatID').then(async () => { await AsyncStorage.setItem('ChatID', '' + item.id).then(() => { this.props.navigation.navigate('ChatScreen') }) }) }}><ListItem
                    containerStyle={styles.listItemContainer}
                    titleStyle={{ color: '#CCC' }}
                    subtitleStyle={{ color: '#CCC' }}
        
                    title={item.name}
                    subtitle={item.subtitle}
                    leftAvatar={{ source: { uri: item.avatar_url } }}
        
                    chevron
                />
                </TouchableOpacity>
            )
        }
        else{
            return (<View style={{backgroundColor:'#333',height:0.3}}><Text></Text></View>)
        }
    }


    render() {

        return (
            <View style={styles.container}>
               
                <View style={{height: 0, backgroundColor: '#2b3138' }}></View>
                <View style={styles.header}>
                    <View style={styles.headerContainer}>
                        <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => this.props.navigation.goBack()}><Ionicons name="ios-arrow-back" size={35} color="#CCC" /></TouchableOpacity>
                        <Text style={styles.headerTitle}>Mesaj Kutusu</Text>
                    </View>

                </View>


                <View>

                    <ScrollView>
                        <FlatList
                            keyExtractor={this.keyExtractor}
                         
                            extraData={this.list}
                            data={this.list}
                            renderItem={this.renderItem}
                        />
                    </ScrollView>
                </View>


            </View>
        );
    }


};
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
