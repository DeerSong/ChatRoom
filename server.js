// load requirements
var express = require('express');
var app = express();
var http = require('http').Server(app); // Set app as the callback function of the server.
var bodyParser = require('body-parser');
var session = require('express-session');
var moment = require('moment');

// configure server
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

// Mysql database
var mysql      = require('mysql');
var database = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '123456',
    database : 'database',
    port     : '3306'
});

database.connect();

// restrict the visit of user
function restrict(req, res, next) {
    var url = decodeURI(req.url).split('?')[1].split('&');
    var username = url[0].split('=')[1];
    var photo = url[1].split('=')[1];
    if (req.session.user == username && req.session.photo == photo) { // check the username
        next();
    } else {
        req.session.error = 'Access denied!';
        res.redirect('/');
    }
}

// Main page is login page; then enter the room
app.get('/', function (request, response) {
    response.sendFile('login/login.html',{root:__dirname});
});
app.get('/room', restrict, function (req, res) {
    res.sendFile('room/room.html',{root:__dirname});
});
app.post('/check', function(req, res) {
    var photo = req.body.photo;
    var name = req.body.username;
    var pass = req.body.password;
    var user = false;  // Username used or not.
    var password = undefined;// password from database

    var command = "select * from user where username = \'"+name+"\';";
    database.query(command, function (err,result) {
        if (err) throw err;
        if (result[0]) {
            user = true;
            var tmp = JSON.parse(JSON.stringify(result));
            password = tmp[0].password;
        }
        if (req.body.check == "register") {
            if (!user) { // not used, register successfully
                command = "INSERT INTO user VALUES (\'"+name+"\', \'"+pass+"\');";
                database.query(command, function (err,result) {
                    if (err) throw err;
                    res.send("1");
                });
            }
            else {
                res.send("-1");
            }
        }
        else if (pass == password) {
            req.session.regenerate(function(){
                req.session.photo = photo;
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
});

http.listen(4000, function () {
    console.log('Server is running.');
});

// configure the socket
var io = require('socket.io')(http); // An instance of socket.io.

var onlineCount = 0;

// Monitor the 'connection' event.
io.on('connection', function (socket) {
    onlineCount++;
    console.log('Connected user. The number is ' + onlineCount);

    // Send chat log to the client.
    var command = "SELECT * FROM `database`.chat;";
    database.query(command, function (err,results) {
        if (err) throw err;
        for (var i in results) {
            results[i].time = moment(results[i].time).valueOf();
        }
        io.to(socket.id).emit('chat',results);
    });

    // Send the Count to clients.
    io.emit('connected', onlineCount);

    // When a user disconnect.
    socket.on('disconnect', function () {
        onlineCount--;
        console.log('Disconnected user. The number is ' + onlineCount);
        io.emit('disconnected', onlineCount);
    });

    // When receive a message from a client.
    socket.on('message', function (message) {
        // Upload log to database.
        message.time = Date.parse(new Date());
        var time = moment(message.time).format('YYYY-MM-DD HH:mm:ss');
        var name = message.name;
        var img = message.img;
        var mess = message.message;
        var command = "INSERT INTO chat VALUES (\'"+time+"\', \'"+name+"\', \'"+img+"\', \'"+mess+"\');";
        database.query(command, function (err) {
            if (err) throw err;
        });
        // Broadcast the message to other clients.
        io.emit('message', message);
    });
});
