module.exports =  {
  createMenu : (snippetsWindow, mainWindow) => {
    return [
      {
        label: 'Add Note',
        click: () => {
          mainWindow.webContents.executeJavaScript(`openTaskView()`)
        },
      },
      {
        label: 'Find',
        click: () => {
          mainWindow.webContents.executeJavaScript(`search()`)
        },
      },
      { role: 'copy'},
      { role: 'paste'},
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
