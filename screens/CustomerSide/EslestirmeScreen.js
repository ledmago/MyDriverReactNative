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
    TextInput,
    RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { MonoText } from '../../components/StyledText';
import MapView from 'react-native-maps';
import { Divider, SearchBar, Avatar, ListItem, Button, Badge } from 'react-native-elements';
import * as Font from 'expo-font';
import * as EslestirmeController from '../../Controller/EslestirmeController';
import EslestirmeComponent from '../../components/Eslestirme';


export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props);

    }

    state = {
        refreshing:false,
    };

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




    onRefresh = () =>{
        this.setState({refreshing:true});
       this.EslestirmeComponent.componentDidMount();
       this.setState({refreshing:false});
    }
    
    componentDidMount() {
        this.props.navigation.setParams({ goBack: this.NavgoBack });
    }
    NavgoBack = () => {
        this.props.navigation.navigate('Main')
    };

    render() {
        return (
            <ScrollView style={{ padding: 10,backgroundColor:'#333' }}
              refreshControl={
                <RefreshControl refreshing={this.state.refreshing} onRefresh={()=>this.onRefresh()} />
                }>                 
              <EslestirmeComponent ref={(EslestirmeComponent) => this.EslestirmeComponent = EslestirmeComponent} propsNav={this.props.navigation}></EslestirmeComponent>
            </ScrollView>

        )
    };
}