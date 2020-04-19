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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { MonoText } from '../../components/StyledText';
import MapView from 'react-native-maps';
import { Divider, SearchBar, Avatar, ListItem, Button, Badge } from 'react-native-elements';
import * as Font from 'expo-font';
import * as BalanceController from '../../Controller/BalanceController';


export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props);

    }

    state = {
        promotionCode: '',
        balanceLogs:[],
    };

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Bakiye İşlemleri',
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





    
    componentDidMount() {
        this.props.navigation.setParams({ goBack: this.NavgoBack });
        //BalanceController.addLogs({cardNumber:'1516',date:'5105',amount:'51515'})
        BalanceController.getLogDetails()
        .then((e)=>{
            if(e != 'error')
            this.setState({balanceLogs:e})
    
    });


    }
    NavgoBack = () => {
        this.props.navigation.navigate('Main')
    };

    render() {
        return (
            <ScrollView style={{ padding: 10 }}>
                <Text style={{fontSize:20, fontFamily: 'airbnbCereal-medium',margin:10}}>Promosyon Kodu Kullan</Text>
                <View style={{ borderColor: '#CCC', borderWidth: 1, padding: 10,margin:10,marginBottom:0, }}>
                    <TextInput placeholder='Promosyon Kodu' onChangeText={(promotionCode) => this.setState({ promotionCode:promotionCode })} value={this.state.promotionCode}></TextInput>
                </View>
                <Button containerStyle={{margin:10}} onPress={()=>BalanceController.usePromotionCode(this.state.promotionCode)} title='Kullan'></Button>
                
                <View>
                <Text style={{fontSize:20, fontFamily: 'airbnbCereal-medium',margin:10}}>Geçmiş Harcamalar</Text>
                {
                    this.state.balanceLogs.map((l,i)=>(
                    <View style={{flexDirection:'row',margin:5,}}>
                        <Text style={{backgroundColor:'#FFC541',fontFamily: 'airbnbCereal-medium',borderRadius:20,padding:5,color:'#EBEBEB',fontSize:15}}>{l.date}</Text>
                        <Text style={{backgroundColor:'#37b337',fontFamily: 'airbnbCereal-medium',borderRadius:20,padding:5,color:'#EBEBEB',fontSize:15,marginLeft:10}}>{l.amount}</Text>
                        <Text style={{backgroundColor:'#DD4B4E',fontFamily: 'airbnbCereal-medium',borderRadius:20,padding:5,color:'#EBEBEB',fontSize:15,marginLeft:10}}>{l.cardNumber}</Text>
                        </View>
                ))}
                {
                    this.state.balanceLogs.length < 1 && <Text style={{fontSize:15, fontFamily: 'airbnbCereal-light',margin:10}}>Geçmiş Harcamalar Bulunamadı</Text>

                    }
                </View>
            </ScrollView>

        )
    };
}