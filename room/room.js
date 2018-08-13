var url = decodeURI(location.href).split('?')[1].split('&');// 获取url里面的内容

var chatContent = document.getElementById('chat-content');

var inputBox = document.getElementById('input-box');

var button = document.getElementById('send-button');

var onlineCount = document.getElementById('online-count');

// var userName = document.getElementById('user-name');
var time = (Date.parse(new Date()) / 1000) % 100;
// userName.innerHTML = url[0].split('=')[1] || time; // get userName from url
var userName = url[0].split('=')[1] || time; // get userName from url;

var userImg = document.getElementById('user-img');
userImg.src = '../src/' + url[1].split('=')[1]; // get userImg from url

var logout= document.getElementById('log-out');

var lastTime = undefined; // timestamp of Last Message

var maxShowTime = 60*1000; // Max time period between two messages.

// Bind event
button.addEventListener('click', sendMessage);
logout.addEventListener('click', closePage);

// Press 'Enter' to send message.
document.onkeydown = function (event) {
    var e = event || window.event;
    if (e && e.keyCode === 13) {
        button.click();
    }
};

// socket.io
var socket = io();

// Download chat log from server.
socket.on('chat', function(data) {
    for (var i in data) {
        var showTime = (i==0) || (data[i].time-lastTime> maxShowTime);
        if (data[i].name == userName) {
            createBubbleOfMyself(data[i], showTime);
        }
        else {
            createBubbleFromOther(data[i], showTime);
        }
        lastTime = data[i].time;
    }

});

// Receive message from others.
socket.on('message', function(data) {
    if (data.name !== userName) {
        var showTime = (data.time-lastTime > maxShowTime);
        lastTime = data.time;
        createBubbleFromOther(data, showTime);
    }
});

// Other user connected.
socket.on('connected', function(count) {
    onlineCount.innerHTML = 'Online number: ' + count;
});

// Other user disconnected.
socket.on('disconnected', function(count) {
    onlineCount.innerHTML = 'Online number: ' + count;
});

function sendMessage() {
    if (inputBox.value != '') {
        var data = {
            name: userName,
            message: inputBox.value,
            img: userImg.src,
            time: Date.parse(new Date())
        };
        socket.emit('message', data);
        var showTime = (data.time-lastTime > maxShowTime);
        lastTime = data.time;
        createBubbleOfMyself(data, showTime);
        inputBox.value = '';
    }
};

function closePage() {
    window.location.href = "about:blank";
}

function createBubbleOfMyself(data, showTime) {
    var myMessageBox = document.createElement('div');
    myMessageBox.id = 'my-message-box';

    var messageContent = document.createElement('div');
    messageContent.id = 'message-content';
    var text = document.createElement('span');
    text.innerHTML = data.message;
    messageContent.appendChild(text);
    myMessageBox.appendChild(messageContent);

    var userInformation = document.createElement('div');
    userInformation.id = 'user-information';
    var userChatImg = document.createElement('img');
    userChatImg.id = 'user-chat-img';
    userChatImg.src = data.img;
    var userChatName = document.createElement('div');
    userChatName.id = 'user-chat-name';
    userChatName.innerHTML = data.name;

    userInformation.appendChild(userChatImg);
    userInformation.appendChild(userChatName);
    myMessageBox.appendChild(userInformation);

    if (showTime) {
        var timeBox = createTimeBox(data.time);
        chatContent.appendChild(timeBox);
    }
    chatContent.appendChild(myMessageBox);

    chatContent.scrollTop = chatContent.scrollHeight;
}

function createBubbleFromOther(information, showTime) {
    var otherMessageBox = document.createElement('div');
    otherMessageBox.id = 'other-message-box';

    var otherUserInformation = document.createElement('div');
    otherUserInformation.id = 'other-user-information';
    var userChatImg = document.createElement('img');
    userChatImg.id = 'user-chat-img';
    userChatImg.src = information.img;
    var userChatName = document.createElement('span');
    userChatName.id = 'user-chat-name';
    userChatName.innerHTML = information.name;
    otherUserInformation.appendChild(userChatImg);
    otherUserInformation.appendChild(userChatName);
    otherMessageBox.appendChild(otherUserInformation);

    var otherMessageContent = document.createElement('div');
    otherMessageContent.id = 'other-message-content';
    var text = document.createElement('span');
    text.innerHTML = information.message;
    otherMessageContent.appendChild(text);
    otherMessageBox.appendChild(otherMessageContent);

    if (showTime) {
        var timeBox = createTimeBox(information.time);
        chatContent.appendChild(timeBox);
    }
    chatContent.appendChild(otherMessageBox);

    chatContent.scrollTop = chatContent.scrollHeight;
}

function createTimeBox(timestamp) {
    var timeBox = document.createElement('div');
    timeBox.id = "time-box";
    var time = document.createElement('span');
    time.id = 'time';
    var date = new Date(timestamp);
    time.innerHTML = date.toLocaleTimeString();
    timeBox.appendChild(time);
    return timeBox;
}
