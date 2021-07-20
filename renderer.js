// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const APPLICATION_NAME = "";
const { ipcRenderer, clipboard,  shell } = require('electron')
const helper = require('./helper.js');
const fs = require("fs-extra")
var path = require('path');
const hljs = require('highlight.js');
let db = require('./database');
const extensions = require('./extensions');
const Store = require('electron-store');
const openExplorer = require('open-file-explorer');
const taskManager = require('./tasksManager');
const snippetManager = require('./snippetsManager');
let interact = require('interactjs')
let ncp = require("copy-paste");
const open = require('open');
const cmd=require('node-cmd');
const sideBarManager = require('./sidebarManager');
const Jimp = require('jimp');

let ctrlIsPressed = false;
const settings = new Store();
let baseDir = 'C:\\Users\\wfranklin\\Documents\\snippets';
let currentProject = null;
let APPLICATION_PATH = "";
let SHOW_TASK_BY_FILE = false;
let recentlyCreatedFile = null;
let openFiles = [];
let selectedFileElement = null;
let activeTabEl = null;
let activeFileBrowserEl = null;
let selectedTab = null;
let selectedTaskElement = null;
let currentSideBar = null;
let currentSnippet;
let allTutorials = [];
let tutorialsPagination = null;
let tutorialsViewScrollPosition = null;
let selectedTutorialElement = null;
let currentTutorialAction = "tutorials";

let currentFile = null;
let currentDirectory = null;

let directoryUi = document.getElementById('directory');
let backdropUi = document.getElementById('backdrop');
let modalUi = document.getElementById('new-file-modal');

let closeModalButton = document.getElementById('close-modal');
let saveButton = document.getElementById('save-file-btn');
let fileNameInput = document.getElementById("file-name-input");
let projectName = document.getElementById("project-name");


let codeView = document.getElementById('code-view');
let imageView = document.getElementById('image-view');
let imageViewer = document.getElementById('image-viewer');
let fileTabs = document.getElementById("file-tabs");

let modalTitle = document.getElementById('dialog-title');
let modalDescription = document.getElementById('modal-description');
let modalContentView = document.getElementById('modal-description-field');
let modalContentInput = document.getElementById('model-description-content');

let CURRENT_PROJECT_NAME = "";
let cmdContent = "";

let ACTIVE_MODAL_ID = "";
let CURRENT_FILE_OPENER_ACTION = null;
let CURRENT_FILE_OPENER_TYPE = null;
var openDir = [];
let copyPathHolder =  null;



/** Set up the Editor **/

var editor = ace.edit("code-input");
editor.setTheme("ace/theme/monokai");
var langTools = ace.require("ace/ext/language_tools");
editor.setOptions({
  enableBasicAutocompletion:true,
  enableLiveAutocompletion: true
});
editor.on("input", e => {

  let fileObject = helper.getObjectAndIdFromArrayByKey(openFiles,'name', currentFile);
  // file has been edited
  if(!editor.session.getUndoManager().isClean()){
    console.log("editting")
    if(fileObject){
     // fileObject.file.changed = true;
      fileObject.file.content = editor.getValue();
      openFiles[fileObject.position] = fileObject.file;
    }
    refreshView();
  }else{
    if(fileObject){
     // fileObject.file.changed = false;
      //openFiles[fileObject.position] = fileObject.file;
    }
  }

});


// Save file on file Name input enter press

fileNameInput.addEventListener("keyup", function(e) {
  if (e.which === 13) {
    //The keycode for enter key is 13
    onSaveButtonPressed(e);
  }
});


// search for tutorials based on query
document.getElementById("search-tutorial-query").addEventListener("keyup", function(e) {
  if (e.which === 13) {
    //The keycode for enter key is 13
    searchTutorials();
  }
});


// save task on enter

document.getElementById("task-input").addEventListener("keyup", function(e) {
  if (e.which === 13) {
    //The keycode for enter key is 13
    saveTask();
  }
});

// search for snippet on enter
document.getElementById("snippets-query").addEventListener("keyup", function(e) {
  if (e.which === 13) {
    //The keycode for enter key is 13
    searchSnippets();
  }
});


document.getElementById("save-task-btn").addEventListener('click', e => {
    saveTask();
});


document.getElementById("cmd-close").addEventListener('click', e => {
  document.getElementById("cmd-layout").style.display = "none";
  updateAfterResize();
});


document.getElementById("showtaskbyfile").addEventListener('change', function() {
  if (this.checked) {
   SHOW_TASK_BY_FILE = true;
  } else {
    SHOW_TASK_BY_FILE = false;
  }
  loadTaskView();
});




// go to website based on route comment

document.getElementById("action-go-to-website").addEventListener('click', e=>{
  if(currentFile){
    let fileObject = helper.getObjectFromArrayByKey(openFiles,'name', currentFile);
    const re = /\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+/;
    var matches = fileObject.content.match(re);
    if(matches){
      for(let i=0; i<=matches.length-1; i++){
        if(matches[i].indexOf('@route') !== -1){
          let route = matches[i];
          route = route.replaceAll("*","");
          route = route.replace("@route","");
          if(route){
            console.log(route);
            shell.openExternal(route);
            return route;
          }
        }
      }
    }
  }
});


// run a command based on type of file
document.getElementById("action-run-command").addEventListener('click', e => {
  runACommand();
});


// Create a new file
document.getElementById("action-add-file").addEventListener('click', e=>{
  if(currentProject){
    createANewFile();
  }
  return false;
});


// create a new folder
document.getElementById("action-add-folder").addEventListener('click', e=>{
  if(currentProject){
    createANewFolder();
  }
  return false;
});

// toggle notes button
document.getElementById("manage-notes").addEventListener('click', e=>{
  toggleTasksView();
  return false;
});


// toggle snippets button
document.getElementById("manage-code-snippets").addEventListener("click", e=>{
  toggleSnippetsView();
  return false;
});


// save a file button
document.getElementById("action-save-file").addEventListener('click', e=>{
  saveCurrentFile();
  return false;
});

// resize the views if required
document.getElementById("action-resize-picture").addEventListener('click', e=>{
  updateAfterResize();
  return false;
});

// toggle console button
document.getElementById("show-console").addEventListener('click', e=>{
  toggleCmdLayout();
  return false;
});


// close side bars button
document.getElementById("side-bar-close").addEventListener('click', e=>{
  closeTasksView();
  //comment
  return false;
});


// add a snippet button (toggle snippets)
document.getElementById("add-snippet").addEventListener('click', e=>{
  createANewSnippet();
  return false;
});

// search snippets
document.getElementById("search-snippet").addEventListener('click', e=>{
  searchSnippets();
  return false;
});

// search for a tutorials
document.getElementById("search-tutorials").addEventListener('click', e=>{
  searchTutorials();
  return false;
});



// toggle tutorials button
document.getElementById("manage-tutorials").addEventListener('click', e=>{
  if(allTutorials.length > 0){
    sideBarManager.toggleSideBar(function(){
      if(tutorialsViewScrollPosition){
        document.getElementById('webview-layout').scrollTop = tutorialsViewScrollPosition;
      }
    },'webview')
  }else{
    openWebView();
  }
  return false;
});


