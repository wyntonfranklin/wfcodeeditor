let db = require('./database');

module.exports =  {
    createMenu : (webContents, dialog, db, snippetsDialog) => {
     return [
        {
          label: 'File',
          submenu: [
            {
              label: 'New..',
              submenu: [
                {
                  label: 'New Project',
                  click: () => {
                    var filename = dialog.showOpenDialogSync(
                      { defaultPath: '', properties: ['openDirectory'] });
                    if(filename !== undefined){
                      var currentProject = filename[0];
                      console.log(currentProject, "current");
                      webContents.send("new-project-start", {project:currentProject});
                    }
                  },
                  accelerator: 'CTRL+P'
                },
                { label: 'New Folder',
                  click: () => {
                    webContents.executeJavaScript(`createANewFolder()`)
                  },
                },
                {
                  label : 'New File',
                  click: () => {
                    webContents.executeJavaScript(`createANewFile()`)
                  },
                  accelerator: 'CTRL+N'
                },
                { label: 'New PHP File',
                  click: () => {
                    webContents.executeJavaScript(`createAPhpFile()`)
                  },
                },
                { label: 'New HTML File',
                  click: () => {
                    webContents.executeJavaScript(`createAHtmlFile()`)
                  },
                },
                { label: 'New Javascript File',
                  click: () => {
                   webContents.executeJavaScript(`createAJsFile()`)
                  },
                },
              ]
            },
            {
              label: 'Recent Projects',
              click: () => {
                webContents.executeJavaScript(`showRecentProjects()`)
              },
            },
            { type: 'separator' },
            {
              label: 'Save',
              click: () => {
                webContents.executeJavaScript(`saveCurrentFile()`)
              },
              accelerator: 'CTRL+S'
            },
            { label: 'Save as'},
            {
              label : 'Preferences'
            },
            { type: 'separator' },
            {
              label: 'Close Project',
              click: () => {
                webContents.executeJavaScript(`closeProject()`)
              },
            },
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
            {
              label: 'Search',
              click: () => {
                webContents.executeJavaScript(`searchAndReplace()`)
              },
            },
          ]
        },
       { label: 'Snippets',
         submenu: [
           {
             label: 'PHP',
             click: () => {
               snippetsDialog.webContents.executeJavaScript(`loadSnippets("PHP")`)
               snippetsDialog.show();
             },
           },
           {
             label: 'SQL',
             click: () => {
               snippetsDialog.webContents.executeJavaScript(`loadSnippets("SQL")`)
               snippetsDialog.show();
             },
           },
           {
             label: 'Javascript',
             click: () => {
               snippetsDialog.webContents.executeJavaScript(`loadSnippets("JAVASCRIPT")`)
               snippetsDialog.show();
             },
           },
           {
             label: 'HTML',
             click: () => {
               snippetsDialog.webContents.executeJavaScript(`loadSnippets("HTML")`)
               snippetsDialog.show();
             },
           }

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
            {
              label: 'Toggle Tasks',
              click: () => {
                webContents.executeJavaScript(`toggleTasksView()`)
              },
            }
          ]
        }
      ];
    }
}
