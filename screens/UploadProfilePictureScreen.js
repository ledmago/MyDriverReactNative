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
import config from '../config.json';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { MonoText } from '../components/StyledText';
import { Divider, SearchBar, Avatar, Button, Badge } from 'react-native-elements';
import * as Font from 'expo-font';
import * as userRequest from '../Controller/UserRequest';

export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.userDetails = {};
    }

    state = {
        profileURL: config.serverUrl + 'UserProfile/getProfilePicture/default/default',
    }
    static navigationOptions = ({ navigation }) => {
        return {
            header: () => null
        }
    }

    async componentDidMount() {
        this.userDetails = JSON.parse(await AsyncStorage.getItem('userDetails'));
        var profilePicture = await userRequest.getProfilePicture(this.userDetails.username, this.userDetails.userType);
        console.log(profilePicture.url);
        this.setState({ profileURL: profilePicture })
        this.props.navigation.setParams({ goBack: this.NavgoBack });

    }



    render() {

        return (
            <View style={styles.container}>

                <View style={{ height: 0, backgroundColor: '#2b3138' }}></View>
                <View style={styles.header}>
                    <View style={styles.headerContainer}>
                        <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => this.props.navigation.navigate('Home')}><Ionicons name="ios-arrow-back" size={35} color="#CCC" /></TouchableOpacity>
                        <Text style={styles.headerTitle}>Profil Fotoğrafı</Text>
                    </View>

                </View>


                <View>

                    <View style={{ height: Dimensions.get('window').height - 135, justifyContent: 'center' }}>
                        <View style={{ alignItems: 'center', marginTop: 10 }}>
                            <TouchableOpacity><Avatar


                                rounded={false}
                                source={{
                                    uri: this.state.profileURL
                                }}
                                title={this.userDetails.firstName}
                                size={Dimensions.get('window').width}
                                showEditButton
                                editButton={{size:50,iconStyle:{fontSize:36},style:{margin:10},color:'#FFF'}}
                            />
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
                <View style={{ width: 100 + '%', height: 60 }}><Button buttonStyle={{ height: 60 }} titleStyle={{ fontSize: 20 }} title='Fotoğrafı Değiştir' /></View>

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
