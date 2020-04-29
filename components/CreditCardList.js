import * as WebBrowser from 'expo-web-browser';
import React, { useRef } from "react";
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { MonoText } from '../components/StyledText';
import MapView from 'react-native-maps';
import { Divider, SearchBar, Avatar, ListItem, Button, Badge } from 'react-native-elements';
import * as Font from 'expo-font';
import * as CustomerSide_HomeController from '../Controller/CustomerSide_HomeController';
import { CreditCardInput, LiteCreditCardInput, } from 'react-native-credit-card-input';
import * as CreditCardController from '../Controller/CreditCardController';
import { FlatGrid } from 'react-native-super-grid';


export default class CreditCardComponent extends React.Component {
    constructor(props) {
        super(props);

    }



    async componentDidMount() {
        var creditCardList = await CreditCardController.getCreditCard()
        this.setState({ userCreditCardList: creditCardList });
        // .then((e) => {

        //     if (this.props.anasayfa)
        //     {
        //         this.setState({ userCards: e });
        //     }

        //     else
        //     this.setState({ userCards: e });


        // });


    }
    state = {
        modal2Values: [],
        modal2Value: 0,
        userCreditCardList: [
            {
                cardNumber: 4447547878901254,
                expireDate: '12/26',
                placeHolder: '',
                type: 'vsia'
            }
        ],
        Modal2Open: false,
        Modal1Open: false,
        deleteButtonLoading: false,
        form: {
            valid: null, // will be true once all fields are "valid" (time to enable the submit button)
            values: { // will be in the sanitized and formatted form
                number: "",
                expiry: "/19",
                cvc: "",
                type: "", // will be one of [null, "visa", "master-card", "american-express", "diners-club", "discover", "jcb", "unionpay", "maestro"]
                name: "",
                postalCode: "",
            },
            status: {  // will be one of ["incomplete", "invalid", and "valid"]
                number: "",
                expiry: "",
                cvc: "",
                name: "",
                postalCode: "",
            },
        }

    }



