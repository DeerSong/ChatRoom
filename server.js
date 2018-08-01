var express = require('express');
var app = express();
var http = require('http').Server(app); // Set app as the callback function of the server.

app.use(express.static(__dirname));

// Main page is room page.
app.get('/', function (request, response) {
    response.sendFile('room/room.html',{root:__dirname});
});

http.listen(4000, function () {
    console.log('Server is running.');
});

var io = require('socket.io')(http); // An instance of socket.io.

var onlineCount = 0;

// Monitor the 'connection' event.
io.on('connection', function (socket) {
    onlineCount++;
    console.log('Connected user. The number is ' + onlineCount);

    // Send the Count to client.
    io.emit('connected', onlineCount);

    // When a user disconnect.
    socket.on('disconnect', function () {
        onlineCount--;
        console.log('Disconnected user. The number is ' + onlineCount);
        io.emit('disconnected', onlineCount);
    });

    // When receive a message from a client.
    socket.on('message', function (message) {
        // Broadcast the message to other clients.
        io.emit('message', message);
    });
});
