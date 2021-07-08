const {dialog} = require('electron')

module.exports =  {
  createMenu : (mainDialog) => {
    return [
      {
        label: 'Copy to clipboard',
        click: () => {
          mainDialog.webContents.executeJavaScript(`copyTaskToClipBoard()`)
        },
      },
      {
        label: 'Edit this task',
        click: () => {
          mainDialog.webContents.executeJavaScript(`closeAllOtherTabs()`)
        },
      },
      { type: 'separator' },
      {
        label: 'Delete task',
        click: () => {

          mainDialog.webContents.executeJavaScript(`closeAllTabs()`)
        },
      },
    ]
  }

}
