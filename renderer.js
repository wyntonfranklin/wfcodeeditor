// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

let baseDir = 'C:\\Users\\wfranklin\\Documents\\snippets';
const fs = require("fs")
var path = require('path');
let directoryUi = document.getElementById('directory');
var openDir = [];
var editor = ace.edit("code-input");
editor.setTheme("ace/theme/twilight");



let createDirectoryLink = (type, file) => {
  let fname = path.basename(file);
  let  tempFolder = ` <li class="directory-parent"><a data-type="dir" data-path="${file}" class="file-link"><img src="./icons/ic_folder.png"> ${fname}</a></li>`;
  let  tempFile = ` <li class="directory-parent"><a data-type="file" data-path="${file}" class="file-link"><img src="./icons/ic_file.png"> ${fname}</a></li>`;
  if(type === 'dir'){
    return tempFolder;
  }
  return tempFile;
}

let openSubDirectory = () => {
   return `<ul class="directory-lister-sub">`;
}


let closeSubDirectory = () => {
  return '</ul>';
}


let setListeners = () => {
  const divs = document.querySelectorAll('.file-link');

  divs.forEach(el => el.addEventListener('click', event => {
    let el = document.getElementById('code-input');
    let file = event.target.getAttribute("data-path");
    let fileType = event.target.getAttribute("data-type");
    if(fileType === "file"){
      const buffer = fs.readFileSync(file);
      editor.session.setValue(buffer.toString());
      console.log(event.target.getAttribute("data-path"));
    }else if(fileType === 'dir'){
      openDir.push(file);
     // readFiles()
    }
  }));
}

function readFilesFromDir(dir) {
  let fileListing = '';
  const files = fs.readdirSync(dir);
    files.forEach((file)=>{
      file = path.resolve(dir, file);
      var stats = fs.statSync(file);
      if(stats.isDirectory()){
          fileListing += createDirectoryLink("dir", file);
          fileListing += openSubDirectory();
          fileListing += readFilesFromDir(file);
          fileListing += closeSubDirectory();
      }else{
        fileListing += createDirectoryLink("file", file);
      }
    })
  return fileListing;
}

let readFiles = () => {

  let html = readFilesFromDir(baseDir);
  console.log(html)
  document.getElementById("directory").innerHTML = html;
  setListeners();
}

readFiles()

