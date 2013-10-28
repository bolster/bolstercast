var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 8181, host: '0.0.0.0'});

wss.brodcast = function(data) {
    var broadcastMessage = JSON.stringify(data);
    for(var i in this.clients)
        this.clients[i].send(broadcastMessage);
};

wss.on('connection', function(ws) {
    ws.on('message', function(message) {
        console.log('received: %s', message);
        var messageData = JSON.parse(message);
        if(messageData.action === "update") {
            console.log("sending");
            wss.brodcast(messageData.data);
        }
    });
});
