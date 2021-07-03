const {dialog} = require('electron')

module.exports =  {
  createMenu : (mainDialog) => {
    return [
      {
        label: 'Close tab',
        click: () => {
          mainDialog.webContents.executeJavaScript(`renameCurrentFile()`)
        },
      },
      { type: 'separator' },
      { label: 'Rename',
        click: () => {
          mainDialog.webContents.executeJavaScript(`renameCurrentFile()`)
        },
      },
      { label: 'Copy',
        click: () => {
          mainDialog.webContents.executeJavaScript(`copyFileOrFolder()`)
        },
      },
      { role: 'Paste',
      },
      { label: 'Open in Explorer',
        click: () => {
          mainDialog.webContents.executeJavaScript(`openInExplorer()`)
        },
      },
      { type: 'separator' },
      { label: 'Delete',
        click: () => {
          let options  = {
            title: 'Please confirm this delete',
            buttons: ["Yes","Cancel"],
            message: "Do you really want to quit?"
          }
          dialog.showMessageBox(options).then( result => {
            console.log(`User selected: ${result.response}`);
            mainDialog.webContents.executeJavaScript(`deletedSelectItem(${result.response})`)
          })

        },
      },
    ]
  }

}