// go home from tutorials button
document.getElementById("tutorials-home").addEventListener('click', e=>{
  showTutorialsView(function(){
    if(currentTutorialAction == "tutorials"){
      if(tutorialsViewScrollPosition){
        document.getElementById('webview-layout').scrollTop = tutorialsViewScrollPosition;
        // maybe clear search field
      }
    }else if(currentTutorialAction == "search"){
      allTutorials = [];
      tutorialsPagination = null;
      fetchTutorials();
    }
  });
  return false;
});


document.getElementById("tutorial-view-back").addEventListener('click', e=>{
  showTutorialsView(function(){
    if(tutorialsViewScrollPosition){
      document.getElementById('webview-layout').scrollTop = tutorialsViewScrollPosition;
    }
  });
  return false;
});

codeView.addEventListener('contextmenu', e=>{
  ipcRenderer.invoke('show-context-menu','code').then(dbPath=>{

  });
});


closeModalButton.addEventListener('click', e => {
  hideShowModal("hide","new-file-modal");
});

ipcRenderer.on('get-code', function (evt, message) {
  console.log(message); // Returns: {'SAVED': 'File Saved'}
  var cursor = editor.selection.getCursor() // returns object like {row:1 , column: 4}
  editor.insert(message.code)
  editor.focus();
});


ipcRenderer.on('new-project-start', function (evt, message) {
  let projectPath = message.project;
  closeProject();
  currentProject = projectPath;
  openProject(null, projectPath);
});


ipcRenderer.on('open-file', function (evt, message) {
  onFileClickEvent(null, message.file);
});






ipcRenderer.invoke('read-user-data').then(dbPath=>{
  APPLICATION_PATH = dbPath;
  db.init(dbPath);
  db.loadDatabases();
  init();
});


function getTasksPath(){
  return path.join(APPLICATION_PATH,'sidebar.db');
}

function getApplicationPath(file){
  if(file){
    return path.join(APPLICATION_PATH,file);
  }
  return APPLICATION_PATH;
}




function setSaveButtonAsActive(){

}

function setSaveButtonAsInActive(){

}

function runAFile(){
  if(currentFile){
    var ext = path.extname(currentFile);
    var baseName = path.basename(currentFile);
    if(ext == ".php"){
      runCommand('php '+ baseName)
    }else if(ext == ".py"){
      runCommand('python '+ baseName)
    }
  }
}


function addOpenFile(file){
  let statsObj = fs.statSync(file);

  if(!helper.exitsInObjectArray(openFiles, "name", file)) {
    const buffer = fs.readFileSync(file);
    openFiles.push({
      name: file,
      lastmod: statsObj.mtime,
      changed: false,
      content: buffer.toString(),
      ocontent : buffer.toString(),
    });
  }
}

function removeOpenFile(file){
  helper.removeFromObjectArray(openFiles, "name", file);
}

function onDirectoryClickEvent(e, file){
  currentDirectory = file;
  updatePageTitle(file);
  currentFile = null;
  if(helper.exitsInArray(openDir, file)){
    helper.removeFromArray(openDir, file);
  }else{
    openDir.push(file);
  }
  refreshView();
}

function onFileClickEvent(e, file){
  let ext = path.extname(file).replace(/\./g,' ').trim();
  let fileAction = null;
  let fileActions = extensions;
  currentFile = file;
  updatePageTitle(file);
  currentDirectory = null;
  if(extensions.hasOwnProperty(ext)){
    fileAction = fileActions[ext].type;
    if(fileAction === "code"){
      appOpenCode(e, file, ext);
    }else if(fileAction === "image"){
      appOpenImage(e, file, ext)
    }else{
      setMessageBox("Cant open this file");
    }
    refreshView();
  }else{
    console.log(ext);
    setMessageBox("Cant open this file");
  }
}

// all good

function appOpenCode(event, file, ext){
  if(event){
    helper.addElementClass(event.target, "active");
  }
  addOpenFile(file);
  let fileObject = helper.getObjectFromArrayByKey(openFiles,'name', file);
  hideAllViews(codeView);
  if(fileObject){
    editor.session.setValue(fileObject.content);
  }else{
    const buffer = fs.readFileSync(file);
    editor.session.setValue(buffer.toString());
  }
  assignAceMode(editor, ext);
}

function appOpenImage(event, file, ext){
  addOpenFile(file);
  hideAllViews(imageView);
  imageViewer.src = file;
}

function hideAllViews(view){
  codeView.style.display = "none";
  imageView.style.display = "none";
  view.style.display = "block";
}



saveButton.addEventListener("click", e => {
  onSaveButtonPressed(e);
});


function onSaveButtonPressed(e){
  let filename = fileNameInput.value;
  if(filename){
    if(CURRENT_FILE_OPENER_ACTION == "file"){
      if(CURRENT_FILE_OPENER_TYPE == "any"){

      }else{
        filename = filename.replace(/\.[^/.]+$/, "");
        filename += "." + CURRENT_FILE_OPENER_TYPE;
      }
      let dirPath = getCurrentSelectedDirectory();
      addToOpenDirectory(dirPath);
      saveAFile(path.join(dirPath, filename), "",(fpath)=>{
        onFileClickEvent(null, fpath);
      });
    }else if(CURRENT_FILE_OPENER_ACTION == "dir"){
      saveADirectory(path.join(getCurrentSelectedDirectory(), filename), (fpath)=>{
        onDirectoryClickEvent(null, fpath);
      });
    }else if(CURRENT_FILE_OPENER_ACTION =='rename'){
      renameAFile(selectedFileElement, filename);
    }else if(CURRENT_FILE_OPENER_ACTION == 'copy-file'){
      copyFileToDest(filename);
    }else if(CURRENT_FILE_OPENER_ACTION == 'sar'){
      editor.findAll(filename);
    }else if(CURRENT_FILE_OPENER_ACTION == 'task'){
      let taskId = selectedTaskElement.getAttribute("data-id");
      taskManager.getTask(getTasksPath(),{_id:taskId}, function(tO){
        let update = taskManager.changeTaskContent(tO, filename);
        taskManager.updateTask(getTasksPath(),
            {_id: tO._id}, update, function(){
              loadTaskView();
            });
      });
    }else if(CURRENT_FILE_OPENER_ACTION == 'runcommand'){
      runCommand(filename);
    }else if(CURRENT_FILE_OPENER_ACTION == 'snippet'){
      saveSnippet();
    }else if(CURRENT_FILE_OPENER_ACTION == "snippet_edit"){
      let sntId = currentSnippet.getAttribute("data-id");
      if(sntId){
        snippetManager.getSnippet(getApplicationPath('snippets.db'), {_id: sntId}, function(snt){
          console.log(fileNameInput.value);
          let update = snippetManager.changeSnippetContent(snt, fileNameInput.value, modalContentInput.value);
          console.log(update);
          snippetManager.updateSnippet(getApplicationPath('snippets.db'),
              {_id: snt._id}, update, function(){
                loadSnippetsView();
              });
        })
      }else{
        console.log('snippet no found');
      }
    }
    console.log("The file was saved!");
    hideShowModal('hide',"new-file-modal");
    readFiles(currentProject);
  }
}

/********************* FILE TASKS **********************/


function createANewFile(){
  CURRENT_FILE_OPENER_ACTION = "file";
  CURRENT_FILE_OPENER_TYPE = "any";
  setModalTitle('Create a New File');
  hideShowModal("show" , "new-file-modal");
}

