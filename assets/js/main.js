function addMessage(text, sendedFromUser, isNewMessage) {
    const newMessageBox = document.createElement("div");
    newMessageBox.classList.add('message');
    
    if (sendedFromUser) {
        newMessageBox.classList.add('out');
    } else {
        newMessageBox.classList.add('in');
    }
    
    const newMessage = document.createElement("div");
    const newContent = document.createTextNode(text);
    newMessage.appendChild(newContent);
    
    newMessageBox.appendChild(newMessage);
    
    const messagesDiv = document.getElementById('messages');
    if (isNewMessage) {
        messagesDiv.insertBefore(newMessageBox, messagesDiv.firstChild);
    } else {
        messagesDiv.appendChild(newMessageBox);
    }
}


function getReq(prompt) {
    fetch('https://chat.mikemka.ru/chat/api/v1/?' + new URLSearchParams({
        message: prompt,
    }).toString())
    .then((response) => {
      return response.text();
    })
    .then((myJson) => {
        addMessage(myJson, false, true);
        msgs.push([myJson, false]);
        localStorage.setItem("msgs", JSON.stringify(msgs));
    });
}


var msgs = [];

function sendMessage() {
    const input = document.getElementById('message-input');
    const text = input.value;
    if (!text) {
        return
    }
    input.value = '';
    addMessage(text, true, true);
    msgs.push([text, true]);
    localStorage.setItem("msgs", JSON.stringify(msgs));
    getReq(text);
}


function loadOldMessages() {
    const msgs_ls = localStorage.getItem("msgs");
    if (msgs_ls) {
        msgs = JSON.parse(msgs_ls);
    }
    for (const message of msgs.reverse()) {
        addMessage(message[0], message[1], false)
    }
}


var clicked = 0;

function processClick() {
    clicked += 1;
    setProgressValue(clicked);
    localStorage.setItem('clicked', clicked);
}


function setProgressValue(value) {
    value = Math.max(Math.min(value, 100), 0);
    document.getElementById("bar-value-start").innerText = `${value}/100`;
    document.getElementById("bar-value-end").innerText = `${100 - value}/100`;
    document.getElementById("bar-filled-start").setAttribute(
        'style',
        `width: calc(${value}/100 * calc(100% - 1.7em));`
    );
    document.getElementById("bar-filled-end").setAttribute(
        'style',
        `width: calc(${100 - value}/100 * calc(100% - 1.7em));`
    );
}


var menu = false;

function showMenu() {
    if (menu) {
        document.getElementById('message-input').classList.remove('d-none');
        document.getElementById('menu-container').classList.add('d-none');
        document.getElementById('showMenuButton').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="M3 6H21M3 12H21M3 18H21" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        document.getElementById('sendMessageButton').classList.remove('d-none');
    } else {
        document.getElementById('message-input').classList.add('d-none');
        document.getElementById('menu-container').classList.remove('d-none');
        document.getElementById('showMenuButton').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="M6 6L19 18M19 6L6 18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        document.getElementById('sendMessageButton').classList.add('d-none');
    }
    menu = !menu;
}


function pageOnload() {
    let clicked_ls = localStorage.getItem('clicked');
    if (clicked_ls) clicked = parseInt(clicked_ls);

    loadOldMessages();
    setProgressValue(clicked);
    showMenu();
}


window.onload = pageOnload;

let tg = window.Telegram.WebApp;
tg.expand();
tg.MainButton.setText("Кнопка");
tg.MainButton.textColor = '#FFFFFF';
tg.MainButton.color = '#2cab37';
tg.MainButton.hide();
Telegram.WebApp.onEvent("mainButtonClicked", function(){
	tg.sendData('Нажата основная кнопка');
});
