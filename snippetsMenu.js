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
        label: 'Open in Code View',
        click: () => {
          mainDialog.webContents.executeJavaScript(`openInCodeView()`)
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

          mainDialog.webContents.executeJavaScript(`removeASnippet()`)
        },
      },
    ]
  }

}
