module.exports =  {
  createMenu : (snippetsWindow, mainWindow) => {
    return [
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
      {
        label: 'Snippets',
        submenu: [
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
          }

        ]
      }
    ]
  }

}
