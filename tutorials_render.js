const { ipcRenderer, clipboard,  shell } = require('electron')
const hljs = require('highlight.js');
const Jimp = require('jimp');
let webView = document.getElementById('webview-element');
let imageView = document.getElementById('image-view');
let codeView = document.getElementById('code-view');
let views = [webView, imageView, codeView];

ipcRenderer.on('get-tutorial-data', function (evt, message) {

    if(message.type === "link"){
        let wv = webView;
        hideOtherViews(webView);
        wv.setAttribute('src',message.content);
        updateAfterResize();
        wv.onload = function(){
            wv.style.display = "block";
        }
    }else if(message.type === "code"){
        hideOtherViews(codeView);
        codeView.innerHTML = hljs.highlightAuto(message.content).value;
        codeView.style.display = "block";
    }else if(message.type === 'image'){
        hideOtherViews(imageView);
        imageView.setAttribute('src', message.content);
        imageView.style.display = 'block';
        updateAfterResize();
    }
});

function hideOtherViews(except){
    views.forEach((el)=>{
        if(el !== except){
            el.style.display = 'none';
        }
    })
}

function resizeAll(){
    updateOnResize();
    updateAfterResize();
}

function updateOnResize(){
    webView.style.height = window.innerHeight  + 'px';
    webView.style.width = window.innerWidth -30 + 'px';
    codeView.style.height = window.innerHeight -10 + 'px';
    codeView.style.width = window.innerWidth -10 +  'px';
}


function updateAfterResize(){
    if(imageView.style.display === 'block'){
        let path = (imageView.getAttribute('src')) ? imageView.getAttribute("src") : null;
        if(path){
            var image = new Jimp(path, function (err, image) {
                //var w = image.bitmap.width; //  width of the image
                var h = image.bitmap.height; // height of the image
                if(h < (window.innerHeight) ){
                    imageView.style.height = h + 'px';
                }else{
                    imageView.style.height = window.innerHeight + 'px';
                }
            });
        }
    }
}