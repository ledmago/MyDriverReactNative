
import io from 'socket.io-client';
import config from '../config.json';
class SocketIo {
    constructor() {
        this.connectionConfig = {
            jsonp: false,
            reconnection: true,
            reconnectionDelay: 100,
            reconnectionAttempts: 100000,
            transports: ['websocket'],
            forceNew: true,
        };
        this.socket = io(config.serverUrl,this.connectionConfig);
    }

};
export default SocketIo;