let db = require('./database');

module.exports =  {
    createMenu : (webContents, dialog, db, snippetsDialog) => {
     return [
        {
          label: 'File',
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
                  /**
                  db.saveToProjects({
                    'name' : currentProject
                  })
                  db.saveToSettings({'name': "current-project",},{
                    'name': "current-project",
                    'value': currentProject
                  }, function(){
                    console.log(currentProject)
                    webContents.executeJavaScript('openNewProject()');
                  })**/
                }
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
                webContents.executeJavaScript(`showRecentProjects()`)
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
            {
              label : 'Preferences'
            },
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
          ]
        }
      ];
    }
}