function createAPhpFile(){
  CURRENT_FILE_OPENER_ACTION = "file";
  CURRENT_FILE_OPENER_TYPE = "php";
  setModalTitle('Create a PHP File');
  hideShowModal("show" , "new-file-modal");
}

function createAHtmlFile(){
  CURRENT_FILE_OPENER_ACTION = "file";
  CURRENT_FILE_OPENER_TYPE = "html";
  setModalTitle('Create a HTML File');
  hideShowModal("show" , "new-file-modal");
}

function createAJsFile(){
  CURRENT_FILE_OPENER_ACTION = "file";
  CURRENT_FILE_OPENER_TYPE = "js";
  setModalTitle('Create a Javascript File');
  hideShowModal("show" , "new-file-modal");
}


function copyAFile(filepath){
  let dest;
  copyPathHolder = filepath;
  CURRENT_FILE_OPENER_ACTION = "copy-file";
  dest = selectedFileElement.getAttribute("data-path");
  let destPathStats = fs.statSync(dest);
  if(!destPathStats.isDirectory()){
    dest = path.dirname(dest)
  }
  fileNameInput.value = path.basename(filepath);
  setModalTitle('Copy a file',`Copy file ${filepath} to  ${dest}`);
  hideShowModal("show" , "new-file-modal");
}

function createANewFolder(){
  CURRENT_FILE_OPENER_ACTION = "dir";
  setModalTitle('Create a New Folder');
  hideShowModal("show", "new-file-modal");
}

function renameCurrentFile(){
  CURRENT_FILE_OPENER_ACTION = "rename";
  let file = selectedFileElement.getAttribute("data-path");
  setModalTitle('Rename a file');
  fileNameInput.value = path.basename(file);
  hideShowModal("show", "new-file-modal");
}


function copyFileToDest(filename){
  let copySrc = copyPathHolder;
  let selectedPath = selectedFileElement.getAttribute('data-path');
  let fileStats = getFileStats(selectedPath);
  let baseDir = null;
  if(fileStats.directory){
    baseDir = selectedPath;
  }else{
    baseDir = path.dirname(selectedPath);
  }
  let desPath = path.join(baseDir, filename);
  try{
    fs.copyFileSync(copySrc, desPath);
  }catch (e){

  }
}

function renameAFile(el, filename){
  let file = el.getAttribute("data-path");
  let fileType = el.getAttribute("data-type");
  let dir = path.dirname(file);
  fs.renameSync(file, path.join(dir, filename));
  readFiles(currentProject);
}


function saveCurrentFile(){
  if(currentFile){
    var code = editor.getValue();
    var sel = editor.getSelection();
    let cpostion = sel.getCursor();
    saveAFile(currentFile, code);
    let fileObject = helper.getObjectAndIdFromArrayByKey(openFiles,'name', currentFile);
    if(fileObject){
      fileObject.file.ocontent = code;
      openFiles[fileObject.position] = fileObject.file;
    }
    sel.moveCursorToPosition(cpostion);
    setSaveButtonAsInActive();
    refreshView();
  }
}

function saveAFile(filepath,content, callback) {
  try {
    fs.writeFileSync(filepath, content);
    if(callback){
      callback(filepath);
    }
  } catch (err) {
    console.error(err)
  }
}

function saveADirectory(path, callback){
  fs.mkdir(path, (err) => {
    if (err) {
      throw err;
    }
    if(callback){
      callback(path);
    }
    console.log("Directory is created.");
  });
}



/************************************ SNIPPETS ********************************/


function searchSnippets(){
  let query = document.getElementById('snippets-query').value;
  console.log(query);
  if(query){
    loadSnippetsView({
      $where: function () {
        // console.log(this.title);
        if(this.title.toLowerCase().indexOf(query.toLowerCase()) !== -1){
          return true;
        }
        return false;
      }
    });
  }
}

function openInCodeView(){
  let snippetId = currentSnippet.getAttribute("data-id");
  snippetManager.getSnippet(getApplicationPath("snippets.db"), {_id: snippetId}, function(doc){
    sideBarManager.openSideBar(function(){
      setCodeView("Snippet", doc.snippet);
    }, "codeview");
  })
}


function copySnippetToClipboard(){
  let snippetId = currentSnippet.getAttribute("data-id");
  snippetManager.getSnippet(getApplicationPath("snippets.db"), {_id: snippetId}, function(doc){
    clipboard.writeText(doc.snippet);
  })
}


function editSnippet(){
  let snippetId = currentSnippet.getAttribute("data-id");
  CURRENT_FILE_OPENER_ACTION = "snippet_edit";
  setModalTitle('Edit this snippet');
  hideShowModal("show" , "new-file-modal","show");
  snippetManager.getSnippet(getApplicationPath("snippets.db"), {_id: snippetId}, function(doc){
    modalContentInput.value = doc.snippet;
    fileNameInput.value = doc.title;
  })
}


function createANewSnippet(){
  CURRENT_FILE_OPENER_ACTION = "snippet";
  setModalTitle('Add a Snippet');
  hideShowModal("show" , "new-file-modal","show");
}


function createASnippet(){
  createANewSnippet();
  openSnippetsView();
}


function AddSelectedAsSnippet(){
  createANewSnippet();
  openSnippetsView();
  modalContentInput.value = editor.getSelectedText();
}


function openSnippetsView(){
  sideBarManager.openSideBar(function(){
    loadSnippetsView();
  },'snippets')
}

function toggleSnippetsView(){
  sideBarManager.toggleSideBar(function(){
    loadSnippetsView();
  },'snippets')
}


function loadSnippetsView(query){
  let snippetsPath = path.join(APPLICATION_PATH,'snippets.db');
  if(query == undefined){
    var query = {project:currentProject};
  }
  let snipCallback = function(docs){
    let template = "";
    docs.forEach(( snippet )=> {
      template += `<div data-file="${snippet.file}" data-id="${snippet._id}" href="javascript:void(0)" class="snippet-item list-group-item list-group-item-action flex-column align-items-start">`;
      template += `    <div class="d-flex w-100 justify-content-between">
                  <h6 class="mb-1">${snippet.title}</h6>
                </div>`;
      template += `<p class="mb-1">${snippet.snippet}</p>`;
      if (snippet.file) {
        var name = path.basename(snippet.file);
        template += `<span class="badge badge-info">${name}</span>`;
      }
      template += `</div>`;
    });
    document.getElementById('snippets-layout').innerHTML = template;

    // listeners
    const divs = document.querySelectorAll('.snippet-item');
    divs.forEach( el => {
      el.addEventListener('click', (event)=>{
        currentSnippet = event.currentTarget;
        // var taskFile = el.getAttribute('data-file');
      });
      el.addEventListener('contextmenu', e => {
        currentSnippet = e.currentTarget;
        ipcRenderer.invoke('show-context-menu',"snippets");
        e.preventDefault();
      })
    });
  }
  snippetManager.loadSnippets(snippetsPath, query, snipCallback);
}


function saveSnippet(){
  let snippetName = fileNameInput.value;
  let snippetContent = modalContentInput.value;
  const timestamp = Date.now();
  let snippetsDbPath = path.join(APPLICATION_PATH,'snippets.db');
  if(snippetName && snippetContent){
    snippetManager.saveSnippet({
      title: snippetName,
      snippet : snippetContent,
      timestamp : timestamp,
      project : (currentProject) ? currentProject : "",
      file : (currentFile) ? currentFile : "",
    }, snippetsDbPath, function(){
      loadSnippetsView();
    });
  }
}


