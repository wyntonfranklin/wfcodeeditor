const { ipcRenderer } = require('electron')

let snippetListing = document.getElementById('snippets-listing');
let snippettype = null;
const snippetsManager = require('./snippets');

function loadSnippets(snippetType){

  let snippets = snippetsManager.getSnippets(snippetType);
  var htmlView  = "";
  for (let x in snippets) {
    var snObject = snippets[x];
    htmlView += `<li class="list-group-item snippet-item list-group-item-action" data-snippet-id="${x}" data-snippet-type="${snippetType}">${snObject['name']}</li>`;
    console.log(x + ": "+ snippets[x]);
  }

  snippetListing.innerHTML = htmlView;

  const divs = document.querySelectorAll('.snippet-item');
  divs.forEach( el => {
    el.addEventListener('click', e=>{
      var snId =  e.target.getAttribute("data-snippet-id");
      var sType = e.target.getAttribute("data-snippet-type");
      console.log('list item clicked');
      ipcRenderer.invoke('set-code-to-view',snId, sType).then(dbPath=>{
        console.log('send to main process');

      });

    })
  })

}
