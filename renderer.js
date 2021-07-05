// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const { ipcRenderer, clipboard,  shell } = require('electron')
const helper = require('./helper.js');
const fs = require("fs-extra")
var path = require('path');
let db = require('./database');
const extensions = require('./extensions');
const Store = require('electron-store');
const openExplorer = require('open-file-explorer');
let interact = require('interactjs')
let ncp = require("copy-paste");
const open = require('open');
let ctrlIsPressed = false;

let baseDir = 'C:\\Users\\wfranklin\\Documents\\snippets';
let currentProject = null;
let APPLICATION_PATH = "";
const settings = new Store();
let recentlyCreatedFile = null;
let openFiles = [];
let selectedFileElement = null;
let activeTabEl = null;
let activeFileBrowserEl = null;
let selectedTab = null;


ipcRenderer.invoke('read-user-data').then(dbPath=>{
  APPLICATION_PATH = dbPath;
  db.init(dbPath);
  db.loadDatabases();
  init();
});


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

let CURRENT_PROJECT_NAME = "";

let ACTIVE_MODAL_ID = "";
let CURRENT_FILE_OPENER_ACTION = null;
let CURRENT_FILE_OPENER_TYPE = null;
var openDir = [];
let copyPathHolder =  null;
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


document.getElementById("action-add-file").addEventListener('click', e=>{
  if(currentProject){
    createANewFile();
  }
  return false;
});

document.getElementById("action-add-folder").addEventListener('click', e=>{
  if(currentProject){
    createANewFolder();
  }
  return false;
});

document.getElementById("action-save-file").addEventListener('click', e=>{
  saveCurrentFile();
  return false;
});

document.getElementById("action-resize-picture").addEventListener('click', e=>{
  updateAfterResize();
  return false;
});

document.getElementById("action-open-database").addEventListener("click", e => {
  shell.openExternal("C:\\Program Files\\MySQL\\MySQL Workbench 8.0 CE\\MySQLWorkbench.exe");
  return false;
});

codeView.addEventListener('contextmenu', e=>{
  ipcRenderer.invoke('show-code-context-menu').then(dbPath=>{

  });
});


codeView.addEventListener('click', event=>{
  if(ctrlIsPressed){
    search();
    return false;
  }
});