function saveEditedSnippet(){

}


function removeASnippet(){
  snippetManager.getSnippet(getApplicationPath('snippets.db'),
      {_id: currentSnippet.getAttribute("data-id")}, function(snippet){
        snippetManager.removeSnippet(getApplicationPath('snippets.db'), snippet._id, function(){
          loadSnippetsView();
        })
      });
}

/*************************** END SNIPPETS **************************/


/****************************** TASKS ***********************/



function saveTask(){
  let taskEl = document.getElementById("task-input");
  let task = taskEl.value;
  const timestamp = Date.now();
  if(task){
    taskManager.saveTasks({
      content: task,
      file : (currentFile) ? currentFile : "",
      timestamp: timestamp,
      project : (currentProject) ? currentProject : "",
    }, getTasksPath(), function(){
      loadTaskView();
      taskEl.value = "";
    });
  }
}


function toggleTasksView(){
  sideBarManager.toggleSideBar(function(visibility){
    if(visibility === "visible"){
      openTaskView();
    }
  },"tasks")
}

function closeTasksView(){
  sideBarManager.closeSideBar();
}

function openTaskView(){
  sideBarManager.openSideBar(function(){
    loadTaskView();
    document.getElementById("task-input").focus();
  }, "tasks");
}

function openTaskViewWithSelected(){
  sideBarManager.openSideBar(function(){
    loadTaskView();
    document.getElementById("task-input").value = editor.getSelectedText();
    document.getElementById("task-input").focus();
  },"tasks")
}


function loadTaskView(){
  document.getElementById("task-input").value = "";
  var query = {project:currentProject};
  if(SHOW_TASK_BY_FILE){
    query = {project:currentProject, file:currentFile};
  }
  taskManager.loadTasks(getTasksPath(), query, function(docs){
    let template = "";
    docs.forEach(( task )=>{
      template += `<div data-file="${task.file}" data-id="${task._id}" href="#" class="task-item list-group-item list-group-item-action flex-column align-items-start">`;
      template += `<p class="mb-1">${task.content}</p>`;
      if(task.file){
        var name = path.basename(task.file);
        template += `<span class="badge badge-info">${name}</span>`;
      }
      //template  += `<small>Donec id elit non mi porta.</small>`;
      template +=  `</div>`;
    })
    document.getElementById('task-layout').innerHTML = template;

    // listeners
    const divs = document.querySelectorAll('.task-item');
    divs.forEach( el => {
      el.addEventListener('dblclick', (event)=>{
        var taskFile = el.getAttribute('data-file');
        if(taskFile){
          onFileClickEvent(null, taskFile);
        }
      });
      el.addEventListener('contextmenu', e => {
        selectedTaskElement = e.currentTarget;
        ipcRenderer.invoke('show-context-menu',"tasks");
        e.preventDefault();
      })
    });

  });
}


function isTaskViewOpen(){
  if(document.getElementById("side-bar").style.display === "block"){
    return true;
  }
  return false;
}

function clearTasksView(){
  document.getElementById('task-layout').innerHTML = "";
}


function editATask(){
  CURRENT_FILE_OPENER_ACTION = "task";
  CURRENT_FILE_OPENER_TYPE = "task";
  let taskid = selectedTaskElement.getAttribute("data-id");
  taskManager.getTask(getTasksPath(),{_id: taskid}, function(taskObject){
    fileNameInput.value = taskObject.content;
    setModalTitle('Edit this task');
    hideShowModal("show" , "new-file-modal");
  });
}

function removeATask(){
  taskManager.getTask(getTasksPath(),
      {_id: selectedTaskElement.getAttribute('data-id')}, function(currentTask){
    taskManager.removeTask(getTasksPath(), currentTask._id, function(){
      loadTaskView();
    })
  });
}


function copyTaskToClipBoard(){
  if(selectedTaskElement){
    let taskId = selectedTaskElement.getAttribute("data-id");
    taskManager.getTask(getTasksPath(),{_id: taskId}, function(taskObject){
      if(taskObject){
        clipboard.writeText(taskObject.content);
      }
    });
  }
}

/******************** Command ***********************/


function toggleCmdLayout(){
  let cmdEl = document.getElementById("cmd-layout");
  if(cmdEl.style.display == "block"){
    cmdEl.style.display = "none";
  }else{
    cmdEl.style.display = "block";
  }
  updateAfterResize();
}

function showCmdLayout(){
  document.getElementById("cmd-layout").style.display = "block";
  updateAfterResize();
}

function runCommand(command){
  if(currentFile){
    let basePath = path.dirname(currentFile);
    command = `cd ${basePath} & ` + command;
  }
  console.log(command);
  sendToConsole(command);
  showCmdLayout();
  cmd.run(command,
      function(err, data, stderr){
        if(err){
          console.log(err);
          sendToConsole(err);
        }else{
          console.log('examples dir now contains the example file along with : ',data)
          sendToConsole(data)
          sendToConsole("----------------------------------------Command Complete--------------------------------------");
          scrollCmdViewDown();
        }
      }
  );
}

function sendToConsole(message){
  cmdContent += "\r\n" + message + "\r\n";
  let currentTextEl = document.getElementById('cmd-content');
  currentTextEl.innerText = cmdContent;
}


function runACommand(){
  CURRENT_FILE_OPENER_ACTION = "runcommand";
  setModalTitle('Run a Command');
  hideShowModal("show" , "new-file-modal");
  if(currentFile){
    var ext = path.extname(currentFile);
    var baseName = path.basename(currentFile);
    if(ext == ".php"){
      fileNameInput.value = 'php '+ baseName;
    }else if(ext == ".py"){
      fileNameInput.value = 'python '+ baseName;
    }
  }
}

/***************************** END COMMANDS ************************/

function searchAndReplace(){
  CURRENT_FILE_OPENER_ACTION = "sar";
  let file = selectedFileElement.getAttribute("data-path");
  setModalTitle('Search file');
  //fileNameInput.value = path.basename(file);
  hideShowModal("show", "new-file-modal");
}

function showRecentProjects(){
  loadRecentProjects();
  hideShowModal("show", "projects-modal");
}


function hideShowModal(action, id, content){
  var el = document.getElementById(id);
  if(action == "show"){
    ACTIVE_MODAL_ID = id;
    backdropUi.style.display = "block";
    el.style.display = "block";
    fileNameInput.focus();
    if(content){
      modalContentView.style.display = "block";
      modalContentInput.value = "";
    }
  }else{
    ACTIVE_MODAL_ID = null;
    backdropUi.style.display = "none";
    el.style.display = "none";
   // fileNameInput.value = "";
   // modalDescription.innerText = "";
    //modalContentInput.value = "";
    modalContentView.style.display = "none";
  }

}

function getCurrentSelectedDirectory(){
  if(selectedFileElement){
    let file = selectedFileElement.getAttribute("data-path");
    let stats = fs.statSync(file);
    if(stats.isDirectory()){
      return file;
    }else{
      return path.dirname(file);
    }
  }else{
    return getCurrentDirectory();
  }
}


function getCurrentDirectory(){
  if(currentDirectory){
    return currentDirectory;
  }else{
    if(currentFile){
      return path.dirname(currentFile);
    }else{
      return currentProject;
    }
  }
}

