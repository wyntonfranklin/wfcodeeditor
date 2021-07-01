// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, MenuItem, ipcMain, dialog} = require('electron')
const path = require('path')
let mainWindow, createFileWindow;
var Datastore = require('nedb');
const snippetsManger = require('./snippets');
let db = require("./database");
let dbPath = app.getPath('userData');
console.log(dbPath)
db.init(dbPath)
let wc;
let mainMenu;
let contextMenu, fileContextMenu;
let snippetsWindow;

db.loadDatabases();


ipcMain.handle('read-user-data', (event) => {
  const path = app.getPath('userData');
  return path;
})

ipcMain.handle('show-code-context-menu', (event) => {
  contextMenu.popup();
})

ipcMain.handle('show-file-context-menu', (event) => {
  fileContextMenu.popup();
})

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
    }
  })


  snippetsWindow = new BrowserWindow({
    width: 500, height: 500,
    webPreferences: { nodeIntegration: true,    contextIsolation: false, },
    parent: mainWindow,
    modal: true,
    titleBarStyle: 'hidden',
    show: false,
  })
  snippetsWindow.setMenuBarVisibility(false);
  snippetsWindow.loadFile('create-file-layout.html')
  //snippetsWindow.webContents.openDevTools();

  snippetsWindow.on('close',  (e) => {
    snippetsWindow.hide();
    e.preventDefault();
  })
  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  wc = mainWindow.webContents
  mainMenu = Menu.buildFromTemplate( require('./mainMenu').createMenu(wc, dialog, db, snippetsWindow) )
  Menu.setApplicationMenu(mainMenu)

  ipcMain.handle('set-code-to-view', (event, id, type) => {
    var snippets = snippetsManger.getSnippets(type);
    wc.send('get-code', {'code': snippets[id].code});
    snippetsWindow.hide();
    mainWindow.focus();
  })

  contextMenu = Menu.buildFromTemplate(require('./editorMenu').createMenu(snippetsWindow));
  fileContextMenu = Menu.buildFromTemplate(require('./fileMenus').createMenu(mainWindow));

  mainWindow.webContents.on('context-menu', (e, params) => {
   // console.log(params.);
    //contextMenu.popup()
  })

  mainWindow.on('resize', function(){
     mainWindow.webContents.executeJavaScript('updateAfterResize()');
  });

  mainWindow.on('move', function(){
    mainWindow.webContents.executeJavaScript('updateAfterResize()');
  });

  mainWindow.on('focus', function(){
    mainWindow.webContents.executeJavaScript('onBlurEvents()');
  });

  ipcMain.handle('file-no-exists', (event) => {

  })


}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
