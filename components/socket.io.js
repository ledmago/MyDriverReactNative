// import socketConfig from '../socketConfig';
import io from 'socket.io-client';
import {AsyncStorage} from 'react-native';
const socketConfig = {
    address:'http://192.168.0.102:1337',
    config : {
    jsonp: false,
    reconnection: true,
    reconnectionDelay: 100,
    reconnectionAttempts: 10000000,
    transports: ['websocket'], }
   };
export default (async ()=>{

    const userDetails = await AsyncStorage.getItem('userDetails');
   if(userDetails)
   {
       return  io(socketConfig.address, socketConfig.config);
   }
   
})