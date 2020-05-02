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
        contentLoading:false,
        gelenKutusuList: [
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

    onRefresh = (async() => {
        this.setState({contentLoading:true});
        var gelenKutusu = await MesajController.getGelenKutusu();
        this.setState({ gelenKutusuList: gelenKutusu,contentLoading:false });


    });

    componentWillUnmount() {
        // Remove the event listener before removing the screen from the stack
        this.focusListener.remove();
    }



    async componentDidMount() {



        // Sayfaya her gelişinde yenilenmesini sağlıyor
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('didFocus', () => {
            this.onRefresh();
        });
        this.onRefresh();
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
        if (item.username != '') {
            return (
                <TouchableOpacity
                    onPress={async () => {

                       await MesajController.setReadAllMessages(item.username);
                        this.props.navigation.navigate('ChatScreen', { username: item.username, profilePicture: item.profilePicture, firstName: item.firstName, lastName: item.lastName, userType: item.userType })
                    }}
                >
                    <ListItem

                        containerStyle={styles.listItemContainer}
                        titleStyle={{ color: '#CCC' }}
                        subtitleStyle={{ color: '#CCC' }}

                        title={item.firstName + ' ' + item.lastName}
                        subtitle={item.lastSender == 'self' ? 'Siz : ' + item.lastMessage.message : item.lastMessage.message}
                        leftAvatar={{ source: { uri: item.profilePicture } }}
                        badge={item.unreadedCount > 0 ? { value: item.unreadedCount, textStyle: { color: '#111', fontWeight: 'bold' }, status: 'success', badgeStyle: { height: 25, width: 25, borderWidth: 0, borderRadius: 25 / 2, backgroundColor: '#00c853' } } : false}
                        chevron
                    />
                </TouchableOpacity>
            )
        }
        else {
            return (<View style={{ backgroundColor: '#333', height: 0.3 }}><Text></Text></View>)
        }
    }


    render() {

        return (
            <View style={styles.container}>
               
                <View style={{ height: 0, backgroundColor: '#2b3138' }}></View>
                <View style={styles.header}>
                    <View style={styles.headerContainer}>
                        <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => this.props.navigation.goBack()}><Ionicons name="ios-arrow-back" size={35} color="#CCC" /></TouchableOpacity>
                        <Text style={styles.headerTitle}>Mesaj Kutusu</Text>
                    </View>

                </View>


                <View>

                    <ScrollView>
                    {this.state.contentLoading == false &&
                        <FlatList
                            keyExtractor={this.keyExtractor}

                            extraData={this.state.gelenKutusuList}
                            data={this.state.gelenKutusuList}
                            renderItem={this.renderItem}
                        />}
                    </ScrollView>
                    {this.state.contentLoading && <ActivityIndicator size={25}/>}
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
