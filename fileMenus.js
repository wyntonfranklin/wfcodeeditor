const {dialog} = require('electron')

module.exports =  {
  createMenu : (mainDialog) => {
    return [
      {
        label: 'New..',
        submenu: [
          {
            label : 'New File',
            click: () => {
              mainDialog.webContents.executeJavaScript(`createANewFile()`)
            },
            accelerator: 'CTRL+N'
          },
          { label: 'New Folder',
            click: () => {
              mainDialog.webContents.executeJavaScript(`createANewFolder()`)
            },
          },
          { label: 'New PHP File',
            click: () => {
              mainDialog.webContents.executeJavaScript(`createAPhpFile()`)
            },
          },
          { label: 'New HTML File',
            click: () => {
              mainDialog.webContents.executeJavaScript(`createAHtmlFile()`)
            },
          },
          { label: 'New Javascript File',
            click: () => {
              mainDialog.webContents.executeJavaScript(`createAJsFile()`)
            },
          },
        ]
      },
      { type: 'separator' },
      { label: 'Rename',
        click: () => {
          mainDialog.webContents.executeJavaScript(`renameCurrentFile()`)
        },},
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
