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
          mainDialog.webContents.executeJavaScript(`closeAllOtherTabs()`)
        },
      },
      {
        label: 'Close All tabs',
        click: () => {

          mainDialog.webContents.executeJavaScript(`closeAllTabs()`)
        },
      },
      { type: 'separator' },
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
    ]
  }

}
