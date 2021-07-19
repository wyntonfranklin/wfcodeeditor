const {dialog} = require('electron')

module.exports =  {
    createMenu : (mainDialog) => {
        return [
            {
                label: 'Open in new Window',
                click: () => {
                    mainDialog.webContents.executeJavaScript(`openTutorialInWindow()`)
                },
            },
            {
                label: 'Open in Browser',
                click: () => {
                    mainDialog.webContents.executeJavaScript(`openTutorialInBrowser()`)
                },
            },
            {
                label: 'Copy Link to Clipboard',
                click: () => {
                    mainDialog.webContents.executeJavaScript(`copyTutorialLinkToClipboard()`)
                },
            },
        ]
    }

}
