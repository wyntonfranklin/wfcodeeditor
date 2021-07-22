// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, MenuItem, ipcMain, dialog} = require('electron')
const path = require('path')
let mainWindow, createFileWindow;
var Datastore = require('nedb');
const snippetsManger = require('./snippets');
let db = require("./database");
let dbPath = app.getPath('userData');
db.init(dbPath)
let wc;
let mainMenu;
let contextMenu, fileContextMenu, tabsContextMenu, tasksContextMenu,
    snippetsContextMenu, tutorialsContextMenu;
let snippetsWindow, tutorialWindow, settingsWindow;
let message; // pass messages to different windows

db.loadDatabases();


ipcMain.handle('read-user-data', (event) => {
  const path = app.getPath('userData');
  return path;
});

ipcMain.handle('show-context-menu', (event, menu) => {
  if(menu == "code"){
    contextMenu.popup();
  }else if(menu == "file"){
    fileContextMenu.popup();
  }else if(menu == "tabs"){
    tabsContextMenu.popup();
  }else if(menu == "tasks"){
    tasksContextMenu.popup();
  }else if(menu == 'snippets'){
    snippetsContextMenu.popup();
  }else if(menu == 'tutorials'){
    tutorialsContextMenu.popup();
  }
})


function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      backgroundColor: '#3b3b3b'
    }
  })


  snippetsWindow = new BrowserWindow({
    width: 500, height: 500,
    webPreferences: { nodeIntegration: true,    contextIsolation: false, },
    parent: mainWindow,
    modal: true,
    titleBarStyle: 'hidden',
    show: false,
  });
  snippetsWindow.setMenuBarVisibility(false);
  snippetsWindow.loadFile('create-file-layout.html')
  //snippetsWindow.webContents.openDevTools();

  snippetsWindow.on('close',  (e) => {
    snippetsWindow.hide();
    e.preventDefault();
  })


  tutorialWindow = new BrowserWindow({
    width: 600, height: 600,
    webPreferences: { nodeIntegration: true,    contextIsolation: false, },
    parent: mainWindow,
    modal: false,
    titleBarStyle: 'hidden',
    show: false,
  });
  tutorialWindow.setMenuBarVisibility(false);
  tutorialWindow.loadFile('tutorial-layout.html')
  //tutorialWindow.webContents.openDevTools();
  tutorialWindow.on('close',  (e) => {
    tutorialWindow.hide();
    e.preventDefault();
  })

  tutorialWindow.on('resize', function(){
    tutorialWindow.webContents.executeJavaScript('updateOnResize()');
  });

  tutorialWindow.on('move', function(){
    tutorialWindow.webContents.executeJavaScript('updateOnResize()');
  });

  tutorialWindow.on('resized', function(){
    tutorialWindow.webContents.executeJavaScript('updateAfterResize()');
  });

  tutorialWindow.on('maximize', function(){
    tutorialWindow.webContents.executeJavaScript('resizeAll()');
  });

  tutorialWindow.on('minimize', function(){
    tutorialWindow.webContents.executeJavaScript('resizeAll()');
  });

  settingsWindow = new BrowserWindow({
    width: 600, height: 600,
    webPreferences: { nodeIntegration: true, contextIsolation: false, },
    parent: mainWindow,
    modal: true,
    titleBarStyle: 'hidden',
    show: false,
  });
  settingsWindow.setMenuBarVisibility(false);
  settingsWindow.loadFile('settings_layout.html');
  //settingsWindow.webContents.openDevTools();
  settingsWindow.on('close',  (e) => {
    settingsWindow.hide();
    mainWindow.webContents.executeJavaScript('refreshView()');
    mainWindow.focus();
    e.preventDefault();
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')


  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  wc = mainWindow.webContents
  mainMenu = Menu.buildFromTemplate( require('./mainMenu').createMenu(wc, dialog, snippetsWindow, settingsWindow) )
  Menu.setApplicationMenu(mainMenu)

  ipcMain.handle('set-code-to-view', (event, id, type) => {
    var snippets = snippetsManger.getSnippets(type);
    wc.send('get-code', {'code': snippets[id].code});
    snippetsWindow.hide();
    mainWindow.focus();
  });

  ipcMain.handle('show-tutorial', (event, message) => {
    tutorialWindow.send('get-tutorial-data',message);
    tutorialWindow.show();
    tutorialWindow.focus();
  });

  ipcMain.handle('show-confirm-dialog', async (event, options) => {
    const results = await dialog.showMessageBox(options);
    return results;
  })

  contextMenu = Menu.buildFromTemplate(require('./editorMenu').createMenu(snippetsWindow, mainWindow));
  fileContextMenu = Menu.buildFromTemplate(require('./fileMenus').createMenu(mainWindow));
  tabsContextMenu = Menu.buildFromTemplate(require('./tabsMenus').createMenu(mainWindow));
  tasksContextMenu = Menu.buildFromTemplate(require('./tasksMenu').createMenu(mainWindow));
  snippetsContextMenu = Menu.buildFromTemplate(require('./snippetsMenu').createMenu(mainWindow));
  tutorialsContextMenu = Menu.buildFromTemplate(require('./tutorialMenus').createMenu(mainWindow));

  mainWindow.webContents.on('context-menu', (e, params) => {
   // console.log(params.);
    //contextMenu.popup()
  })

  mainWindow.on('maximize', function(){
    mainWindow.webContents.executeJavaScript('resizeAll()');
  });

  mainWindow.on('minimize', function(){
    mainWindow.webContents.executeJavaScript('resizeAll()');
  });


  mainWindow.on('resize', function(){
     mainWindow.webContents.executeJavaScript('updateOnResize()');
  });

  mainWindow.on('resized', function(){
    mainWindow.webContents.executeJavaScript('updateAfterResize()');
  });

  mainWindow.on('move', function(){
    mainWindow.webContents.executeJavaScript('updateOnResize()');
  });

  mainWindow.on('focus', function(){
    mainWindow.webContents.executeJavaScript('onBlurEvents()');
  });

  mainWindow.webContents.on('devtools-opened', ()=>{
    mainWindow.webContents.executeJavaScript('updateOnResize()');
  });

  mainWindow.webContents.on('devtools-closed', ()=>{
    mainWindow.webContents.executeJavaScript('updateOnResize()');
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
