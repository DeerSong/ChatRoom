var express = require('express');
var app = express();
var http = require('http').Server(app); // Set app as the callback function of the server.
var bodyParser = require('body-parser');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static(__dirname));



// Main page is login page.
app.get('/', function (request, response) {
    response.sendFile('login/login.html',{root:__dirname});
});
// app.get('/room', function (request, response) {
//     console.log(__dirname);
//     response.render('room/room.html',{root:__dirname});
// });

app.post('/check', function(req, res) {
    // var queryString = "select * from user where username='" + req.body.username + "'";
    console.log(req.body);
    res.sendFile('room/room.html',{root:__dirname});
    if (req.body.check == "register") {
        if (1) {
            res.send("1");
        }
        else {
            res.send("-1");
        }
    }
    else if (1) {
        res.send("2");
    }
    else {
        res.send("-2");
    }
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
