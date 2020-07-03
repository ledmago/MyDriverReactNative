
import io from 'socket.io-client';
import config from '../config.json';
import * as UserRequest from '../Controller/UserRequest';
import { AsyncStorage } from 'react-native';

class SocketIo {
    constructor(userUid) {
        this.connectionConfig = {
            jsonp: false,
            reconnection: true,
            reconnectionDelay: 100,
            reconnectionAttempts: 100000,
            transports: ['websocket'],
            forceNew: true,
            // query:'id=' + userUid,
        };
     

        this.socket = io(config.serverUrl, this.connectionConfig);


    }

    // getUserDetails = async () => {
    //     var userDetails;
    //     if (await AsyncStorage.getItem('userDetails')) {
    //         userDetails = JSON.parse(await AsyncStorage.getItem('userDetails'));
    //     }
    //     else {
    //         var userDetails = await UserRequest.refreshUserDetails();
    //     }
    //     this.connectionConfig.query = 'name=' + userDetails._id;
    //  }

};
export default SocketIo;