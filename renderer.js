// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const { ipcRenderer } = require('electron')
const helper = require('./helper.js');
const fs = require("fs")
var path = require('path');
let db = require('./database');

let baseDir = 'C:\\Users\\wfranklin\\Documents\\snippets';
let currentProject = null;
let APPLICATION_PATH = "";


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

let saveFileButton = document.getElementById('save-file-button');
let saveFolderButton = document.getElementById('save-folder-button');
let ACTIVE_MODAL_ID = "";
let CURRENT_FILE_OPENER_ACTION = null;
var openDir = [];
var editor = ace.edit("code-input");
editor.setTheme("ace/theme/twilight");
editor.getSession().on("change", e => {
    helper.addElementClass(saveFileButton,"btn-success");
    helper.removeElementClass(saveFileButton,"btn-primary");
})



closeModalButton.addEventListener('click', e => {
  hideShowModal("hide","new-file-modal");
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
  hideShowModal('hide',"new-file-modal");
  readFiles(currentProject);
});

document.getElementById('new-file').addEventListener('click', e => {
  CURRENT_FILE_OPENER_ACTION = "file";
    hideShowModal("show","new-file-modal");
})

function createANewFile(){
  CURRENT_FILE_OPENER_ACTION = "file";
  hideShowModal("show" , "new-file-modal");
}

function createANewFolder(){
  CURRENT_FILE_OPENER_ACTION = "dir";
  hideShowModal("show", "new-file-modal");
}

function showRecentProjects(){
  loadRecentProjects();
  hideShowModal("show", "projects-modal");
}

saveFolderButton.addEventListener('click', e => {
  CURRENT_FILE_OPENER_ACTION = "dir";
  hideShowModal("show","new-file-modal");
});

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
      console.log("click");
      if(helper.exitsInArray(openDir, file)){
        helper.removeFromArray(openDir, file);
      }else{
        openDir.push(file);
      }
      readFiles(currentProject)
    }
  }));
}

function saveLastProject(filepath){
  db.saveToSettings({'name': "current-project",},{
    'name': "current-project",
    'value': filepath
  })
}

function assignAceMode(editor, ext){
  let modes = helper.modesObject();
  let extName = ext.replace(/\./g,' ').trim();
  if(modes.hasOwnProperty(extName)){
    editor.session.setMode("ace/mode/" + modes[extName]);
  }
}

function getProjectDir(callback){
  console.log("get project directory")
  db.getSetting({name:"current-project"}, function (err, doc) {
    if(doc === null){
      console.log("this is null")
    }
    console.log(doc.value);
    currentProject = doc.value;
     callback( doc.value)
  });
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

function openNewProject(){
  getProjectDir( dir =>{
    console.log(dir)
      readFiles(dir);
  })
}

let readFiles = (projectDir) => {

  if(projectDir){
    let html = readFilesFromDir(projectDir);
    document.getElementById("directory").innerHTML = html;
    setListeners();
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
          currentProject = e.target.getAttribute("data-filepath");
          editor.session.setValue("");
          currentFile = null;
          currentDirectory = currentProject;
          saveLastProject(currentProject);
          readFiles(currentProject);
          hideShowModal('hide','projects-modal');
      })
    })
  });

}


function init(){
  setModalsCloseEvents();
  getProjectDir(dir=>{
    readFiles(dir)
  })
}



