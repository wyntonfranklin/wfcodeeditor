const {dialog} = require('electron')

module.exports =  {
  createMenu : (mainDialog) => {
    return [
      {
        label: 'Close tab',
        click: () => {
          mainDialog.webContents.executeJavaScript(`closeSelectedTab()`)
        },
      },
      {
        label: 'Close All Tabs except this',
        click: () => {
          mainDialog.webContents.executeJavaScript(`renameCurrentFile()`)
        },
      },
      { type: 'separator' },
      {
        label: 'Close All tabs',
        click: () => {
          mainDialog.webContents.executeJavaScript(`closeAllTabs()`)
        },
      },
    ]
  }

}
