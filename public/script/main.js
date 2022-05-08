const socket = io();

let windowContainer = document.getElementById('windowContainer');
let container = document.getElementById('container');
let chatLogin = document.getElementById('chatLogin');

let welcomes = [
    " finally is here",
    " joined the party",
    " connected with us",
    " saves the day",
    ", happy to see you",
    " came among us",
    " will stay",
    " joined us"
]

let username;
let message;
let socketId;

socket.on('resAdmin', (args) => {
    windowContainer.innerHTML += args;
    playEffect();
});

socket.on('resJoin', (args) => {
    windowContainer.innerHTML += "<div class=\"chat-join\"><span>'" + textController(args[0]) + "'</span>" + welcomes[random(welcomes.length)] + "</div>";
    playEffect();
});

socket.on('resSend', (args) => {
    let user = textController(args[0]);
    let text = textController(args[1]);
    if (args[2] === socketId) {
        windowContainer.innerHTML += "<div class=\"chat-bubble-wrap\"><div class=\"chat-bubble-out\"><span class=\"chat-username\">" + user + "</span>" + text + "</div></div>";
    } else {
        windowContainer.innerHTML += "<div class=\"chat-bubble-wrap\"><div class=\"chat-bubble-in\"><span class=\"chat-username\">" + user  + "</span>"  + text + "</div></div>";
        playEffect();
    }
});

socket.on('resServer', args => {
    socketId = args;
    console.log("Successfully connected with Server [" + args + "]");
});

document.getElementById('sends').addEventListener('submit', async function (e) {
    e.preventDefault();
    message = document.getElementById('chatMessage').value;
    if (message.length !== 0) {
        socket.emit('reqSend', [username, message, socketId]);
        document.getElementById('sends').reset();
        document.getElementById('chatMessage').value = '';
    }
});

document.getElementById('join').addEventListener('submit', async function (e) {
    e.preventDefault();
    username = document.getElementById('chatName').value;
    if (username.length !== 0) {
        socket.emit('reqJoin', [username, socketId]);
        document.getElementById('join').reset();
        chatLogin.style.opacity = '0';
        await sleep(200);
        chatLogin.style.display = 'none';
    }
});

function textController(text) {
    let result = [];
    for (let i = 0; i < text.length; i++) {
        if (text[i] == '<') {
            result.push('&lt;');
        } else {
            result.push(text[i]);
        }
    }
    return result.join("");
}

function playEffect() {
    let audio = new Audio('assets/effect1.wav');
    audio.play();
}

function random(lenght) {
    return Math.floor(Math.random() * (lenght - 1));
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}