let createDirectoryLink = (type, file, styleclass) => {
  let fname = path.basename(file);
  let fileIcon = getIcon(file);
  let  tempFolder = ` <li class="directory-parent"><a title="${fname}" data-type="dir" data-path="${file}" class="file-link ${styleclass}"><img src="./icons/ic_folder.png"> ${fname}</a></li>`;
  let  tempFile = ` <li class="directory-parent"><a title="${fname}" data-type="file" data-path="${file}" class="file-link ${styleclass}"><img src="${fileIcon}"> ${fname}</a></li>`;
  if(type === 'dir'){
    return tempFolder;
  }
  return tempFile;
}

function refreshView(){
  readFiles(currentProject);
  createTabs();
  if(isTaskViewOpen()){
    loadTaskView();
  }
}

function createTabs(){
  let html = '';
  if(openFiles.length < 0){
    clearProject();
  }
  for(let i=0; i<= openFiles.length-1; i++){
    var fileObject = openFiles[i];
    let file = fileObject.name;
    if(file)
    {
      let fname = path.basename(file);
      if(file == currentFile && (fileObject.content !== fileObject.ocontent)){
        html += createTabHtml(file, fname, "active save");
      }else if(file == currentFile){
        html += createTabHtml(file, fname, "active");
      }else if((fileObject.content !== fileObject.ocontent)){
        html += createTabHtml(file, fname, "save");
      }else{
        html += createTabHtml(file, fname, "");
      }
    }
  }
  fileTabs.innerHTML = html;
  setTabEvents();
  updateAfterResize();
}

function createTabHtml(file, fname, className){
  return  `<li class="nav-item" title="${file}">
             <span class="nav-link ${className}">
                <span class="tab-item " data-file="${file}">${fname}&nbsp;</span><a data-file="${file}" class="close-tab">&#10006;</a></span>
            </li>`;
}

function setTabEvents(){
  const divs = document.querySelectorAll('.close-tab');
  divs.forEach( el => {
    el.addEventListener('click', e=>{
      let file = el.getAttribute('data-file');
      closeATab(file, ()=>{
        if(openFiles[openFiles.length-1] !== undefined){
          onFileClickEvent(null, openFiles[openFiles.length-1].name);
        }else{
          clearProject();
        }
        createTabs();
      })
    })
  });
  const divs2 = document.querySelectorAll('.tab-item');
  divs2.forEach( el => {
    el.addEventListener('click', e=>{
      let file = el.getAttribute('data-file');
      onFileClickEvent(null, file);
    })
    el.addEventListener('contextmenu', e => {
      selectedTab = e.target;
      ipcRenderer.invoke('show-context-menu',"tabs");
    })
  });


}

function getIcon(fname){
  let ext = path.extname(fname).replace(/\./g,' ').trim()
  let defaultIcon = `./icons/ic_file.png`;
  if(extensions.hasOwnProperty(ext)){
    let iconname = `./icons/ic_${extensions[ext].icon}.png`;
    try {
      if(fs.existsSync(iconname)) {
        return iconname;
      } else {
        return defaultIcon;
      }
    } catch (err) {
      return defaultIcon;
    }
  }else{
    return defaultIcon;
  }
}

let openSubDirectory = () => {
  return `<ul class="directory-lister-sub">`;
}


let closeSubDirectory = () => {
  return '</ul>';
}


let undoDirectoryStyling = () => {
  const divs = document.querySelectorAll('.file-link');
  divs.forEach( el => {
    // el.style.backgroundColor = "transparent";
    // el.classList.remove('active');
    helper.removeElementClass(el, "active");
  })
}

function setModalsCloseEvents(){
  const divs = document.querySelectorAll('.close-modal-x');
  divs.forEach( el => {
    el.addEventListener('click', e=>{
      hideShowModal("hide", ACTIVE_MODAL_ID);
    })
  })
}

let setListeners = () => {
  const divs = document.querySelectorAll('.file-link');
  divs.forEach(el => {

    // on context menu
    el.addEventListener('contextmenu', e=>{
      selectedFileElement = e.target;
      undoDirectoryStyling();
      helper.addElementClass(e.target, "active");
      ipcRenderer.invoke('show-context-menu',"file").then(e=>{
      });
    });


    // on double click
    el.addEventListener('dblclick', event => {
      selectedFileElement = event.target;
      let el = document.getElementById('code-input');
      let file = event.target.getAttribute("data-path");
      let fileType = event.target.getAttribute("data-type");
      undoDirectoryStyling();
      if(fileType === "file"){
        onFileClickEvent(event, file);
      }else if(fileType === 'dir'){
        onDirectoryClickEvent(event, file);
      }
    })

    el.addEventListener('click', event => {
      selectedFileElement = event.target;
      let el = document.getElementById('code-input');
      let file = event.target.getAttribute("data-path");
      let fileType = event.target.getAttribute("data-type");
      undoDirectoryStyling();
      helper.addElementClass(event.target, "active");
    });


  });
}


function saveLastProject(filepath){

  settings.set("currentproject", filepath);
}

function assignAceMode(editor, ext){
  let extName = ext.replace(/\./g,' ').trim();
  if(extensions.hasOwnProperty(extName)){
    editor.session.setMode("ace/mode/" + extensions[extName].ace);
  }
}

function getProjectDir(callback){
  console.log("get project directory")
  let cpPath = settings.get('currentproject');
  currentProject = cpPath;
  setCurrentProjectName(helper.getDirectoryName(cpPath));
  callback(cpPath);
}

function setCurrentProjectName(name){
  if(name){
    projectName.innerHTML = "Project (" + name + ")";
  }else{
    projectName.innerHTML = "Project Title";
  }
}


/** Open New Project **/

function openNewProject(){
  getProjectDir( dir =>{
    readFiles(dir);
  })
}


/** Read Open Files No Directory **/

function readNonProjectFiles(){
  let html = "";
  for(let i=0; i<= openFiles.length-1; i++){
    var fileObject = openFiles[i];
    let file = fileObject.name;
    if(file)
    {
      let fname = path.basename(file);
      if(file == currentFile && (fileObject.content !== fileObject.ocontent)){
        html += createDirectoryLink("file", file, "save active");
      }else if(file == currentFile){
        html += createDirectoryLink("file", file, "active");
      }else if((fileObject.content !== fileObject.ocontent)){
        html += createDirectoryLink("file", file, "save");
      }else{
        html += createDirectoryLink("file", file, "");
      }
    }
  }
  document.getElementById("directory").innerHTML = html;
  setListeners();
}


/** Read Files **/

let readFiles = (projectDir) => {
  if(projectDir){
    let directContent = "";
    document.getElementById("directory").innerHTML = "";
    readFilesFromDir(projectDir, function(html){
      addToOpenDirectory(projectDir);
      directContent += createDirectoryLink("dir", projectDir);
      if( openDir.indexOf(projectDir) !== -1){
        directContent += openSubDirectory();
        directContent += html;
        directContent += closeSubDirectory();
      }
      document.getElementById("directory").innerHTML = directContent;
      setListeners();
    });
  }else if(openFiles.length > 0){
      // show open files
    readNonProjectFiles();
  }else {
    document.getElementById("directory").innerHTML = "";
  }
}

/** Recent Projects **/

