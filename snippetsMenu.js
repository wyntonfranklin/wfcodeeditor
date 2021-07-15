const {dialog} = require('electron')

module.exports =  {
  createMenu : (mainDialog) => {
    return [
      {
        label: 'Copy to clipboard',
        click: () => {
          mainDialog.webContents.executeJavaScript(`copySnippetToClipboard()`)
        },
      },
      {
        label: 'Edit this Snippet',
        click: () => {
          mainDialog.webContents.executeJavaScript(`editSnippet()`)
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
