const { ipcRenderer, clipboard,  shell } = require('electron')
const settingsManager = require('./settingsManager');
const notificationsManager = require('./notificationsManager');

let fontSizeEl = document.getElementById('fontsize');
let themeEl = document.getElementById('theme');
let showTasksByFile = document.getElementById('tasks-by-file');
let showSnippetsByProject = document.getElementById('snippets-by-project');

fontSizeEl.value = settingsManager.get('fontsize', 15);
themeEl.value = settingsManager.get('theme','light');
showTasksByFile.checked = settingsManager.get("task-show-current-file", true);
showSnippetsByProject.checked = settingsManager.get("show-snippets-by-project", false);


document.getElementById("save-settings").addEventListener('click', e => {
    settingsManager.set('fontsize', fontSizeEl.value);
    settingsManager.set('theme', themeEl.value);
    settingsManager.set('task-show-current-file', showTasksByFile.checked);
    settingsManager.set('show-snippets-by-project', showSnippetsByProject.checked);
    notificationsManager.success("Settings saved!");
});

