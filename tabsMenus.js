const {dialog} = require('electron')

module.exports =  {
  createMenu : (mainDialog) => {
    return [
      {
        label: 'Open In Side View',
        click: () => {
          mainDialog.webContents.executeJavaScript(`openCurrentTabInSideView()`)
        },
      },
      {
        label: 'Open In New Window',
        click: () => {
          mainDialog.webContents.executeJavaScript(`openCurrentTabInNewWindow()`)
        },
      },
      { type: 'separator' },
      {
        label: 'Close tab',
        click: () => {
          mainDialog.webContents.executeJavaScript(`closeSelectedTab()`)
        },
      },
      {
        label: 'Close All Tabs except this',
        click: () => {
          mainDialog.webContents.executeJavaScript(`closeAllOtherTabs()`)
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
