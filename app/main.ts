// Modules to control application life and create native browser window
import express from 'express'
import socketServer from './server/index'

const { app, BrowserWindow } = require('electron')


// we need this html for later use when
// adding scripts and styles to a production build
const HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Hello World!</title>
  <style type="text/css"></style>
</head>
<body>
  <h1>Hello World!</h1>
  We are using Node.js
  Chromium
  and Electron
  <div id="root"></div>
  <script></script>
</body>
</html>`

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// const installExtensions = async () => {
//   const installer = require('electron-devtools-installer')
//   // const forceDownload = !!process.env.UPGRADE_EXTENSIONS
//   const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS']

//   return Promise.all(
//     extensions.map(name => installer.default(installer[name])),
//   ).catch(console.log)
// }

let httpInstance
async function createWindow() {
  const port : string | number = process.env.PORT || 3000

  // Create the browser window.
  // await installExtensions()

  mainWindow = new BrowserWindow({
    width: 500,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  })

  if (process.env.NODE_ENV === 'production') {
    const exp = express()
    const http = require('http').Server(exp)
    socketServer(http)
    exp.get(/.*/, (req, res) => res.send(HTML))
    httpInstance = http.listen(port, () => {
      const address = http.address()
      console.log('Listening on: %j', address)
      console.log(' -> that probably means: http://localhost:%d', address.port)
    })
  }

  // and load the index.html of the app.
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL(`http://localhost:${port}/`)
  } else {
    mainWindow.loadURL(`http://localhost:${port}/`)
    // mainWindow.loadURL(`file://${__dirname}/index.prod.html`)
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    if (httpInstance) httpInstance.close()
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
