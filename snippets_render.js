const { ipcRenderer } = require('electron')

let snippetListing = document.getElementById('snippets-listing');
let snippettype = null;
const snippetsManager = require('./snippets');
let currentSnippetType = null;


document.getElementById("search-snippets").addEventListener('click', e => {
  let query = document.getElementById('search-query').value;
  if(query){
    searchSnippets(query);
  }else{
    if(currentSnippetType){
      loadSnippets(currentSnippetType);
    }
  }
});

// search for snippet on enter
document.getElementById("search-query").addEventListener("keyup", function(e) {
  if (e.which === 13) {
    let query = document.getElementById('search-query').value;
    if(query){
      searchSnippets(query);
    }else{
      if(currentSnippetType){
        loadSnippets(currentSnippetType);
      }
    }
  }
});



function displaySnippets(snippets, type){
  var htmlView  = "";
  for (let x in snippets) {
    var snObject = snippets[x];
    htmlView += `<li class="list-group-item snippet-item list-group-item-action" data-snippet-id="${x}" data-snippet-type="${type}">${snObject['name']}</li>`;
    console.log(x + ": "+ snippets[x]);
  }

  snippetListing.innerHTML = htmlView;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  const divs = document.querySelectorAll('.snippet-item');
  divs.forEach( el => {
    el.addEventListener('click', e=>{
      var snId =  e.target.getAttribute("data-snippet-id");
      var sType = e.target.getAttribute("data-snippet-type");
      ipcRenderer.invoke('set-code-to-view',snId, sType).then(dbPath=>{
        console.log('send to main process');

      });

    })
  })
}

function loadSnippets(snippetType){
  currentSnippetType = snippetType;
  document.getElementById('title-bar').innerText = snippetType.toUpperCase() + " SNIPPETS";
  let snippets = snippetsManager.getSnippets(snippetType);
  displaySnippets(snippets, snippetType);
}

function searchSnippets(query){
  let snippets = snippetsManager.getSnippets(currentSnippetType);
  let searchResults = {};
  for (let x in snippets) {
    var obj = snippets[x];
    if(obj["name"].toLowerCase().indexOf(query.toLowerCase()) !== -1){
      searchResults[x] = obj;
    }
  }
  displaySnippets(searchResults, currentSnippetType);

}
