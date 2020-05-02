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
        this.setState({ balanceLogs: resultBalanceLog })



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
                    <Text style={{ fontSize: 20, fontFamily: 'airbnbCereal-medium', margin: 10, color: '#FFF' }}>Promosyon Kodu Kullan</Text>
                    <View style={{ borderColor: '#CCC', borderWidth: 1, padding: 10, margin: 10, marginBottom: 0, }}>
                        <TextInput style={{ color: '#FFF', borderColor: '#CCC' }} placeholder='Promosyon Kodu' onChangeText={(promotionCode) => this.setState({ promotionCode: promotionCode })} value={this.state.promotionCode}></TextInput>
                    </View>
                    <Button containerStyle={{ margin: 10 }} onPress={async () => {
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
                        <Text style={{ fontSize: 20, fontFamily: 'airbnbCereal-medium', margin: 10, color: '#FFF' }}>Geçmiş Harcamalar</Text>
                        <View style={{marginTop:10,borderBottomColor:'#555',borderBottomWidth:1,}}></View>
                        <View style={{marginTop:10,borderBottomColor:'#555',borderBottomWidth:1,}}>
                            {
                                this.state.balanceLogs.map((l, i) => (
                                    <View style={styles.logsItemContainer}>
                                        <View style={{ flexDirection: 'row', direction: 'inherit', margin: 5, }}>
                                            <View style={styles.logTextContainer}>
                                                <View style={styles.logsIconContainer}>
                                                    <Ionicons name='ios-time' size={18} color='#FFF' /></View>
                                                <Text style={styles.logText}>{l.formattedDate}</Text>
                                            </View>

                                            <View style={styles.logTextContainer}>
                                                <View style={styles.logsIconContainer}>
                                                    <Ionicons name='ios-cash' size={18} color='#FFF' /></View>
                                                <Text style={styles.logText}>Miktar : {l.amount}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', direction: 'inherit', margin: 5, }}>

                                            <View style={styles.logTextContainer}>
                                                <View style={styles.logsIconContainer}>
                                                    <Ionicons name={l.operation == 'increase' ? 'ios-add-circle' : 'ios-remove-circle'} size={18} color='#FFF' /></View>
                                                <Text style={styles.logText}>İşlem : {l.operation == 'increase' ? 'Yükleme' : 'Harcama'}</Text>
                                            </View>


                                            <View style={styles.logTextContainer}>
                                                <View style={styles.logsIconContainer}>
                                                    <Ionicons name='ios-wallet' size={18} color='#FFF' /></View>
                                                <Text style={styles.logText}>Kalan : {l.finishedBalance} TL</Text>
                                            </View>


                                        </View>

                                        {l.creditCard != null &&
                                            <View style={{ flexDirection: 'row', direction: 'inherit', margin: 5, }}>
                                                <View style={styles.logTextContainer}>
                                                    <View style={styles.logsIconContainer}>
                                                        <Ionicons name='ios-card' size={18} color='#FFF' /></View>
                                                    <Text style={styles.logText}>Kart Numarası : {l.creditCard}</Text>
                                                </View>
                                            </View>
                                        }
                                        {l.reason != null &&
                                            <View style={{ flexDirection: 'row', direction: 'inherit', margin: 5, }}>
                                                <View style={styles.logTextContainer}>
                                                    <View style={styles.logsIconContainer}>
                                                        <Ionicons name='ios-card' size={18} color='#FFF' /></View>
                                                    <Text style={styles.logText}>Açıklama : {l.reason}</Text>
                                                </View>
                                            </View>
                                        }



                                    </View>
                                ))}
                            {
                                this.state.balanceLogs.length < 1 && <Text style={{ fontSize: 15, fontFamily: 'airbnbCereal-light', margin: 10, color: '#FFF' }}>Geçmiş Harcamalar Bulunamadı</Text>

                            }
                        </View>
                    </View>
                </ScrollView>
            </View >
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
    logsItemContainer:{
        marginBottom:10,
        paddingBottom:10,
        borderBottomColor:'#555',
        borderBottomWidth:1,
         
    },
    logTextContainer: {
        backgroundColor: '#333',
        borderRadius: 20,
        padding:10,
        marginLeft: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    logText: {

        fontFamily: 'airbnbCereal-medium',
        color: '#EBEBEB',
        fontSize: 15,
        maxWidth:260,
        marginLeft:5,
    },
    logsIconContainer: {
        margin: 5
    },
});