function loadRecentProjects(){
  let html = '';
  db.getAllProjects({}, function (err, docs) {
    docs.forEach(function(project){
      let projectName = helper.getDirectoryName(project.name);
      html += `<li class="list-group-item list-group-item-action recent-project" data-filepath="${project.name}">${projectName}</li>`;
    });
    document.getElementById('recent-projects').innerHTML = html;
    const divs = document.querySelectorAll('.recent-project');
    divs.forEach( el => {
      el.addEventListener('click', e=>{
        openProject(e, e.target.getAttribute("data-filepath"));
      })
    })
  });

}



function scrollCmdViewDown(){
  let cmdView = document.getElementById("cmd-layout-content");
  cmdView.scrollTo(0,cmdView.scrollHeight);
}

/* Open Project */

function openProject(event, filepath){
  closeProject();
  currentProject = filepath;
  editor.session.setValue("");
  currentFile = null;
  currentDirectory = filepath;
  saveLastProject(filepath);
  hideShowModal('hide','projects-modal');
  updatePageTitle("");
  setCurrentProjectName(path.basename(filepath))
  refreshView();
}


/** Clear Current Project **/

function clearProject(){
  editor.session.setValue("");
  imageViewer.src = "";
  updatePageTitle("");
  openFiles = [];
  currentFile = null;
  selectedFileElement = null;
  clearTasksView();
}

function closeProject(){
  currentProject = null;
  currentDirectory = null;
  editor.session.setValue("");
  imageViewer.src = "";
  updatePageTitle("");
  setCurrentProjectName("");
  sideBarManager.closeSideBars();
  openFiles = [];
  settings.delete("currentproject");
  refreshView();
}



/** Initalize Application **/

function init(){
  setModalsCloseEvents();
  getProjectDir(dir=>{
    readFiles(dir)
  })
  makeResizable();
  makeTopResizable();
  makeDraggable();
  updateAfterResize();
  makeResizableLeft();
}


function updatePageTitle(title){
  document.title = "wfCodeEditor - " + title;
}

/** Messages and Loggin **/

function setMessageBox(msg){

}

function messageLog(log){
  setMessageBox(log);
}

/** Window Resize Views and Elements Function **/

function updateAfterResize(){
  var rightPanel = document.getElementById('right-panel');
  var containerPanel = document.getElementById('panel-container');
  var leftPanel = document.getElementById('left-panel');
  var appPanel = document.getElementById('app');
  var codePanel = document.getElementById("code-input");
  var tabsPanel = document.getElementById('file-tabs');
  var sideBarPanel = document.getElementById('side-bar');
  var cmdPanel = document.getElementById('cmd-layout');
  var newFileModal = document.getElementById("new-file-modal");
  let tasksBar = document.getElementById('sbl-tasks');
  let snippetsBar = document.getElementById('sbl-snippets');
  let codeViewBar = document.getElementById('sbl-codeview');
  let webViewBar = document.getElementById('sbl-webview');
  let imageView = document.getElementById("image-viewer");
  var cmdHeight = cmdPanel.clientHeight;
  leftPanel.style.height =(window.innerHeight - 40) -cmdHeight +'px'
  var winHeight = (window.innerHeight - 115);
  if(tabsPanel.clientHeight > 50){
    winHeight +=  50 - tabsPanel.clientHeight;
  }
  editor.container.style.height = (winHeight - cmdHeight) +'px'
  editor.resize();
  containerPanel.style.height = (window.innerHeight) - cmdHeight +'px';
  sideBarPanel.style.height = (window.innerHeight - 58 - cmdHeight) +'px';

  tasksBar.style.height = (window.innerHeight - 200) -cmdHeight +'px';
  snippetsBar.style.height = (window.innerHeight - 200) -cmdHeight +'px';
  codeViewBar.style.height = (window.innerHeight - 140) -cmdHeight +'px';
  webViewBar.style.height = (window.innerHeight - 200) - cmdHeight + 'px';
  //imageView.style.height = (window.innerHeight - 100) + 'px';
 // imageView.style.width = (window.innerWidth - 10) + 'px';
  resizeImageView();

  newFileModal.style.top = (( window.innerHeight + 50) - window.innerHeight) + 'px';
  newFileModal.style.left = (appPanel.innerWidth/2)+ 'px';
  rightPanel.style.width = ((containerPanel.clientWidth -10) -  (Math.round(leftPanel.getBoundingClientRect().width))) + "px";
  console.log("resize event");
}

// resize image View is src is active
function resizeImageView(){
  let imageContainer = document.getElementById("image-view");
  let imageView = document.getElementById("image-viewer");
  if(imageContainer.style.display === 'block'){
    let path = (imageView.getAttribute('src')) ? imageView.getAttribute("src") : null;
    if(path){
      var image = new Jimp(path, function (err, image) {
        //var w = image.bitmap.width; //  width of the image
        var h = image.bitmap.height; // height of the image
        if(h < (window.innerHeight -100) ){
          imageView.style.height = h + 'px';
        }else{
          imageView.style.height = window.innerHeight -100 + 'px';
        }
      });
    }
  }
}


// drag on left edges

function makeResizableLeft(){
  interact('.resize-drag-left')
      .resizable({
        margin: 30,
        distance: 5,
        // resize from all edges and corners
        edges: {left: true },
        listeners: {
          move (event) {
            var target = event.target
            var x = (parseFloat(target.getAttribute('data-x')) || 0)
            var y = (parseFloat(target.getAttribute('data-y')) || 0)
            target.style.width = event.rect.width + 'px'
            target.style.height = event.rect.height + 'px'
            x += event.deltaRect.left
            y += event.deltaRect.top
            //target.style.transform = 'translate(' + x + 'px,' + y + 'px)'
            target.setAttribute('data-x', x)
            target.setAttribute('data-y', y)
          }
        },
        modifiers: [
          // keep the edges inside the parent
          interact.modifiers.restrictEdges({
            outer: 'parent'
          }),
          // minimum size
          interact.modifiers.restrictSize({
            min: { width: 160, height: 100 }
          })
        ],
        inertia: true
      })
}


function makeResizable(){
  var rightPanel = document.getElementById('right-panel');
  var containerPanel = document.getElementById('panel-container');
  interact('.resize-drag')
      .resizable({
        margin: 30,
        distance: 5,
        // resize from all edges and corners
        edges: {right: true },
        listeners: {
          move (event) {
            var target = event.target
            var x = (parseFloat(target.getAttribute('data-x')) || 0)
            var y = (parseFloat(target.getAttribute('data-y')) || 0)
            target.style.width = event.rect.width + 'px'
            target.style.height = event.rect.height + 'px'
            x += event.deltaRect.left
            y += event.deltaRect.top
            target.style.transform = 'translate(' + x + 'px,' + y + 'px)'
            target.setAttribute('data-x', x)
            target.setAttribute('data-y', y)
            updateAfterResize();
          }
        },
        modifiers: [
          // keep the edges inside the parent
          interact.modifiers.restrictEdges({
            outer: 'parent'
          }),
          // minimum size
          interact.modifiers.restrictSize({
            min: { width: 160, height: 50 }
          })
        ],
        inertia: true
      })
}

