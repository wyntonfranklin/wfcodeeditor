const {dialog,  clipboard} = require('electron')
const fs = require("fs-extra")

function isPasteActive(){
  const text = clipboard.readText();
  if(fs.existsSync(text) ){
    return true;
  }
  return false;
}

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
          { type: 'separator' },
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
          { label: 'New Python File',
            click: () => {
              mainDialog.webContents.executeJavaScript(`createAPythonFile()`)
            },
          },
          { label: 'New CSS File',
            click: () => {
              mainDialog.webContents.executeJavaScript(`createACssFile()`)
            },
          },
          { label: 'New SQL File',
            click: () => {
              mainDialog.webContents.executeJavaScript(`createASqlFile()`)
            },
          },
          { label: 'New Bash File',
            click: () => {
              mainDialog.webContents.executeJavaScript(`createABashFile()`)
            },
          },
        ]
      },
      { label: 'Add File to Project',
        click: () => {
          mainDialog.webContents.executeJavaScript(`openAddFileToProjectDialog()`)
        },
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
      { label: 'Paste',
        enabled : isPasteActive(),
        click: () => {
          mainDialog.webContents.executeJavaScript(`pasteBuffer()`)
        },
      },
      { type: 'separator' },
      { label: 'Open in Explorer',
        click: () => {
          mainDialog.webContents.executeJavaScript(`openInExplorer()`)
        },
      },
      { label: 'Open in Side View',
        click: () => {
          mainDialog.webContents.executeJavaScript(`openSelectedFileInSideView()`)
        },
      },
      { label: 'Open in new Window',
        click: () => {
          mainDialog.webContents.executeJavaScript(`openSelectedFileInNewWindow()`)
        },
      },
      { type: 'separator' },
      { label: 'Delete',
        click: () => {
          mainDialog.webContents.executeJavaScript(`confirmFileDelete()`)
        },
      },
    ]
  }

}
