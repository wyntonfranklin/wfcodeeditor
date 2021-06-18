// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

let baseDir = 'C:\\Users\\wfranklin\\Documents\\snippets';
let currentProject = null;
const fs = require("fs")
var path = require('path');
let Datastore = require('nedb');
let db = {};
const { ipcRenderer } = require('electron')

ipcRenderer.invoke('read-user-data').then(dbPath=>{
  let db = loadDatabases(dbPath);
  db.settings.findOne({name:"current-project"}, function (err, doc) {
    console.log(doc.value)
    currentProject = doc.value;
    readFiles(doc.value);
  });

});

function loadDatabases(dbPath){
  db.projects = new Datastore(dbPath +'/projects.db');
  db.settings = new Datastore(dbPath +'/settings.db');
  db.projects.loadDatabase();
  db.settings.loadDatabase();
  return db;
}

const helper = require('./helper.js');

let currentFile = "";
let currentDirectory = "";

let directoryUi = document.getElementById('directory');
let backdropUi = document.getElementById('backdrop');
let modalUi = document.getElementById('new-file-modal');

let closeModalButton = document.getElementById('close-modal');
let closeModalXButton = document.getElementById('close-modal-x');
let saveButton = document.getElementById('save-file-btn');
let fileNameInput = document.getElementById("file-name-input");

let saveFileButton = document.getElementById('save-file-button');
let saveFolderButton = document.getElementById('save-folder-button');

let CURRENT_FILE_OPENER_ACTION = null;
var openDir = [];
var editor = ace.edit("code-input");
editor.setTheme("ace/theme/twilight");
editor.getSession().on("change", e => {
    helper.addElementClass(saveFileButton,"btn-success");
    helper.removeElementClass(saveFileButton,"btn-primary");
})


closeModalXButton.addEventListener('click', e => {
  hideShowModal("hide");
});

closeModalButton.addEventListener('click', e => {
  hideShowModal("hide");
});

function setSaveButtonAsActive(){
  helper.addElementClass(saveFileButton,"btn-success");
  helper.removeElementClass(saveFileButton,"btn-secondary");
}

function setSaveButtonAsInActive(){
  helper.addElementClass(saveFileButton,"btn-secondary");
  helper.removeElementClass(saveFileButton,"btn-success");
}


function onFileClickEvent(e){
  setSaveButtonAsInActive();
}


saveFileButton.addEventListener("click", e=> {
  saveCurrentFile();
});

function saveCurrentFile(){
  if(currentFile){
    var code = editor.getValue();
    saveAFile(currentFile, code);
    setSaveButtonAsInActive();
  }
}

function saveAFile(path,content) {
  fs.writeFile(path, content, function (err) {
    if (err) {
      return console.log(err);
    }
  });
}

function saveADirectory(path){
  fs.mkdir(path, (err) => {
    if (err) {
      throw err;
    }
    console.log("Directory is created.");
  });
}

saveButton.addEventListener("click", e => {
  let filename = fileNameInput.value;
  if(CURRENT_FILE_OPENER_ACTION == "file"){
    saveAFile(getCurrentDirectory()  + "/" + filename, "");
  }else if(CURRENT_FILE_OPENER_ACTION == "dir"){
    saveADirectory(getCurrentDirectory() + "/" + filename);
  }
  console.log("The file was saved!");
  hideShowModal('hide');
  readFiles(currentProject);
});

document.getElementById('new-file').addEventListener('click', e => {
  CURRENT_FILE_OPENER_ACTION = "file";
    hideShowModal("show");
})

function createANewFile(){
  CURRENT_FILE_OPENER_ACTION = "file";
  hideShowModal("show");
}

function createANewFolder(){
  CURRENT_FILE_OPENER_ACTION = "dir";
  hideShowModal("show");
}

saveFolderButton.addEventListener('click', e => {
  CURRENT_FILE_OPENER_ACTION = "dir";
  hideShowModal("show");
});

