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
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.userDetails = {};
    }

    state = {
        profileURL: config.serverUrl + 'UserProfile/getProfilePicture/default/default',
        pictureLoading: false,
    }
    static navigationOptions = ({ navigation }) => {
        return {
            header: () => null
        }
    }
    // get selection of image permission
    getPermissionAsync = async () => {
        if (Constants.platform.ios || Constants.platform.android) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    }
    _imageSelect = async () => {
        this.setState({ PictureLoading: true });
        const {
            cancelled,
            uri,
        } = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
        });
        if (!cancelled) {
            this.setState({ profileURL: uri });


            const manipResult = await ImageManipulator.manipulateAsync(
                this.state.profileURL,
                [{ resize: { width: 250 } }],
                { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
            );


          
            this.setState({ profileURL: manipResult.uri, PictureLoading: true });
        }
        else {
            this.setState({ PictureLoading: false });
        }
    }

    uploadImage = async (uri) => {
        this.setState({PictureLoading:true})
        var self = this;
        // const response = await fetch(uri);
        // const blob = await response.blob();
        const data = new FormData();
        data.append('photo', {
            uri: uri,
            type: 'image/jpeg', // or photo.type
            name: 'photo'
        });
       var uploadRequest = await fetch(config.apiURL + 'UserProfile/uploadProfilePhoto', {
            method: 'POST',
            body: data
        });
        var json = await uploadRequest.json();
        if(json.status == 'fail')
        {
            alert(json.message);
        }
        if(json.status == 'ok')
        {
            alert(json.message);
        }
        this.setState({PictureLoading:false})





        //     Alert.alert('Profil Fotoğrafı', 'Profil Fotoğrafınız Başarı İle Yüklendi.', [{ text: 'Tamam', onPress: () => console.log('Ask me later pressed') },], { cancelable: true });
        // });
    }





    async componentDidMount() {
        this.getPermissionAsync();
        this.props.navigation.setParams({ goBack: this.NavgoBack });
        this.userDetails = JSON.parse(await AsyncStorage.getItem('userDetails'));
        var profilePicture = await userRequest.getProfilePicture(this.userDetails.username, this.userDetails.userType);
        this.setState({ profileURL: profilePicture });


    }



    render() {

        return (
            <View style={styles.container}>

                <View style={{ height: 0, backgroundColor: '#2b3138' }}></View>
                <View style={styles.header}>
                    <View style={styles.headerContainer}>
                        <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => this.props.navigation.pop()}><Ionicons name="ios-arrow-back" size={35} color="#CCC" /></TouchableOpacity>
                        <Text style={styles.headerTitle}>Profil Fotoğrafı</Text>
                    </View>

                </View>


                <View>

                    <View style={{ height: Dimensions.get('window').height - 135, justifyContent: 'center' }}>
                        <View style={{ alignItems: 'center', marginTop: 10 }}>
                            <TouchableOpacity onPress={() => this._imageSelect()} >
                                {this.state.PictureLoading && <ActivityIndicator style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }} size={50} />}
                                <Avatar


                                    rounded={true}
                                    source={{
                                        uri: this.state.profileURL
                                    }}
                                    title={this.userDetails.firstName}
                                    size={Dimensions.get('window').width}
                                    showEditButton
                                    editButton={{ size: 50, iconStyle: { fontSize: 36 }, style: { margin: 30 }, color: '#FFF' }}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
                <View style={{ width: 100 + '%', height: 60 }}><Button buttonStyle={{ height: 60 }} titleStyle={{ fontSize: 20 }} onPress={()=>{  this.uploadImage(this.state.profileURL)}} title='Fotoğrafı Değiştir' /></View>

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
