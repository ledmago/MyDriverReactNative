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
    TextInput,
    KeyboardAvoidingView,
    StatusBar,
    ImageBackground,
    Picker,
    PickerIOS,
    ActivityIndicator,
} from 'react-native';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { Button, CheckBox } from 'react-native-elements';
import * as RegisterDriverController from '../../Controller/RegisterDriverController';
import { MonoText } from '../../components/StyledText';
import Sozlesme from '../../components/sozlesme';
import PhoneInput from 'react-native-phone-input';
import aracOBJ from '../../Controller/CarModels';

class RegisterDriverScreen extends React.Component {
    constructor(props) {
        super(props);

    }
    state = {
        username:'',
        name: '',
        lastName : '',
        gender: '',
        email: '',
        password: '',
        btnLoading: false,
        sozlesme: false,
        sozlesmeOpen: false,
        phoneNumber: '+90',
        page: 1,
        aracMarka: '0',
        aracModel: '0',
        surucuBelgesi: '0',
        phoneNumbers:'',
        aracModelYili:'',
        aracPlaka:'',
        aracRenk:'',

    };

   





    // HeaderBar'ı Kapat
    static navigationOptions = ({ navigation }) => {
        return {
            header: () => null
        }
    }
    _submit = () => {
   

            this.setState({ btnLoading: true })

          var aracMarkasi = aracOBJ[this.state.aracMarka].brand;
          var aracModeli = aracOBJ[this.state.aracMarka].models[this.state.aracModel].title;


                RegisterDriverController.MakeRegister(this.state.username,this.state.name,this.state.lastName, this.state.email, this.state.password, this.state.gender, this.state.sozlesme, this.state.phoneNumbers,aracMarkasi ,aracModeli,this.state.surucuBelgesi,this.state.aracModelYili,this.state.aracPlaka,this.state.aracRenk).then(() => {
                     setTimeout(() => { this.setState({ btnLoading: false }) }, 1000)
                 });

            
           

        



    }

