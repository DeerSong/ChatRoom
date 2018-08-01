// var url = decodeURI(location.href).split('?')[1].split('&');// 获取url里面的内容

// var chatContent = document.getElementById('chat-content');// 获取聊天内容框

var inputBox = document.getElementById('input-box');

var button = document.getElementById('send-button');

var userName = document.getElementById('user-name') || 'Default Name';

var onlineCount = document.getElementById('online-count');

// userName.innerHTML = url[1].split('=')[1]; // 把登录页面的名称放在右侧
// var userImg = document.getElementById('user-img');

// userImg.src = 'img/' + url.split('=')[1];// 把登录页面的头像放在右侧
// var logout= document.getElementById('log-out');

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
            name: userName.textContent,
            message: inputBox.value,
            // img: userImg.src
        };
        socket.emit('message', data);
        console.log(inputBox.value);
        createBubbleOfMyself();
        inputBox.value = '';
    }
};

function createBubbleOfMyself() {
    var myMessageBox = document.createElement('div');
    myMessageBox.className = 'my-message-box';

    var messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    var text = document.createElement('span');
    text.innerHTML = editBox.value;
    messageContent.appendChild(text);
    myMessageBox.appendChild(messageContent);

    var arrow = document.createElement('div')
    arrow.className = 'message-arrow';
    myMessageBox.appendChild(arrow);

    var userInformation = document.createElement('div');
    userInformation.className = 'user-information';
    var userChatImg = document.createElement('img');
    userChatImg.className = 'user-chat-img';
    userChatImg.src = userImg.src;
    var userChatName = document.createElement('div');
    userChatName.className = 'user-chat-name';
    userChatName.innerHTML = userName.textContent;
    userInformation.appendChild(userChatImg);
    userInformation.appendChild(userChatName);
    myMessageBox.appendChild(userInformation);

    chatContent.appendChild(myMessageBox);

    chatContent.scrollTop = chatContent.scrollHeight;
}

function createBubbleFromOther(information) {
    var otherMessageBox = document.createElement('div');
    otherMessageBox.className = 'other-message-box';

    var otherUserInformation = document.createElement('div');
    otherUserInformation.className = 'other-user-information';
    var userChatImg = document.createElement('img');
    userChatImg.className = 'user-chat-img';
    userChatImg.src = information.img;
    var userChatName = document.createElement('span');
    userChatName.className = 'user-chat-name';
    userChatName.innerHTML = information.name;
    otherUserInformation.appendChild(userChatImg);
    otherUserInformation.appendChild(userChatName);
    otherMessageBox.appendChild(otherUserInformation);

    var otherMessageArrow = document.createElement('div');
    otherMessageArrow.className = 'other-message-arrow';
    otherMessageBox.appendChild(otherMessageArrow);

    var otherMessageContent = document.createElement('div');
    otherMessageContent.className = 'other-message-content';
    var text = document.createElement('span');
    text.innerHTML = information.chatContent;
    otherMessageContent.appendChild(text);
    otherMessageBox.appendChild(otherMessageContent);

    chatContent.appendChild(otherMessageBox);

    chatContent.scrollTop = chatContent.scrollHeight;
}

