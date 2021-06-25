const { ipcRenderer } = require('electron')
const divs = document.querySelectorAll('.snippet-item');
divs.forEach( el => {
  el.addEventListener('click', e=>{
    console.log('list item clicked');
    ipcRenderer.invoke('set-code-to-view').then(dbPath=>{
      console.log('send to main process');
    });

  })
})