function hideShowModal(action){
  if(action == "show"){
    backdropUi.style.display = "block";
    modalUi.style.display = "block";
  }else{
    backdropUi.style.display = "none";
    modalUi.style.display = "none";
  }

}

function getCurrentDirectory(){
  if(currentDirectory){
    return currentDirectory;
  }else{
    return path.dirname(currentFile)
  }
}

let createDirectoryLink = (type, file, styleclass) => {
  let fname = path.basename(file);
  let fileIcon = getIcon(file);
  console.log(fileIcon);
  let  tempFolder = ` <li class="directory-parent"><a title="${fname}" data-type="dir" data-path="${file}" class="file-link ${styleclass}"><img src="./icons/ic_folder.png"> ${fname}</a></li>`;
  let  tempFile = ` <li class="directory-parent"><a title="${fname}" data-type="file" data-path="${file}" class="file-link ${styleclass}"><img src="${fileIcon}"> ${fname}</a></li>`;
  if(type === 'dir'){
    return tempFolder;
  }
  return tempFile;
}

function getIcon(fname){
  let nodes = helper.modesObject();
  let ext = path.extname(fname).replace(/\./g,' ').trim()
  let defaultIcon = `./icons/ic_file.png`;
  if(nodes.hasOwnProperty(ext)){
    let iconname = `./icons/ic_${nodes[ext]}.png`;
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

let setListeners = () => {
  const divs = document.querySelectorAll('.file-link');

  divs.forEach(el => el.addEventListener('click', event => {
    let el = document.getElementById('code-input');
    let file = event.target.getAttribute("data-path");
    let fileType = event.target.getAttribute("data-type");
    undoDirectoryStyling();
    if(fileType === "file"){
      const buffer = fs.readFileSync(file);
      let ext = path.extname(file);
      editor.session.setValue(buffer.toString());
      currentFile = file;
      currentDirectory = null;
      assignAceMode(editor, ext);
      //console.log(event.target.getAttribute("data-path"));
      helper.addElementClass(event.target, "active");
      //event.target.className += " active"
      onFileClickEvent(event);
    }else if(fileType === 'dir'){
      currentDirectory = file;
      currentFile = null;
      if(helper.exitsInArray(openDir, file)){
        helper.removeFromArray(openDir, file);
      }else{
        openDir.push(file);
      }
      readFiles(currentProject)
    }
  }));
}

function assignAceMode(editor, ext){
  let modes = helper.modesObject();
  let extName = ext.replace(/\./g,' ').trim();
  if(modes.hasOwnProperty(extName)){
    editor.session.setMode("ace/mode/" + modes[extName]);
  }
}

function getProjectDir(){
  let baseDir = '';
  console.log("get project directory")
  db.settings.find({name:"current-project"}, function (err, doc) {
     //baseDir = doc.value;
     console.log(doc.value)
  });
  return baseDir;
}

function readFilesFromDir(dir) {
  let fileListing = '';
  let directoryListing = '';
  const files = fs.readdirSync(dir);
    files.forEach((file)=>{
      file = path.resolve(dir, file);
      var stats = fs.statSync(file);
      if(stats.isDirectory()){
          if(currentDirectory == file){
            directoryListing += createDirectoryLink("dir", file,"active");
          }else{
            directoryListing += createDirectoryLink("dir", file,"");
          }
          if( openDir.indexOf( file) != -1){
            directoryListing += openSubDirectory();
            directoryListing += readFilesFromDir(file);
            directoryListing += closeSubDirectory();
          }
      }else{
        let ext = path.extname(file).replace(/\./g,' ').trim();
        if(helper.modesObject()[ext]){
          fileListing += createDirectoryLink("file", file,"");
        }
      }
    })
  return directoryListing + fileListing;
}

let readFiles = (projectDir) => {

  if(projectDir){
    let html = readFilesFromDir(projectDir);
    document.getElementById("directory").innerHTML = html;
    setListeners();
  }
}