codeView.addEventListener('keydown', event=>{
  if(event.ctrlKey){
    search();
    return false;
  }
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


function updateProjectSettings(projectPath){
  db.saveToProjects({
    'name' : projectPath
  })
  db.saveToSettings({'name': "current-project",},{
    'name': "current-project",
    'value': projectPath
  }, function(){
  })
}


function setSaveButtonAsActive(){

}

function setSaveButtonAsInActive(){

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
  setSaveButtonAsInActive();
}

function appOpenImage(event, file, ext){
  addOpenFile(file);
  hideAllViews(imageView);
  imageViewer.src = file;
  setSaveButtonAsInActive();
}

function hideAllViews(view){
  codeView.style.display = "none";
  imageView.style.display = "none";
  view.style.display = "block";
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

saveButton.addEventListener("click", e => {
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
    }
    console.log("The file was saved!");
    hideShowModal('hide',"new-file-modal");
    readFiles(currentProject);
  }
});

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


function hideShowModal(action, id){
  var el = document.getElementById(id);
  if(action == "show"){
    ACTIVE_MODAL_ID = id;
    backdropUi.style.display = "block";
    el.style.display = "block";
  }else{
    ACTIVE_MODAL_ID = null;
    backdropUi.style.display = "none";
    el.style.display = "none";
    fileNameInput.value = "";
    modalDescription.innerText = "";
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
}

function createTabs(){
  let html = '';
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
      /*
      helper.removeFromObjectArray(openFiles,"name",file);
      if(openFiles[openFiles.length-1] !== undefined){
        onFileClickEvent(null, openFiles[openFiles.length-1].name);
      }else{
        clearProject();
      }*/
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
      ipcRenderer.invoke('show-tabs-context-menu');
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
       ipcRenderer.invoke('show-file-context-menu').then(e=>{
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

   /** db.saveToSettings({'name': "current-project",},{
      'name': "current-project",
      'value': filepath
    })
    **/
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

/*
function readFilesFromDir(dir) {
  let fileListing = '';
  let directoryListing = '';
  const files = fs.readdirSync(dir);
    files.forEach((file)=>{
      file = path.resolve(dir, file);
      var stats = fs.statSync(file);
      if(stats.isDirectory()){
          if(currentDirectory === file){
            directoryListing += createDirectoryLink("dir", file,"active");
          }else{
            directoryListing += createDirectoryLink("dir", file,"");
          }
          if( openDir.indexOf( file) !== -1){
            directoryListing += openSubDirectory();
            directoryListing += readFilesFromDir(file);
            directoryListing += closeSubDirectory();
          }
      }else{
        let ext = path.extname(file).replace(/\./g,' ').trim();
        let fileObject = helper.getObjectFromArrayByKey(openFiles,'name', file);
        if(currentFile == file){
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
    })
  return directoryListing + fileListing;
}*/

function openNewProject(){
  getProjectDir( dir =>{
      readFiles(dir);
  })
}

let readFiles = (projectDir) => {
  if(projectDir){
    document.getElementById("directory").innerHTML = "";
    readFilesFromDir(projectDir, function(html){
      document.getElementById("directory").innerHTML = html;
      setListeners();
    });
  }else{
    document.getElementById("directory").innerHTML = "";
  }
}

function loadRecentProjects(){
  let html = '';
  db.getAllProjects({}, function (err, docs) {
    docs.forEach(function(project){
     // console.log(project.name, "here")
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


function clearProject(){
  editor.session.setValue("");
  imageViewer.src = "";
  updatePageTitle("");
  openFiles = [];
}

function closeProject(){
  currentProject = null;
  currentDirectory = null;
  editor.session.setValue("");
  imageViewer.src = "";
  updatePageTitle("");
  setCurrentProjectName("")
  openFiles = [];
  refreshView();
}



function init(){
  setModalsCloseEvents();
  getProjectDir(dir=>{
    readFiles(dir)
  })
  makeResizable();
  updateAfterResize();
}

function updatePageTitle(title){
  document.title = "A Code Editor - " + title;
}

function setMessageBox(msg){

}

function messageLog(log){
  setMessageBox(log);
}

function updateAfterResize(){
  var rightPanel = document.getElementById('right-panel');
  var containerPanel = document.getElementById('panel-container');
  var leftPanel = document.getElementById('left-panel');
  var appPanel = document.getElementById('app');
  var codePanel = document.getElementById("code-input");
  var tabsPanel = document.getElementById('file-tabs');
  leftPanel.style.height =(window.innerHeight - 40) +'px'
  var winHeight = (window.innerHeight - 115);
  if(tabsPanel.clientHeight > 50){
    winHeight +=  50 - tabsPanel.clientHeight;
  }
  editor.container.style.height =winHeight +'px'
  editor.resize();
  containerPanel.style.height = (window.innerHeight) +'px'
  rightPanel.style.width = ((containerPanel.clientWidth -10) -  (Math.round(leftPanel.getBoundingClientRect().width))) + "px";
  console.log("resize event");
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


          // update the element's style
          target.style.width = event.rect.width + 'px'
          target.style.height = event.rect.height + 'px'

          // translate when resizing from top or left edges
          x += event.deltaRect.left
          y += event.deltaRect.top

          target.style.transform = 'translate(' + x + 'px,' + y + 'px)'

          target.setAttribute('data-x', x)
          target.setAttribute('data-y', y)
          //target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height)
           rightPanel.style.width = (containerPanel.getBoundingClientRect().width - 10)  -  (Math.round(event.rect.width)) + "px";
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
    .draggable({
      listeners: { move: window.dragMoveListener },
      inertia: true,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: 'parent',
          endOnly: true
        })
      ]
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
