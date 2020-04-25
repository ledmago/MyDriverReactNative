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
import Marker from 'react-native-maps';
import { Divider, SearchBar, Avatar, ListItem, Button, Badge, CheckBox } from 'react-native-elements';
import * as Font from 'expo-font';
import * as CustomerSide_StartTripController from '../../Controller/StartTripController';
import * as CustomerSide_HomeController from '../../Controller/CustomerSide_HomeController';



export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);

  }
  state = {
    location: null,
    errorMessage: null,
    latitude: 0.0,
    longitude: 0.0,
    kalkisCordinate: {
      latitude: 0.0,
      longitude: 0.0,
    },
    geoCoding: '',
    neredenSecilcek: true,
    Modal1Open: false,
    Modal1OpenLoadingButton: false,


  };


  static navigationOptions = ({ navigation }) => {
    return {
      header: () => null
    }
  }


  CheckLocation = async (buttondanGeldi = false) => {
    if (buttondanGeldi) { this.setState({ Modal1OpenLoadingButton: true }) }
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    let location = await Location.getCurrentPositionAsync({}).catch(() => { this.setState({ Modal1Open: true }) });
    this.setState({ location });
    this.setState({ kalkisCordinate: { latitude: location.coords.latitude, longitude: location.coords.longitude } })
    this.setState({ latitude: location.coords.latitude, longitude: location.coords.longitude, Modal1Open: false, Modal1OpenLoadingButton: false });
    this.setState({ geoCoding: await CustomerSide_HomeController.GET_ADRESS(location.coords.latitude, location.coords.longitude) });
  }



  async componentDidMount() {
    console.log(CustomerSide_StartTripController.Initial(this.props));
    CustomerSide_HomeController.Initial(this.props)
    this.CheckLocation();

  }



 getPlacesCordinates = (place_id)=>
{
    //https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJKTcrIyXI3xQRzNOy25ZW0OQ&key=AIzaSyCnxh-3HMnSm-FHDuQ4kRQ7fYfUlicd7i0
   var apiKey = 'AIzaSyCnxh-3HMnSm-FHDuQ4kRQ7fYfUlicd7i0';
    fetch('https://maps.googleapis.com/maps/api/place/details/json?place_id=' + place_id + '&key=' + apiKey, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },}).then((response) => response.json())
        .then((responseData) => {
            console.log(responseData);

            
            this.setState({ neredenSecilcek: false })
           var newCordinates = {latitude:responseData.result.geometry.location.lat,longitude:responseData.result.geometry.location.lng};
             this.setState({kalkisCordinate:newCordinates})
            




        })
}


findPlacesFromApi = async (text) => {

    //https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=AIzaSyCnxh-3HMnSm-FHDuQ4kRQ7fYfUlicd7i0&input=kale%20i%C3%A7i%20gazima%C4%9Fusa&inputtype=textquery
   var apiKey = 'AIzaSyCnxh-3HMnSm-FHDuQ4kRQ7fYfUlicd7i0';
    fetch('https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=' + apiKey + '&input=' + text + '&inputtype=textquery', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',

        },



    }).then((response) => response.json())
        .then((responseData) => {

            if (responseData.status == "INVALID_REQUEST" || responseData.status == "ZERO_RESULTS" || responseData.status == "OVER_QUERY_LIMIT") {
                alert("Hata oluştu. Sonra tekrar deneyin." + responseData.status)
            }
            else {
               this.getPlacesCordinates(responseData.candidates[0].place_id); // returns place id.
            }




        }).catch((e) => { console.log(e) })
};






  


render() {

  return (
    <View>
      <View>
        <View style={{ position: 'absolute', width: 100 + '%', top: StatusBar.currentHeight, left: 0, zIndex: 999999 }}>

          <View style={styles.searchBar}>

            <TextInput style={styles.searchInput} placeholder="Konum Arayın"
              onSubmitEditing={(e) => {



                this.findPlacesFromApi(e.nativeEvent.text)



              }} />
          </View>


          <View style={styles.MainContext}>

            <Text style={styles.baslikText}>Adım 1: Kalkış Yeri</Text>
            <CheckBox
              title='Konumum'
              checked={this.state.neredenSecilcek}
              onPress={() => {
                this.setState({ neredenSecilcek: true })
                this.setState({ kalkisCordinate: { latitude: this.state.latitude, longitude: this.state.longitude } })

              }}
            />
            <CheckBox
              title='Haritadan Seç'
              checked={!this.state.neredenSecilcek}
              onPress={() => {
                this.setState({ neredenSecilcek: false })
                alert('Kırmızı İşaretçiye Basılı Tutup İstediğiniz Yere Bırakın')

              }}
            />

          </View>

        </View>
        <MapView
          style={{ width: Dimensions.get('screen').width, height: Dimensions.get('screen').height }} region={{ latitude: this.state.kalkisCordinate.latitude, longitude: this.state.kalkisCordinate.longitude, latitudeDelta: 0.0025, longitudeDelta: 0.0025 }} showsUserLocation={true}>
          <MapView.Marker draggable coordinate={this.state.kalkisCordinate} onDragEnd={(e) => this.setState({ kalkisCordinate: e.nativeEvent.coordinate })} title={'Yolcu'} description={'Yolcu Adı : Fırat'}></MapView.Marker>

        </MapView>
      </View>

    </View>
  );
}


};
const styles = StyleSheet.create({

  baslikText:
  {
    padding: 15,
    fontSize: 18,
    fontFamily: 'airbnbCereal-medium',
    color: '#fe4858'
  },
  MainContext: {
    backgroundColor: '#FFF',
    width: 90 + ' %',
    paddingBottom: 20,
    alignSelf: 'center',
    marginTop: 15,
    borderRadius: 4,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
    }),

  },
  searchInput:
  {
    paddingHorizontal: 15,
    fontSize: 18,
    fontFamily: 'airbnbCereal-light',

  },
  searchBar: {
    backgroundColor: '#FFF', width: 90 + '%', height: 50, marginTop: 20,
    borderRadius: 4,
    alignSelf: 'center',
    justifyContent: 'center',


    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
    }),

  }
});
