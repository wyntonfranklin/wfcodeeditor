

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
                    webContents.executeJavaScript(`openFileSelectDialog()`);
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
                { label: 'New Bash File',
                  click: () => {
                    webContents.executeJavaScript(`createABashFile()`)
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
                webContents.executeJavaScript(`openAddFileToProjectDialog()`)
              },
            },
            {
              label: 'Open Project',
              click: () => {
                webContents.executeJavaScript(`openFileSelectDialog()`)
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
           {
             label: 'C#',
             click: () => {
               snippetsDialog.webContents.executeJavaScript(`loadSnippets("CSHARP")`)
               snippetsDialog.show();
             },
           },
           {
             label: 'C++',
             click: () => {
               snippetsDialog.webContents.executeJavaScript(`loadSnippets("CPP")`)
               snippetsDialog.show();
             },
           },

         ]
       },
        {
          label: 'Actions',
          submenu: [
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
