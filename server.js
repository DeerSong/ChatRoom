var express = require('express');
var app = express();
var http = require('http').Server(app); // Set app as the callback function of the server.
var bodyParser = require('body-parser');
var session = require('express-session');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static(__dirname));
app.use(session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'shhhh, very secret'
}));
app.use(function(req, res, next){
    var err = req.session.error;
    var msg = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = '';
    if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
    if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
    next();
});

// dummy database

var users = {
    aa: 'a'
};

function restrict(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.session.error = 'Access denied!';
        res.redirect('/');
    }
}

// Main page is login page.
app.get('/', function (request, response) {
    response.sendFile('login/login.html',{root:__dirname});
});
app.get('/room', restrict, function (request, response) {
    console.log("success");
    response.sendFile('room/room.html',{root:__dirname});
});

app.post('/check', function(req, res) {
    var name = req.body.username;
    var pass = req.body.password;
    var user = users[name];

    if (req.body.check == "register") {
        if (!user) { // not used, register successfully
            users[name] = pass;
            res.send("1");
        }
        else {
            res.send("-1");
        }
    }
    else if (user == pass) {
        req.session.regenerate(function(){
            req.session.user = name;
            req.session.success = 'Authenticated successfully!';
            res.send("2");
        });
    }
    else {
        req.session.error = 'Authentication failed.';
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