    _onChange = (formdata) => { this.setState({ form: formdata }); };
    render() {
        return (
            <View>
                <Modal animationType="slide"
                    transparent={true}
                    visible={this.state.Modal1Open}
                    animated={true}
                    animationType='slide'
                    onRequestClose={() => {

                    }}>

                    <View style={{ backgroundColor: '#000000b0', justifyContent: 'center', position: 'absolute', left: 0, top: 0, width: 100 + '%', height: 100 + '%', zIndex: 2 }}>

                        <View style={{ borderRadius: 3, padding: 20, backgroundColor: '#FFF', borderColor: '#CCC', borderWidth: 1, width: 99 + '%', height: Dimensions.get('screen').height - 100, alignSelf: 'center' }}>


                            {/* Close Button */}
                            <TouchableOpacity style={{ position: 'absolute', right: -2, top: -15, zIndex: 9999999999999999999, }} onPress={() => this.setState({ Modal1Open: false })}>
                                <Ionicons name="ios-close-circle" size={42} color="#333" />
                            </TouchableOpacity>

                            <View style={{ marginTop: 100 }}>
                                <CreditCardInput requiresName={true} onChange={this._onChange} />
                                <Button disabled={!this.state.form.valid} onPress={async () => {

                                    let result = await CreditCardController.addCreditCard(this.state.form)
                                    if (result) { this.setState({ Modal1Open: false }); this.componentDidMount() }

                                }} title='Ekle' containerStyle={{ marginTop: 40, width: 90 + '%', alignSelf: 'center' }} />
                            </View>
                        </View>
                    </View>


                </Modal>


                <Modal animationType="slide"
                    transparent={true}
                    visible={this.state.Modal2Open}
                    animated={true}
                    animationType='slide'
                    onRequestClose={() => {

                    }}>

                    <View style={{ backgroundColor: '#000000b0', justifyContent: 'center', position: 'absolute', left: 0, top: 0, width: 100 + '%', height: 100 + '%', zIndex: 2 }}>

                        <View style={{ borderRadius: 3, padding: 20, backgroundColor: '#FFF', borderColor: '#CCC', borderWidth: 1, width: 99 + '%', height: Dimensions.get('screen').height - 100, alignSelf: 'center' }}>


                            {/* Close Button */}
                            <TouchableOpacity style={{ position: 'absolute', right: -2, top: -15, zIndex: 9999999999999999999, }} onPress={() => this.setState({ Modal2Open: false })}>
                                <Ionicons name="ios-close-circle" size={42} color="#333" />
                            </TouchableOpacity>

                            <View style={{ marginTop: 100 }}>
                                <Image style={{ width: 120, height: 120, alignSelf: 'center', marginBottom: 20 }} source={require('../assets/images/creditcard.png')} />
                                <Text style={{ fontWeight: 'bold' }}>Kart Sahibinin İsmi : {this.state.modal2Values.placeHolder}</Text>
                                <Text style={{ fontWeight: 'bold' }}>Kart Numarası : {String(this.state.modal2Values.cardNumber).substr(0, 4)} {String(this.state.modal2Values.cardNumber).substr(4, 4)} {String(this.state.modal2Values.cardNumber).substr(8, 4)} {String(this.state.modal2Values.cardNumber).substr(12, 4)}</Text>
                                <Text style={{ fontWeight: 'bold' }}>Kart Geçerlilik Tarihi : {this.state.modal2Values.expireDate}</Text>
                                <Text style={{ fontWeight: 'bold' }}>Kart CVC : {String(this.state.modal2Values.cc).substr(0, 1)}**</Text>

                                <Button loading={this.state.deleteButtonLoading} onPress={async () => {
                                    let result = await CreditCardController.deleteCreditCard(this.state.modal2Values.cardNumber);
                                    if (result) { this.setState({ modal2Values: {}, Modal2Open: false }); this.componentDidMount() }
                                    //CreditCardController.deleteCreditCard(this.state.modal2Value).then((e) => { this.setState({ deleteButtonLoading: true }); if (e == 'silindi') { this.setState({ Modal1Open: false, Modal2Open: false }); this.componentDidMount() } })
                                }
                                }
                                    title='Kartı Sil' containerStyle={{ marginTop: 40, width: 90 + '%', alignSelf: 'center' }} />
                            </View>
                        </View>
                    </View>


                </Modal>




                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 100 + '%' }}>

                    {this.state.userCreditCardList.length > 0 && <FlatGrid
                        items={this.state.userCreditCardList}
                        extraData={this.state.userCreditCardList}
                        renderItem={({ item, index }) => {
                            if (!this.props.anasayfa) {
                                return (
                                    <TouchableOpacity onPress={() => { this.setState({ modal2Value: index, modal2Values: this.state.userCreditCardList[index], Modal2Open: true }); }} style={{ width: 100 + '%', marginBottom: 10, padding: 8, backgroundColor: '#FFF', backgroundColor: '#DD4B4E', borderRadius: 4, borderColor: 'red', borderWidth: 1, justifyContent: 'center' }}>
                                        <Text style={{ color: '#FFF', fontFamily: 'airbnbCereal-medium', fontSize: 17, textAlign: 'center', marginBottom: 7 }}>{item.placeHolder.toUpperCase()}</Text>
                                        <Image style={{ width: 50, height: 50, alignSelf: 'center' }} source={require('../assets/images/creditcard.png')} />
                                        <Text style={{ fontFamily: 'airbnbCereal-light', marginTop: 5, fontSize: 15, color: '#EBEBEB', textAlign: 'center', marginTop: 10 }}>{String(item.cardNumber).substr(0, 4)} **** **** {String(item.cardNumber).substr(String(item.cardNumber).length - 4, 4)}</Text>
                                        <Text style={{ fontFamily: 'airbnbCereal-light', marginTop: 5, fontSize: 15, color: '#EBEBEB', textAlign: 'center', marginBottom: 5 }}>{item.expireDate}</Text>
                                    </TouchableOpacity>

                                )
                            }

                        }}
                    />
                    }

