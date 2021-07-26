

module.exports =  {
    createMenu : (webContents, dialog, snippetsDialog, settingsDialog) => {
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
                      { defaultPath: '', properties: ['openDirectory','createDirectory','promptToCreate'] });
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
                { type: 'separator' },
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
                { label: 'New Python File',
                  click: () => {
                    webContents.executeJavaScript(`createAPythonFile()`)
                  },
                },
                { label: 'New CSS File',
                  click: () => {
                    webContents.executeJavaScript(`createACssFile()`)
                  },
                },
                { label: 'New SQL File',
                  click: () => {
                    webContents.executeJavaScript(`createASqlFile()`)
                  },
                },
              ]
            },
            {
              label: 'Open File',
              click: () => {
                var filename = dialog.showOpenDialogSync(
                    { defaultPath: '', properties: ['openFile'] });
                if(filename !== undefined){
                  var currentFilename = filename[0];
                  webContents.send("open-file", {file:currentFilename,action:'open'});
                }
              },
            },
            {
              label: 'Add File to Project',
              click: () => {
                var filename = dialog.showOpenDialogSync(
                    { defaultPath: '', properties: ['openFile'] });
                if(filename !== undefined){
                  var currentFilename = filename[0];
                  webContents.send("open-file", {file:currentFilename, action:'save'});
                }
              },
            },
            {
              label: 'Open Project',
              click: () => {
                var filename = dialog.showOpenDialogSync(
                    { defaultPath: '', properties: ['openDirectory'] });
                if(filename !== undefined){
                  var currentProject = filename[0];
                  console.log(currentProject, "current");
                  webContents.send("new-project-start", {project:currentProject});
                }
              },
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
            { label: 'Save as',
              click: () => {
                webContents.executeJavaScript(`saveAsCurrentFile()`)
              },
            },
            {
              label : 'Preferences',
              click: () => {
                settingsDialog.show();
              },
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
             label: 'My Snippets',
             click: () => {
               webContents.executeJavaScript(`openSnippetsView()`)
             },
           },
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
           },
           {
             label: 'PYTHON',
             click: () => {
               snippetsDialog.webContents.executeJavaScript(`loadSnippets("PYTHON")`)
               snippetsDialog.show();
             },
           },

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
              accelerator: 'CommandOrControl+Shift+T'
            },
            {
              label: 'Toggle Snippets',
              click: () => {
                webContents.executeJavaScript(`toggleSnippetsView()`)
              },
              accelerator: 'CommandOrControl+Shift+S'
            },
            {
              label: 'View Online Tutorials',
              click: () => {
                webContents.executeJavaScript(`openWebView()`)
              },
            }
          ]
        }
      ];
    }
}
