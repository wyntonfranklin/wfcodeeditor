const { ipcRenderer } = require('electron')

let snippetListing = document.getElementById('snippets-listing');


var php = require("./snippets/php");
var info = JSON.parse(JSON.stringify(php));

var htmlView  = "";
for (let x in info) {
  var snObject = info[x];
  htmlView += `<li class="list-group-item snippet-item" data-snippet-id="${x}">${snObject['name']}</li>`;
  console.log(x + ": "+ info[x]);
}

snippetListing.innerHTML = htmlView;

const divs = document.querySelectorAll('.snippet-item');
divs.forEach( el => {
  el.addEventListener('click', e=>{
    var snId =  e.target.getAttribute("data-snippet-id");
    console.log('list item clicked');
    ipcRenderer.invoke('set-code-to-view',snId).then(dbPath=>{
      console.log('send to main process');

    });

  })
})
