// var url = decodeURI(location.href).split('?')[1].split('&');// 获取url里面的内容

// var chatContent = document.getElementsByClassName('chat-content')[0];// 获取聊天内容框

var inputBox = document.getElementById('input-box');

var button = document.getElementById('send-button');

// var userName = document.getElementsByClassName('user-name')[0];// 获取用户名栏

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

// 发送本机的消息
function sendMessage() {
    if (inputBox.value != '') {
        var myInfo= {
            // name: userName.textContent,
            chatContent: inputBox.value,
            // img: userImg.src
        };
        socket.emit('message', myInfo);
        console.log(inputBox.value);
        // createMyMessage();
        inputBox.value = '';
    }
};