                    {this.state.userCreditCardList.length < 1 &&
                        <TouchableOpacity style={{ width: 50 + '%', marginBottom: 10, marginTop: -7, marginLeft: 1 + '%', padding: 8, backgroundColor: '#FFF', backgroundColor: '#DD4B4E', borderRadius: 4, borderColor: 'red', borderWidth: 1, justifyContent: 'center' }}>
                            <Text style={{ color: '#FFF', fontFamily: 'airbnbCereal-medium', fontSize: 17, textAlign: 'center', marginBottom: 7 }}>Kart Eklenmemiş</Text>
                            <Image style={{ width: 70, height: 70, alignSelf: 'center' }} source={require('../assets/images/creditcard.png')} />
                            <Text style={{ fontFamily: 'airbnbCereal-light', marginTop: 5, fontSize: 16, color: '#EBEBEB', textAlign: 'center', marginTop: 10, marginBottom: 5 }}>Tanımlı kredi kartı yok</Text>
                        </TouchableOpacity>
                    }

                    {this.props.anasayfa &&

                        
                       <TouchableOpacity style={{ height:150,width: 48 + '%', marginBottom: 10, marginTop: -7, marginLeft: 1 + '%', padding: 8, backgroundColor: '#FFF', backgroundColor: '#DD4B4E', borderRadius: 4, borderColor: 'red', borderWidth: 1, justifyContent: 'center' }} onPress={() => { this.setState({ modal2Value: 0, modal2Values: this.state.userCreditCardList[0], Modal2Open: true }); }}>
                            <Text style={{ color: '#FFF', fontFamily: 'airbnbCereal-medium', fontSize: 17, textAlign: 'center', marginBottom: 7 }}>{this.state.userCreditCardList[0].placeHolder.toUpperCase()}</Text>
                            <Image style={{ width: 50, height: 50, alignSelf: 'center' }} source={require('../assets/images/creditcard.png')} />
                            <Text style={{ fontFamily: 'airbnbCereal-light', marginTop: 5, fontSize: 15, color: '#EBEBEB', textAlign: 'center', marginTop: 10 }}>{String(this.state.userCreditCardList[0].cardNumber).substr(0, 4)} **** **** {String(this.state.userCreditCardList[0].cardNumber).substr(String(this.state.userCreditCardList[0].cardNumber).length - 4, 4)}</Text>
                            <Text style={{ fontFamily: 'airbnbCereal-light', marginTop: 5, fontSize: 15, color: '#EBEBEB', textAlign: 'center', marginBottom: 5 }}>{this.state.userCreditCardList[0].expireDate}</Text>
                        </TouchableOpacity>

                    }


                    {this.props.anasayfa &&


                        <TouchableOpacity onPress={() => this.setState({ Modal1Open: true })} style={{ marginLeft: 5, width: 45 + '%', marginBottom: 10, height: 150, marginRight: 3 + '%', padding: 8, backgroundColor: '#FFF', marginTop: -10, backgroundColor: '#CCC', borderRadius: 4, justifyContent: 'center' }}>
                            <Text style={{ color: '#1E1324', fontFamily: 'airbnbCereal-medium', fontSize: 17, textAlign: 'center', marginBottom: 7 }}>Kart Ekle</Text>
                            <Ionicons name="ios-add-circle" size={50} color="#1E1324" style={{ marginRight: 5, alignSelf: 'center' }} />
                        </TouchableOpacity>

                    }




                </View>


                {!this.props.anasayfa &&

                    <TouchableOpacity onPress={() => this.setState({ Modal1Open: true })} style={{ marginLeft: 12, width: 45 + '%', marginBottom: 10, height: 150, marginRight: 1 + '%', padding: 8, backgroundColor: '#FFF', backgroundColor: '#CCC', borderRadius: 4, justifyContent: 'center' }}>
                        <Text style={{ color: '#1E1324', fontFamily: 'airbnbCereal-medium', fontSize: 17, textAlign: 'center', marginBottom: 7 }}>Kart Ekle</Text>
                        <Ionicons name="ios-add-circle" size={50} color="#1E1324" style={{ marginRight: 5, alignSelf: 'center' }} />
                    </TouchableOpacity>
                }

            </View>

        )
    };
}