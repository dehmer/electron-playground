import { app, BrowserWindow } from 'electron'
import path from 'path'

const appPath = app => app.getAppPath()
const indexHTML = app => path.join(appPath(app), 'dist', 'index.html')
const windowURL = app => {
  return process.argv.indexOf('--static') !== -1
    ? new URL(indexHTML(app), 'file:')
    : new URL('index.html', 'http://localhost:8080')
}

const createWindow = () => {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Required by dependencies such as levelup and possibly others:
      nodeIntegration: true, // default: false
      contextIsolation: false // default: true, since 12.0.0
    }
  })

  window.loadURL(windowURL(app).toString())
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
