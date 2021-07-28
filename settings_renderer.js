const { ipcRenderer, clipboard,  shell } = require('electron')
const settingsManager = require('./settingsManager');
const notificationsManager = require('./notificationsManager');

let fontSizeEl = document.getElementById('fontsize');
let themeEl = document.getElementById('theme');
let showTasksByFile = document.getElementById('tasks-by-file');
let showSnippetsByProject = document.getElementById('snippets-by-project');
let fileTypeNotification = document.getElementById("file-type-not-recognized");

fontSizeEl.value = settingsManager.get('fontsize', 15);
themeEl.value = settingsManager.get('theme','light');
showTasksByFile.checked = settingsManager.get("taskShowCurrentFile", true);
showSnippetsByProject.checked = settingsManager.get("showSnippetsByProject", false);
fileTypeNotification.checked = settingsManager.get("fileTypeNotification", true);


document.getElementById("save-settings").addEventListener('click', e => {
    settingsManager.set('fontsize', fontSizeEl.value);
    settingsManager.set('theme', themeEl.value);
    settingsManager.set('taskShowCurrentFile', showTasksByFile.checked);
    settingsManager.set('showSnippetsByProject', showSnippetsByProject.checked);
    settingsManager.set('fileTypeNotification', fileTypeNotification.checked);
    console.log(fileTypeNotification.checked);
    notificationsManager.success("Settings saved!");
});

