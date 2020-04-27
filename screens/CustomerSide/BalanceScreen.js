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
        balanceLogs: [],
    };

    static navigationOptions = ({ navigation }) => {
        return {
          header: () => null
        }
      }
    




   async componentDidMount() {
        this.props.navigation.setParams({ goBack: this.NavgoBack });
        //BalanceController.addLogs({cardNumber:'1516',date:'5105',amount:'51515'})
       var resultBalanceLog = await BalanceController.getLogDetails();
       this.setState({balanceLogs:resultBalanceLog})
           


    }
    NavgoBack = () => {
        this.props.navigation.navigate('Main')
    };

    render() {
        return (
        <View style={styles.container}>
            <View style={styles.header}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => this.props.navigation.pop()}><Ionicons name="ios-arrow-back" size={35} color="#CCC" /></TouchableOpacity>
                <Text style={styles.headerTitle}>Bakiye İşlemleri</Text>
            </View>

        </View>
            <ScrollView style={{ padding: 10 }}>
                <Text style={{ fontSize: 20, fontFamily: 'airbnbCereal-medium', margin: 10,color:'#FFF' }}>Promosyon Kodu Kullan</Text>
                <View style={{ borderColor: '#CCC', borderWidth: 1, padding: 10, margin: 10, marginBottom: 0, }}>
                    <TextInput style={{color:'#FFF',borderColor:'#CCC'}} placeholder='Promosyon Kodu' onChangeText={(promotionCode) => this.setState({ promotionCode: promotionCode })} value={this.state.promotionCode}></TextInput>
                </View>
                <Button containerStyle={{ margin: 10 }} onPress={async() => {
                    let response = await BalanceController.usePromotionCode(this.state.promotionCode);
                    if (response) {
                        
                        this.props.navigation.pop();
                    }
                    else {
                            alert('Promosyon Kodu Geçersiz')
                    }
                }
                }

                    title='Kullan'></Button>

                <View>
                    <Text style={{ fontSize: 20, fontFamily: 'airbnbCereal-medium', margin: 10,color:'#FFF' }}>Geçmiş Harcamalar</Text>
                    {
                        this.state.balanceLogs.map((l, i) => (
                            <View style={{ flexDirection: 'row', margin: 5, }}>
                                <Text style={{ backgroundColor: '#FFC541', fontFamily: 'airbnbCereal-medium', borderRadius: 20, padding: 5, color: '#EBEBEB', fontSize: 15 }}>{l.date}</Text>
                                <Text style={{ backgroundColor: '#37b337', fontFamily: 'airbnbCereal-medium', borderRadius: 20, padding: 5, color: '#EBEBEB', fontSize: 15, marginLeft: 10 }}>{l.amount}</Text>
                                <Text style={{ backgroundColor: '#DD4B4E', fontFamily: 'airbnbCereal-medium', borderRadius: 20, padding: 5, color: '#EBEBEB', fontSize: 15, marginLeft: 10 }}>{l.cardNumber}</Text>
                                <Text style={{ backgroundColor: '#DD4B4E', fontFamily: 'airbnbCereal-medium', borderRadius: 20, padding: 5, color: '#EBEBEB', fontSize: 15, marginLeft: 10 }}>{l.operation == 'increase'?'+':'-'}</Text>
                                <Text style={{ backgroundColor: '#DD4B4E', fontFamily: 'airbnbCereal-medium', borderRadius: 20, padding: 5, color: '#EBEBEB', fontSize: 15, marginLeft: 10 }}>{l.finishedBalance}</Text>
                            </View>
                        ))}
                    {
                        this.state.balanceLogs.length < 1 && <Text style={{ fontSize: 15, fontFamily: 'airbnbCereal-light', margin: 10 ,color:'#FFF'}}>Geçmiş Harcamalar Bulunamadı</Text>

                    }
                </View>
            </ScrollView>
            </View>
        )
    };
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#161a1e',

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
});