    componentDidMount() {
        RegisterDriverController.Initial(this.props);
        // this.phone.selectCountry('TUR')
    }
    render() {

        return (
            <ImageBackground style={styles.container} resizeMode='cover'
                blurRadius={0}
                height={100} source={require('../../assets/images/background4.jpg')} >

                {this.state.sozlesmeOpen &&
                    <View style={{ backgroundColor: '#000000b0', justifyContent: 'center', position: 'absolute', left: 0, top: 0, width: 100 + '%', height: 100 + '%', zIndex: 2 }}>

                        <View style={{ borderRadius: 3, backgroundColor: '#FFF', borderColor: '#CCC', borderWidth: 1, width: 85 + '%', height: 70 + '%', alignSelf: 'center' }}>
                            <TouchableOpacity style={{ position: 'absolute', right: -10, top: -5, zIndex: 99999, }} onPress={() => this.setState({ sozlesmeOpen: false })}>
                                <Ionicons name="ios-close-circle" size={37} color="#333" />
                            </TouchableOpacity>


                            <ScrollView>
                                <Sozlesme />
                            </ScrollView>
                        </View>

                    </View>
                }


                <View style={styles.backgroundCover}>
                    <View style={styles.lineDivisor}></View>
                    <StatusBar barStyle="light-content" />
                    <KeyboardAvoidingView behavior="padding" style={styles.form}>
                        <View style={styles.formArea}>
                            <View>
                                <Image style={{ width: 80 + '%', height: 100, marginBottom: 70, alignSelf: 'center', marginTop: -50 }} source={require('../../assets/images/logo.png')}></Image>
                            </View>


                            <View style={{ width: 85 + '%', height: 50, marginBottom: 15, alignSelf: 'center' }}>
                            <View style={{alignSelf:'center', justifyContent:'center', paddingTop: 5, backgroundColor: '#444', paddingHorizontal: 20, height: 50, borderRadius: 4 }}>

            <Text style={{color:'#FFF',fontSize:15,fontFamily: 'airbnbCereal-medium'}}>{this.state.page == 1?'Kişisel Bilgileriniz':'Araç Bilgileri'}</Text>
                            </View>
                                <TouchableOpacity disabled={this.state.page == 1} onPress={() => { this.setState({ page: this.state.page - 1 }) }} style={{ position: 'absolute', left: 0, paddingTop: 5, backgroundColor: '#444', paddingHorizontal: 20, height: 50, borderRadius: 4 }}><Ionicons name="ios-arrow-back" size={37} color="#FFF" /></TouchableOpacity>
                                <TouchableOpacity disabled={this.state.page == 2} onPress={() => { this.setState({ page: this.state.page + 1 }) }} style={{ position: 'absolute', right: 0, paddingTop: 5, backgroundColor: '#444', paddingHorizontal: 20, height: 50, borderRadius: 4 }}><Ionicons name="ios-arrow-forward" size={37} color="#FFF" /></TouchableOpacity>
                            </View>

                            {this.state.page == 1 &&

                                <View>
                                    <TextInput
                                        placeholderTextColor={'#CCC'}
                                        style={styles.input}
                                        value={this.state.username}
                                        onChangeText={username => this.setState({ username })}
                                        placeholder="Kullanıcı Adı"
                                        autoCorrect={false}
                                        returnKeyType='none'
                                        onSubmitEditing={this._submit}
                                        blurOnSubmit={true}
                                    />
                                     <TextInput
                                        placeholderTextColor={'#CCC'}
                                        style={styles.input}
                                        value={this.state.name}
                                        onChangeText={name => this.setState({ name })}
                                        placeholder="Adınız"
                                        autoCorrect={false}
                                        returnKeyType='none'
                                        onSubmitEditing={this._submit}
                                        blurOnSubmit={true}
                                    />
                                     <TextInput
                                        placeholderTextColor={'#CCC'}
                                        style={styles.input}
                                        value={this.state.lastName}
                                        onChangeText={lastName => this.setState({ lastName })}
                                        placeholder="Soyadınız"
                                        autoCorrect={false}
                                        returnKeyType='none'
                                        onSubmitEditing={this._submit}
                                        blurOnSubmit={true}
                                    />
                                    <View style={styles.input}
                                    >
                                        <PhoneInput
                                            confirmText='Seç'
                                            cancelText='Vazgeç'
                                            initialCountry='tr'
                                            ref={ref => {
                                                this.phone = ref;
                                            }}
                                            
                                            value={this.state.phoneNumber}
                                            onChangePhoneNumber={(phoneNumber) => this.setState({phoneNumber})}
                                            onSelectCountry={() => {
                                                this.setState({ phoneNumber: '+' + this.phone.getCountryCode() })
                                            }}
                                            style={{ height: 30 }}
                                            textProps={{ placeholder: 'Telefon Numaranız' }}
                                        />
                                    </View>

                                    <TextInput
                                        placeholderTextColor={'#CCC'}
                                        style={styles.input}
                                        value={this.state.email}
                                        onChangeText={email => this.setState({ email })}
                                        ref={ref => { this._emailInput = ref }}
                                        placeholder="Email Adresi"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        keyboardType="email-address"
                                        returnKeyType="send"
                                        onSubmitEditing={this._submit}
                                        blurOnSubmit={true}

                                    />
                                    <TextInput
                                        placeholderTextColor={'#CCC'}
                                        style={styles.input}
                                        value={this.state.password}
                                        onChangeText={password => this.setState({ password })}
                                        placeholder="Şifre"
                                        secureTextEntry={true}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        returnKeyType="send"
                                        onSubmitEditing={this._submit}
                                        blurOnSubmit={true}
                                    />
                                    <View style={styles.picker}>
                                        <Picker
                                            selectedValue={this.state.gender}
                                            style={{ height: 50, width: 85 + '%', textAlign: 'center', opacity: 0.8, borderColor: '#CCC', alignSelf: 'center', backgroundColor: '#FFF' }}
                                            onValueChange={(itemValue, itemIndex) => {
                                                if (itemValue != 0) { this.setState({ gender: itemValue }) }

                                            }
                                            }>
                                            <Picker.Item label="Cinsiyet" value="0" />
                                            <Picker.Item label="Erkek" value="male" />
                                            <Picker.Item label="Kadın" value="female" />
                                        </Picker>

                                    </View>

                                </View>


                            }

                            {this.state.page == 2 &&

                                <View>

                                    <Picker
                                        selectedValue={this.state.aracMarka}
                                        style={{ height: 50, width: 85 + '%', textAlign: 'center', opacity: 0.8, borderColor: '#CCC', alignSelf: 'center', backgroundColor: '#FFF' }}
                                        onValueChange={(itemValue, itemIndex) => {
                                            this.setState({ aracMarka: itemValue })
                                        }
                                        }>
                                        <Picker.Item label="Aracınızın Markası" value="0" />
                                        {aracOBJ.map((l, i) => {

                                            return (<Picker.Item label={l.brand} value={i} />)
                                        })}


                                    </Picker>

                                    <Picker
                                        selectedValue={this.state.aracModel}
                                        style={{ height: 50, width: 85 + '%', textAlign: 'center', opacity: 0.8, borderColor: '#CCC', alignSelf: 'center', backgroundColor: '#FFF' }}
                                        onValueChange={(itemValue, itemIndex) => {
                                            this.setState({ aracModel: itemValue })
                                        }
                                        }>
                                        <Picker.Item label="Aracınızın Modeli" value="0" />
                                        {aracOBJ[this.state.aracMarka].models.map((l, i) => {

                                            return (<Picker.Item label={l.title} value={i} />)
                                        })}


                                    </Picker>

                                    <TextInput
                                        placeholderTextColor={'#CCC'}
                                        style={styles.input}
                                        value={this.state.aracModelYili}
                                        onChangeText={aracModelYili => this.setState({ aracModelYili })}
                                        placeholder="Araç Model Yılı"
                                        autoCorrect={false}
                                        keyboardType='name-phone-pad'
                                        returnKeyType='none'
                                        onSubmitEditing={this._submit}
                                        blurOnSubmit={true}
                                    />

                                    <TextInput
                                        placeholderTextColor={'#CCC'}
                                        style={styles.input}
                                        value={this.state.aracPlaka}
                                        onChangeText={aracPlaka => this.setState({ aracPlaka })}
                                        placeholder="Araç Plakası"
                                        autoCorrect={false}
                                        keyboardType='name-phone-pad'
                                        returnKeyType='none'
                                        onSubmitEditing={this._submit}
                                        blurOnSubmit={true}
                                    />
                                        <TextInput
                                        placeholderTextColor={'#CCC'}
                                        style={styles.input}
                                        value={this.state.aracRenk}
                                        onChangeText={aracRenk => this.setState({ aracRenk })}
                                        placeholder="Araç Rengi"
                                        autoCorrect={false}
                                        keyboardType='name-phone-pad'
                                        returnKeyType='none'
                                        onSubmitEditing={this._submit}
                                        blurOnSubmit={true}
                                    />

                                    <View style={styles.picker}>
                                        <Picker
                                            selectedValue={this.state.surucuBelgesi}
                                            style={{ height: 50, width: 85 + '%', textAlign: 'center', opacity: 0.8, borderColor: '#CCC', alignSelf: 'center', backgroundColor: '#FFF' }}
                                            onValueChange={(itemValue, itemIndex) => {
                                                this.setState({ surucuBelgesi: itemValue })

                                            }
                                            }>
                                            <Picker.Item label="Sürücü Belgeniz" value="0" />
                                            <Picker.Item label="Var" value="var" />
                                            <Picker.Item label="Yok" value="yok" />
                                        </Picker>
                                        <CheckBox
                                            center
                                            title='Kullanıcı Sözleşmesini Okudum'
                                            containerStyle={{ width: 85 + '%', alignSelf: 'center' }}
                                            checked={this.state.sozlesme}
                                            onPress={() => this.setState({ sozlesme: !this.state.sozlesme })}
                                        />
                                    </View>

                                </View>


                            }






                            <Button title={this.state.page == 2 ? 'Kayıt Ol' : 'Devam Et'} loading={this.state.btnLoading} buttonStyle={{ height: 50, borderRadius: 1, backgroundColor: '#444' }} containerStyle={{ marginTop: 20, width: 85 + '%', alignSelf: 'center', }} onPress={()=>{

                                if(this.state.page == 1)
                                {   
                                    if(this.phone.isValidNumber()){
                                        var nextPage = this.state.page + 1;
                                    this.setState({page:nextPage,phoneNumbers:this.phone.getValue()});
                                    
                                    }
                                    else {
                                        alert('Geçerli Bir Telefon Numarası Girin');
                                        this.setState({ btnLoading: false })
                                    }
                                    

                                }
                                else{
                                    this._submit();
                                }
                            }} />
                            <View style={styles.forgetPassowrd}>

                                <TouchableOpacity style={{ alignItems: 'center', width: 100 + '%', }} onPress={() => this.setState({ sozlesmeOpen: true })}><Text style={{ color: '#444', textAlign: 'center', fontSize: 16 }}>Kullanıcı Sözleşmesi</Text></TouchableOpacity>
                            </View>
                        </View>


                    </KeyboardAvoidingView>
                    <View style={{ backgroundColor: '#222', opacity: 0.7, padding: 5, alignItems: 'center' }}><Text style={{ color: '#EBEBEB', fontSize: 13, }}>Tüm Hakları Saklıdır - Copyright © 2019</Text></View>
                </View>
            </ImageBackground>
        )


    }

}
var styles = StyleSheet.create({
    forgetPassowrd:
    {
        alignSelf: 'center',
        marginTop: 10,
        flexDirection: 'row',
        width: 75 + '%',
    },
    backgroundCover:
    {
        backgroundColor: '#000000b0',

        flex: 1
    },
    formArea: {
        paddingTop: 50,
        justifyContent: 'center',
        flex: 1,
    },
    ButtonArea:
    {
        backgroundColor: '#336699',
        height: 50,

        width: 100 + '%',
        justifyContent: 'center',
        alignItems: 'center',

    },
    form: {
        flex: 1,
        justifyContent: 'flex-start',



    },
    mainContaier: {
        backgroundColor: '#1E1324',
        flex: 1,
        justifyContent: 'flex-end'
        //marginTop: StatusBar.currentHeight,
    },
    contextContainer: {
        backgroundColor: '#FFF',
        width: 75 + '%',
        alignSelf: 'center',
        //position:'absolute',
        //bottom:200


    },
    lineDivisor:
    {

        height: StatusBar.currentHeight,
    },
    container: {
        flex: 1,
        backgroundColor: '#1E1324',
    },
    header: {
        paddingTop: 20,
        padding: 20,
        backgroundColor: '#336699',
    },
    description: {
        fontSize: 14,
        color: 'white',
    },
    input: {
        width: 85 + '%',
        color: '#333',
        backgroundColor: '#FFF',
        opacity: 1,
        alignSelf: 'center',
        paddingHorizontal: 10,
        borderRadius: 2,
        borderColor: '#333',
        borderBottomWidth: 1,
        borderColor: '#CCC',
        padding: 10,
        fontSize: 16,
        marginBottom: 0,
        paddingLeft: 25,
        paddingRight: 25,
    },
    legal: {
        margin: 10,
        color: '#CCC',
        fontSize: 12,
        textAlign: 'center',
        position: 'absolute',
        bottom: 10,
        padding: 5,
        backgroundColor: '#336699',
    },


})
export default RegisterDriverScreen;