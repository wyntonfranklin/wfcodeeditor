module.exports =  {
    createMenu : (webContents, dialog, db) => {
     return [
        {
          label: 'File',
          submenu: [
            {
              label: 'New Project',
              click: () => {
                var filename = dialog.showOpenDialogSync(
                  { defaultPath: '', properties: ['openDirectory'] });
                console.log(filename[0]);
                db.projects.insert([
                  {
                  'name' : filename[0]
                }], function (err, newDocs) {

                });
                db.settings.insert([
                  {
                    'name' : "current-project",
                    'value' : filename[0]
                  }], function (err, newDocs) {

                });
                webContents.executeJavaScript(`readFiles()`)
              },
              accelerator: 'CTRL+P'
            },
            {
              label: 'New File',
              click: () => {
                webContents.executeJavaScript(`createANewFile()`)
              },
              accelerator: 'CTRL+N'
            },
            { label: 'New Folder',
              click: () => {
                webContents.executeJavaScript(`createANewFolder()`)
              },},
            {
              label: 'Recent Projects',
              click: () => {
                webContents.executeJavaScript(`createANewFile()`)
              },
            },
            {
              label: 'Save',
              click: () => {
                webContents.executeJavaScript(`saveCurrentFile()`)
              },
              accelerator: 'CTRL+S'
            },
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
