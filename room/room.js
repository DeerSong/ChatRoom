// var url = decodeURI(location.href).split('?')[1].split('&');// 获取url里面的内容

// var chatContent = document.getElementsByClassName('chat-content')[0];// 获取聊天内容框

var inputBox = document.getElementById('input-box');

var button = document.getElementById('send-button');

var userName = document.getElementById('user-name') || 'Default Name';

// var onlineCount = document.getElementsByClassName('online-count')[0];// 获取在线人数栏

// userName.innerHTML = url[1].split('=')[1]; // 把登录页面的名称放在右侧
// var userImg = document.getElementsByClassName('user-img')[0];

// userImg.src = 'img/' + url[0].split('=')[1];// 把登录页面的头像放在右侧
// var logout= document.getElementsByClassName('log-out')[0];

// Bind event
button.addEventListener('click', sendMessage);
// logout.addEventListener('click', closePage);

// Press 'Enter' to send message.
document.onkeydown = function (event) {
    var e = event || window.event;
    if (e && e.keyCode === 13) {
        button.click();
    }
};

// socket.io
var socket = io();

// Receive message from others.
socket.on('message', function(data) {
    if (data.name !== userName.textContent) {
        createBubbleFromOther(data);
    }
});

// Other user connected.
socket.on('connected', function (onlinecount) {
    console.log(onlinecount);
    onlineCount.innerHTML = 'Online:' + onlinecount;
});

// Other user disconnected.
socket.on('disconnected', function (onlinecount) {
    console.log(onlinecount);
    onlineCount.innerHTML = 'Online:' + onlinecount;
});

function sendMessage() {
    if (inputBox.value != '') {
        var data = {
            // name: userName.textContent,
            message: inputBox.value,
            // img: userImg.src
        };
        socket.emit('message', data);
        console.log(inputBox.value);
        // createBubbleOfMyself();
        inputBox.value = '';
    }
};


