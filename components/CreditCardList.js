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



    componentDidMount() {
        CreditCardController.getCreditCard().then((e) => {

            if (this.props.anasayfa)
            {
                this.setState({ userCards: e });
            }
                
            else
            this.setState({ userCards: e });


        });


    }
    state = {
        modal2Values: [],
        modal2Value: 0,
        userCards: [],
        Modal2Open: false,
        Modal1Open: false,
        deleteButtonLoading:false,
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
                                <Button disabled={!this.state.form.valid} onPress={() => CreditCardController.addCreditCard(this.state.form).then((e) => { if (e == 'eklendi') { this.setState({ Modal1Open: false }); this.componentDidMount()} })} title='Ekle' containerStyle={{ marginTop: 40, width: 90 + '%', alignSelf: 'center' }} />
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

                                <Text>Kart Sahibinin İsmi : {this.state.modal2Values.name}</Text>
                                <Text>Kart Numarası : {this.state.modal2Values.number}</Text>
                                <Text>Kart Geçerlilik Tarihi : {this.state.modal2Values.expiry}</Text>
                                <Text>Kart CVC : {this.state.modal2Values.cvc}</Text>

                                <Button loading={this.state.deleteButtonLoading} onPress={() => CreditCardController.deleteCreditCard(this.state.modal2Value).then((e) => {this.setState({deleteButtonLoading:true}); if (e == 'silindi') { this.setState({ Modal1Open: false,Modal2Open:false });this.componentDidMount() } })} title='Kartı Sil' containerStyle={{ marginTop: 40, width: 90 + '%', alignSelf: 'center' }} />
                            </View>
                        </View>
                    </View>


                </Modal>




                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 100 + '%' }}>

                    {this.state.userCards.length > 0 && <FlatGrid
                        items={this.state.userCards}
                        extraData={this.state.userCards}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity onPress={() => { this.setState({ modal2Value: index, modal2Values: this.state.userCards[0], Modal2Open: true }); }} style={{ width: 100 + '%', marginBottom: 10, marginRight: 1 + '%', padding: 8, backgroundColor: '#FFF', backgroundColor: '#DD4B4E', borderRadius: 4, borderColor: 'red', borderWidth: 1, justifyContent: 'center' }}>
                                <Text style={{ color: '#FFF', fontFamily: 'airbnbCereal-medium', fontSize: 17, textAlign: 'center', marginBottom: 7 }}>{item.type.toUpperCase()} ({item.expiry})</Text>
                                <Image style={{ width: 70, height: 70, alignSelf: 'center' }} source={require('../assets/images/creditcard.png')} />
                                <Text style={{ fontFamily: 'airbnbCereal-light', marginTop: 5, fontSize: 16, color: '#EBEBEB', textAlign: 'center', marginTop: 10, marginBottom: 5 }}>{item.number.substr(0, 4)} **** **** {item.number.substr(item.number.length - 4, 4)}</Text>
                            </TouchableOpacity>

                        )}
                    />
                    }

                    {this.state.userCards.length < 1 &&
                        <TouchableOpacity onPress={() => { this.setState({ modal2Value: index, modal2Values: this.state.userCards[0], Modal2Open: true }); }} style={{ width: 50 + '%', marginBottom: 10, marginTop: -7, marginLeft: 1 + '%', padding: 8, backgroundColor: '#FFF', backgroundColor: '#DD4B4E', borderRadius: 4, borderColor: 'red', borderWidth: 1, justifyContent: 'center' }}>
                            <Text style={{ color: '#FFF', fontFamily: 'airbnbCereal-medium', fontSize: 17, textAlign: 'center', marginBottom: 7 }}>Kart Eklenmemiş</Text>
                            <Image style={{ width: 70, height: 70, alignSelf: 'center' }} source={require('../assets/images/creditcard.png')} />
                            <Text style={{ fontFamily: 'airbnbCereal-light', marginTop: 5, fontSize: 16, color: '#EBEBEB', textAlign: 'center', marginTop: 10, marginBottom: 5 }}>Tanımlı kredi kartı yok</Text>
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