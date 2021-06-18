// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, MenuItem, ipcMain, dialog} = require('electron')
const path = require('path')
let mainWindow, createFileWindow;
var Datastore = require('nedb');
let dbPath = app.getPath('userData');
console.log(dbPath)
let db = {};
let wc;
let mainMenu;

db = {};
db.projects = new Datastore(dbPath +'/projects.db');
db.files = new Datastore(dbPath +'/files.db');
db.settings = new Datastore(dbPath +'/settings.db');

// You need to load each database (here we do it asynchronously)
db.projects.loadDatabase();
db.files.loadDatabase();
db.settings.loadDatabase();

ipcMain.handle('create-new-file', e => {
  createFileWindow = new BrowserWindow({
    width: 300, height: 100,
    webPreferences: { nodeIntegration: true },
    parent: mainWindow,
    modal: true,
    titleBarStyle: 'hidden',
    show: true,
  })
  createFileWindow.setMenuBarVisibility(false);
  createFileWindow.loadFile('create-file-layout.html')
  return "something;";

})

ipcMain.handle('read-user-data', (event) => {
  const path = app.getPath('userData');
  return path;
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



  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  wc = mainWindow.webContents
  mainMenu = Menu.buildFromTemplate( require('./mainMenu').createMenu(wc, dialog, db) )
  Menu.setApplicationMenu(mainMenu)


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
