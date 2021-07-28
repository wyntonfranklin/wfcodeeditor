module.exports =  {
  createMenu : (snippetsWindow, mainWindow, options) => {
    return [
      {
        label: 'Run this file',
        click: () => {
          mainWindow.webContents.executeJavaScript(`runAFile()`)
        },
      },
      { type: 'separator' },
      {
        label: 'Add Task',
        click: () => {
          mainWindow.webContents.executeJavaScript(`openTaskView()`)
        },
      },
      {
        label: 'Add Selected as Task',
        enabled : options.editorHasSelection,
        click: () => {
          mainWindow.webContents.executeJavaScript(`openTaskViewWithSelected()`)
        },
      },
      {
        label: 'Add Snippet',
        click: () => {
          mainWindow.webContents.executeJavaScript(`createASnippet()`)
        },
      },
      {
        label: 'Add Selected as Snippet',
        enabled : options.editorHasSelection,
        click: () => {
          mainWindow.webContents.executeJavaScript(`AddSelectedAsSnippet()`)
        },
      },
      { type: 'separator' },
      {
        label: 'Find',
        click: () => {
          mainWindow.webContents.executeJavaScript(`search()`)
        },
      },
      { role: 'copy'},
      { role: 'paste'},
      { type: 'separator' },
      { label: 'Open in Side View',
        click: () => {
          mainWindow.webContents.executeJavaScript(`openCurrentFileInSideView()`)
        },
      },
      { label: 'Open in New Window',
        click: () => {
          mainWindow.webContents.executeJavaScript(`openCurrentFileInNewWindow()`)
        },
      },
      { type: 'separator' },
      {
        label: 'Snippets',
        submenu: [
          {
            label: 'My Snippets',
            click: () => {
              mainWindow.webContents.executeJavaScript(`openSnippetsView()`)
            },
          },
          {
            label: 'PHP',
            enabled : options.snippetsEnabled,
            click: () => {
              snippetsWindow.webContents.executeJavaScript(`loadSnippets("PHP")`)
              snippetsWindow.show();
            },
          },
          {
            label: 'SQL',
            click: () => {
              snippetsWindow.webContents.executeJavaScript(`loadSnippets("SQL")`)
              snippetsWindow.show();
            },
          },
          {
            label: 'Javascript',
            click: () => {
              snippetsWindow.webContents.executeJavaScript(`loadSnippets("JAVASCRIPT")`)
              snippetsWindow.show();
            },
          },
          {
            label: 'HTML',
            click: () => {
              snippetsWindow.webContents.executeJavaScript(`loadSnippets("HTML")`)
              snippetsWindow.show();
            },
          },
          {
            label: 'PYTHON',
            click: () => {
              snippetsWindow.webContents.executeJavaScript(`loadSnippets("PYTHON")`)
              snippetsWindow.show();
            },
          },
          {
            label: 'JAVA',
            click: () => {
              snippetsWindow.webContents.executeJavaScript(`loadSnippets("JAVA")`)
              snippetsWindow.show();
            },
          },

        ]
      },
      { label: 'View Tutorials',
        click: () => {
          mainWindow.webContents.executeJavaScript(`openWebView()`)
        },
      },
    ]
  }

}
