module.exports =  {
    createMenu : (webContents) => {
     return [
        {
          label: 'File',
          submenu: [
            {
              label: 'New File',
              click: () => {
                webContents.executeJavaScript(`createANewFile()`)
              },
              accelerator: 'CTRL+N'
            },
            { label: 'New Folder'},
            { label: 'Save'},
            { label: 'Save as'},
            { label: 'Item 2', submenu: [ { label: 'Sub Item 1'} ]},
            { label: 'Item 3'},
            {role :  'close' }
          ]
        },
        {
          label: 'Edit',
          submenu: [
            { role: 'undo'},
            { role: 'redo'},
            { role: 'copy'},
            { role: 'paste'},
          ]
        },
        {
          label: 'Actions',
          submenu: [
            {
              label: 'DevTools',
              role: 'toggleDevTools'
            },
            {
              role: 'toggleFullScreen'
            },
          ]
        }
      ];
    }
}
