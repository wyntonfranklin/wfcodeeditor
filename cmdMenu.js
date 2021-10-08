const {dialog} = require('electron')

module.exports =  {
    createMenu : (mainDialog) => {
        return [
            { role: 'copy'},
            { label: 'Clear Buffer',
                click: () => {
                    mainDialog.webContents.executeJavaScript(`clearCmdBuffer()`)
                },
            },
            { label: 'Run a new Command',
                click: () => {
                    mainDialog.webContents.executeJavaScript(`runACommand()`)
                },
            },
            { label: 'Open Command Prompt',
                click: () => {
                    mainDialog.webContents.executeJavaScript(`openCommandPrompt()`)
                },
            },
        ]
    }

}