function makeTopResizable(){
  interact('.resize-drag-top')
      .resizable({
        margin: 30,
        distance: 5,
        // resize from all edges and corners
        edges: {top: true },
        listeners: {
          move (event) {
            var target = event.target
            var x = (parseFloat(target.getAttribute('data-x')) || 0)
            var y = (parseFloat(target.getAttribute('data-y')) || 0)
            target.style.height = event.rect.height + 'px'
            y += event.deltaRect.top
            target.setAttribute('data-x', x)
            target.setAttribute('data-y', y)
            updateAfterResize();
          }
        },
        modifiers: [
          // keep the edges inside the parent
          interact.modifiers.restrictEdges({
            outer: 'parent'
          }),
          // minimum size
          interact.modifiers.restrictSize({
            min: { width: 160, height: 50 }
          })
        ],
        inertia: true
      });
}


function makeDraggable(){
  interact('.draggable-content')
      .draggable({
        inertia: true,
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: '.right-panel',
            endOnly: true
          })
        ],
        autoScroll: true,
        listeners: {
          move(event) {
            var containerPanel = document.getElementById('panel-container');
            var modalPanel = document.getElementById("new-file-modal");
            var appPanel = document.getElementById('app');
            var target = event.target
            // keep the dragged position in the data-x/data-y attributes
            var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
            var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
            target.setAttribute('data-x', x)
            target.setAttribute('data-y', y)
            // translate the element
            //target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
            console.log((appPanel.clientWidth/2 + x))

            modalPanel.style.left = ( x) + 'px';
            modalPanel.style.top = (y)+ 'px';
          }
        }
      })
}


function onBlurEvents(){
  checkIfCurrentFileIsEdited();
}

function checkIfCurrentFileIsEdited(){
  if(currentFile){
    if(isFileEdited(currentFile)){
      // onFileClickEvent(null, currentFile)
    }
  }
}

function isFileEdited(file){
  let statsObj = fs.statSync(file);
  let fileObject = helper.getObjectFromArrayByKey(openFiles,"name", file);
  if(fileObject !== null){
    if(fileObject.lastmod !== statsObj.mtime){
      return true;
    }
  }
  return false;
}

function openInExplorer(){
  var pathToOpen = null;
  if(selectedFileElement){
    let file = selectedFileElement.getAttribute("data-path")
    var stats = fs.statSync(file);
    if(stats.isDirectory()){
      pathToOpen = file;
    }else{
      pathToOpen = path.dirname(file);
    }
  }else{
    pathToOpen = currentProject;
  }
  if(pathToOpen){
    openExplorer(pathToOpen, err => {
      if(err) {
        console.log(err);
      }
      else {
        //Do Something
      }
    });
  }
}

function deletedSelectItem(action){
  if(action == 0) {
    if (selectedFileElement) {
      let file = selectedFileElement.getAttribute("data-path")
      var stats = fs.statSync(file);
      if (stats.isDirectory()) {
        try {
          fs.rmdirSync(file, { recursive: true });
          console.log("TEST FOLDER DELETE OK");
        } catch (err) {
          console.error(err);
        }
      } else {
        try {
          fs.unlinkSync(file);
          // console.log("SYNC DELETE OK");
        } catch (err) {
          console.error(err);
        }
      }
      helper.removeFromObjectArray(openFiles, "name", file);
      refreshView();
    }
  }
}

function setModalTitle(title, description){
  modalTitle.innerText = title;
  if(description){
    modalDescription.innerText = description;
  }
}

function addToOpenDirectory(file){
  if(!helper.exitsInArray(openDir, file)){
    openDir.push(file)
    return true;
  }
  return false;
}


function copyFileOrFolder(){
  if(selectedFileElement){
    let filePath = selectedFileElement.getAttribute("data-path");
    clipboard.writeText(filePath);
  }
}

function copyADirectory(folderpath){
  let srcDir = folderpath;
  let folderName = path.basename(srcDir);
  let selectedPath = selectedFileElement.getAttribute("data-path");
  let selectedPathStats = fs.statSync(selectedPath);
  let destFolder = null;
  if(selectedPathStats.isDirectory()){
    destFolder = selectedPath;
  }else{
    destFolder = path.dirname(selectedPath);
  }
  if (!fs.existsSync(path.join(destFolder, folderName))){
    fs.mkdirSync(path.join(destFolder, folderName));
    fs.copy(folderpath, path.join(destFolder, folderName), err => {
      if (err) return console.error(err)
      console.log('success!')
      refreshView();
    }) // copies file
  }

}

function pasteBuffer(){
  const text = clipboard.readText();
  if(fs.existsSync(text) ){
    let file = text;
    let stats = fs.statSync(file);
    if(!stats.isDirectory()){
      copyAFile(file);
    }else{
      copyADirectory(file);
    }
  }
}

function getFileStats(file){
  let fileExists = fs.existsSync(file);
  if(fileExists ){
    let stats = fs.statSync(file);
    if(!stats.isDirectory()){
      return {
        name : file,
        directory : false,
        fileexists : true
      }
    }else{
      return {
        name : file,
        directory : true,
        fileexists : true
      }
    }
  }else{
    return {
      name : file,
      directory : false,
      fileexists : false
    }
  }
}


function closeSelectedTab(){
  let tabFile = selectedTab.getAttribute('data-file');
  helper.removeFromObjectArray(openFiles,"name",tabFile);
  if(openFiles[openFiles.length-1] !== undefined){
    onFileClickEvent(null, openFiles[openFiles.length-1].name);
  }else{
    clearProject();
  }
  refreshView();
}


function closeAllTabs(){
  let size = openFiles.length;
  if(size > 0){
    let fileObject = openFiles[size-1];
    closeATab(fileObject.name, ()=>{
      createTabs();
      closeAllTabs();
    });
  }else{
    clearProject();
  }
}

function closeAllOtherTabs(currentSize){
  let size = currentSize === undefined ? openFiles.length : currentSize;
  if(size > 0){
    let fileObject = openFiles[size-1];
    if(fileObject.name !== selectedTab.getAttribute("data-file")){
      closeATab(fileObject.name, ()=>{
        createTabs();
        closeAllOtherTabs();
      });
    }else{
      size--;
      closeAllOtherTabs(size);
    }
  }else{
    console.log("last file");
    let fileObject = openFiles[0];
    onFileClickEvent(null, fileObject.name);
    createTabs();
    //clearProject();
  }
}


function closeATab(file, callback){
  let fileObject = helper.getObjectFromArrayByKey(openFiles,'name', file);
  if(fileObject){
    if((fileObject.content !== fileObject.ocontent)){
      ipcRenderer.invoke('show-confirm-dialog',{
        title: 'Unsaved changes to file',
        buttons: ["Yes","No"],
        message: "Save changes to this file"
      }).then((result)=>{
        if(result.response ==0){
          saveAFile(fileObject.name, fileObject.content);
          removeATab(fileObject);
          callback();
        }else{
          removeATab(fileObject);
          callback();
        }
      });
    }else{
      removeATab(fileObject);
      callback();
    }
  }
}

function removeATab(fileObject){
  helper.removeFromObjectArray(openFiles,"name",fileObject.name);
  refreshView();
}



function readFilesFromDirAsync(dir) {
  return new Promise(function(resolve, reject) {
    fs.readdir(dir, function (err, files) {
      if (err) {
        reject(err);
      }
      resolve(files);
    });
  });
}


function readFilesFromDirSync(dir, callback) {
  let files = fs.readdirSync(dir);
  callback(files);
}


