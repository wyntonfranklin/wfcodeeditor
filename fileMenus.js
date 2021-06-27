module.exports =  {
  createMenu : (mainDialog) => {
    return [
      {
        label: 'New File',
        click: () => {
          mainDialog.webContents.executeJavaScript(`createANewFile()`)
        },
        accelerator: 'CTRL+N'
      },
      { label: 'New Folder',
        click: () => {
          mainDialog.webContents.executeJavaScript(`createANewFolder()`)
        },},
      { label: 'Rename',
        click: () => {
          mainDialog.webContents.executeJavaScript(`renameCurrentFile()`)
        },},
    ]
  }

}
