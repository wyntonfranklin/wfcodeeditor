module.exports =  {
  createMenu : (snippetsWindow, mainWindow) => {
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
      { label: 'Open in Side View',
        click: () => {
          mainWindow.webContents.executeJavaScript(`openCurrentFileInSideView()`)
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
