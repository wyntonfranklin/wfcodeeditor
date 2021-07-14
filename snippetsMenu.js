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
        label: 'Edit this Snippet',
        click: () => {
          mainDialog.webContents.executeJavaScript(`editATask()`)
        },
      },
      { type: 'separator' },
      {
        label: 'Delete snippet',
        click: () => {

          mainDialog.webContents.executeJavaScript(`removeATask()`)
        },
      },
    ]
  }

}
