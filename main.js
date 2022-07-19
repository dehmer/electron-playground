const { app, BrowserWindow } = require('electron')
const path = require('path')

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false, // default: false

      // Even when nodeIntegration: false is used, to truly enforce
      // strong isolation and prevent the use of Node primitives
      // contextIsolation must also be used.
      //
      contextIsolation: true, // default: true, since 12.0.0

      // Specifies a script that will be loaded before other scripts
      // run in the page. This script will always have access to
      // node APIs no matter whether node integration is turned on or off.
      //
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadFile('index.html')
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
//
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {

    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    // Note: BrowserWindow has a ton of (static) functions which might
    // be worth having a closer look.
    //
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
//
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
