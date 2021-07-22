const { ipcRenderer, clipboard,  shell } = require('electron')
const settingsManager = require('./settingsManager');
const notificationsManager = require('./notificationsManager');

let fontSizeEl = document.getElementById('fontsize');
let themeEl = document.getElementById('theme');
let lastOpenedEl = document.getElementById('lasted-opened');

fontSizeEl.value = settingsManager.get('fontsize', 15);
themeEl.value = settingsManager.get('theme','light');
lastOpenedEl.innerText = settingsManager.get("currentproject","");


document.getElementById("save-settings").addEventListener('click', e => {
    settingsManager.set('fontsize', fontSizeEl.value);
    settingsManager.set('theme', themeEl.value);
    notificationsManager.success();
});

