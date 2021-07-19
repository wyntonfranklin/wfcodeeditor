const { ipcRenderer, clipboard,  shell } = require('electron')



ipcRenderer.on('get-tutorial-data', function (evt, message) {

    let wv = document.getElementById('webview-element');
    wv.setAttribute('src',message.link);
    updateAfterResize();
    wv.onload = function(){
        wv.style.display = "block";
    }
});

function updateAfterResize(){
    let wv = document.getElementById('webview-element');
    wv.style.height = window.innerHeight  + 'px';
    wv.style.width = window.innerWidth -30 + 'px';
}