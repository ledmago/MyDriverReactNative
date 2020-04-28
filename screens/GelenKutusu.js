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
import * as MesajController from '../Controller/MesajController';
import CreditCardComponent from '../components/CreditCardList';
import firebase from '../components/Firebase';
import { ListItem } from 'react-native-elements';

export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props);

    }
    state = {
       gelenKutusuList:[
           {
            
                username: '',
                unreadedCount: 0
            
           }
       ],
    }
    
   

   

  

    list = [
        {
            name: '',
            avatar_url: '',
            subtitle: ''
        },
      

    ];



    async componentDidMount() {
        var gelenKutusu = await MesajController.getGelenKutusu();
       this.setState({gelenKutusuList:gelenKutusu});

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
            <TouchableOpacity 
            // onPress={async()=>{await AsyncStorage.removeItem('ChatID').then(async () => { await AsyncStorage.setItem('ChatID', '' + item.username).then(() => { this.props.navigation.navigate('ChatScreen') }) }) }}
            >
                <ListItem
                    containerStyle={styles.listItemContainer}
                    titleStyle={{ color: '#CCC' }}
                    subtitleStyle={{ color: '#CCC' }}
        
                    title={item.username}
                    subtitle={item.unreadedCount}
                    // leftAvatar={{ source: { uri: item.avatar_url } }}
        
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
                         
                            extraData={this.state.gelenKutusuList}
                            data={this.state.gelenKutusuList}
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
