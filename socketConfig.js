export default connectionConfig = {
    address:'http://192.168.0.101:1337/nodeserver',
    config : {
    jsonp: false,
    reconnection: true,
    reconnectionDelay: 100,
    reconnectionAttempts: 100000,
    transports: ['websocket'], }
   };