function readFilesFromDir(dir, callback) {
  let fileListing = '';
  let directoryListing = '';
  readFilesFromDirSync(dir, (files)=>{
    files.forEach(function (file) {
      file = path.resolve(dir, file);
      var stats = fs.statSync(file);
      if(stats.isDirectory()){
        if(currentDirectory === file){
          directoryListing += createDirectoryLink("dir", file,"active");
        }else{
          directoryListing += createDirectoryLink("dir", file,"");
        }
        if( openDir.indexOf( file) !== -1){
          readFilesFromDir(file, (html)=>{
            directoryListing += openSubDirectory();
            directoryListing += html;
            directoryListing += closeSubDirectory();
          });
        }
      }else{
        let ext = path.extname(file).replace(/\./g,' ').trim();
        let fileObject = helper.getObjectFromArrayByKey(openFiles,'name', file);
        if(currentFile === file){
          if(fileObject != null && (fileObject.content !== fileObject.ocontent) ){
            fileListing += createDirectoryLink("file", file,"active save");
          }else{
            fileListing += createDirectoryLink("file", file,"active");
          }
        }else{
          if(fileObject != null &&  (fileObject.content !== fileObject.ocontent)){
            fileListing += createDirectoryLink("file", file,"save");
          }else{
            fileListing += createDirectoryLink("file", file,"");
          }
        }
      }
    });
    callback(directoryListing + fileListing);
  })
}


function search(){
  editor.find(editor.getSelectedText());
}


function openSelectedFileInSideView(){
  openFileInSideView((selectedFileElement.getAttribute("data-path")));
}

function openCurrentFileInSideView(){
  openFileInSideView(currentFile);
}

function openCurrentTabInSideView(){
  openFileInSideView(selectedTab.getAttribute("data-file"));
}

function openFileInSideView(file){
  let ext = path.extname(file).replace(/\./g,' ').trim();
  if(extensions.hasOwnProperty(ext)) {
    let fileAction = extensions[ext].type;
    if (fileAction === "code") {
      sideBarManager.openSideBar(function(){
        const buffer = fs.readFileSync(file);
        setCodeView(path.basename(file),buffer.toString(), fileAction)
      }, "codeview");
    }else if(fileAction === "image"){
      sideBarManager.openSideBar(function(){;
        setCodeView(path.basename(file),file,fileAction)
      }, "codeview");
    }
  }
}

function setCodeView(title, content, type){
  document.getElementById("codeview-badge").innerText = title;
  let codePreview = document.getElementById("code-preview");
  let imagePreview = document.getElementById("side-image-view");
  if(type =='image'){
    imagePreview.setAttribute('src', content);
    imagePreview.style.display = 'block';
    codePreview.style.display = 'none';
  }else{
    document.getElementById("codeview-badge").innerText = title;
    codePreview.innerHTML = hljs.highlightAuto(content).value;
    codePreview.style.display = 'block';
    imagePreview.style.display = "none";
  }
}

/************************************* Tutorials *************************************/


function openWebView(){
  showTutorialsView(function(){
    fetchTutorials();
  })
}

function showTutorialsView(callback){
  document.getElementById("webview-element").style.display = "none";
  document.getElementById('webview-content').style.display = 'block';
  sideBarManager.openSideBar(function(){
    if(callback){
      callback();
    }
  }, "webview");
}

function fetchTutorials(){
  currentTutorialAction = "tutorials";
  if(tutorialsPagination){
    fetch("https://app.wftutorials.com/api/Tutorials?page="+ (tutorialsPagination.currentPage+2))
        .then(response => response.json())
        .then(data => showTutorials(data))
  }else{
    fetch("https://app.wftutorials.com/api/Tutorials")
        .then(response => response.json())
        .then(data => showTutorials(data))
  }
}

function fetchSearchTutorials(){
  let query = document.getElementById('search-tutorial-query').value;
  if(query){
    if(tutorialsPagination){
      fetch("https://app.wftutorials.com/api/searchtutorials?page="+ (tutorialsPagination.currentPage+2)+'&q='+query)
          .then(response => response.json())
          .then(data => showTutorials(data))
    }else{
      fetch("https://app.wftutorials.com/api/searchtutorials?q="+ query)
          .then(response => response.json())
          .then(data => showTutorials(data))
    }
  }
}

function showTutorials(data){
  let template = '';
  allTutorials = [].concat(allTutorials, data.tutorials);
  console.log(data.meta);
  tutorialsPagination = data.meta;
  //console.log(allTutorials)
  let myTutorials = allTutorials;
  myTutorials.forEach((tutorial)=>{
    template += `<div data-id="${tutorial.id}" class="card mb-3 tutorial-item" data-website="https://app.wftutorials.com/tutorial/mobile/${tutorial.id}?noandroid">
                  <img class="card-img-top" src="${tutorial.featuredImage}" alt="featured image">
                  <div class="card-body">
                    <h5 class="card-title">${tutorial.title}</h5>
                    <p class="card-text">${tutorial.description}</p>
                    <span class="badge badge-info">${tutorial.category}</span>
                  </div>
                </div>`;
  })
  template += `<button id="load-more-tutorials" type="button" class="btn btn-light btn-block mt-3 mb-5">Load More</button>`;
  document.getElementById("webview-content").innerHTML = template;
  // listeners
  document.getElementById('load-more-tutorials').addEventListener('click', e=>{
     e.preventDefault();
     fetchTutorials();
  });
  const divs = document.querySelectorAll('.tutorial-item');
  divs.forEach( el => {
    el.addEventListener('contextmenu', e => {
      selectedTutorialElement = e.currentTarget;
      console.log(selectedTutorialElement)
      ipcRenderer.invoke('show-context-menu',"tutorials");
      e.preventDefault();
    })

    el.addEventListener('dblclick', (event) => {
      let wl = document.getElementById('webview-layout');
      tutorialsViewScrollPosition =  wl.scrollTop;
       console.log(wl.scrollTop);
      var tutorialUrl = el.getAttribute('data-website');
      if (tutorialUrl) {
        document.getElementById('webview-content').style.display = 'none';
        var wv = document.getElementById("webview-element");
        wv.style.display = "block";
        wv.setAttribute('src',tutorialUrl);
        wv.onload = function(){
          wv.style.display = "block";
        }
      }
    });
  });
}

function openTutorialInBrowser(){
  if(selectedTutorialElement){
    let tutorialId = selectedTutorialElement.getAttribute('data-id');
    if(tutorialId){
      let tutorialsUrl = `https://app.wftutorials.com/tutorial/${tutorialId}`;
      shell.openExternal(tutorialsUrl);
    }
  }
}

function openTutorialInWindow(){
  let tutorialId = selectedTutorialElement.getAttribute('data-id');
  let tutorialsUrl = `https://app.wftutorials.com/tutorial/mobile/${tutorialId}?noandroid`;
  ipcRenderer.invoke('show-tutorial', tutorialsUrl);
}

function copyTutorialLinkToClipboard(){
  if(selectedTutorialElement){
    let tutorialId = selectedTutorialElement.getAttribute('data-id');
    if(tutorialId){
      let tutorialsUrl = `https://app.wftutorials.com/tutorial/${tutorialId}`;
      clipboard.writeText(tutorialsUrl);
    }
  }
}

function searchTutorials(){
  allTutorials = [];
  tutorialsPagination = null;
  currentTutorialAction = "search";
  fetchSearchTutorials();
}