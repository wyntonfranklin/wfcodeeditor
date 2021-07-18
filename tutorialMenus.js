const {dialog} = require('electron')

module.exports =  {
    createMenu : (mainDialog) => {
        return [
            {
                label: 'Open in new Window',
                click: () => {
                    mainDialog.webContents.executeJavaScript(`copyTaskToClipBoard()`)
                },
            },
            {
                label: 'Open in Browser',
                click: () => {
                    mainDialog.webContents.executeJavaScript(`editATask()`)
                },
            },
            {
                label: 'Copy Link to Cliboard',
                click: () => {

                    mainDialog.webContents.executeJavaScript(`removeATask()`)
                },
            },
        ]
    }

}
