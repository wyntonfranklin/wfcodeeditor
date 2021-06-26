module.exports =  {
  createMenu : (snippetsWindow) => {
    return [
      { role: 'copy'},
      { role: 'paste'},
      {
        label: 'Snippets',
        submenu: [
          {
            label: 'PHP',
            click: () => {
              //var php = require("./snippets/php");
              // console.log(php);
              // var info = JSON.parse(JSON.stringify(php));
              // console.log(info)
              // console.log(info["create_function"].code);
              //wc.send('get-code', {'code': info["create_function"].code});
              snippetsWindow.webContents.executeJavaScript(`loadSnippets("PHP")`)
              snippetsWindow.show();
            },
          },
          {
            label: 'SQL',
            click: () => {
              snippetsWindow.webContents.executeJavaScript(`loadSnippets("SQL")`)
              snippetsWindow.show();
            },
          },
          {
            label: 'Javascript',
            click: () => {
              snippetsWindow.webContents.executeJavaScript(`loadSnippets("JAVASCRIPT")`)
              snippetsWindow.show();
            },
          },
          {
            label: 'HTML',
            click: () => {
              snippetsWindow.webContents.executeJavaScript(`loadSnippets("HTML")`)
              snippetsWindow.show();
            },
          }

        ]
      }
    ]
  }

}
