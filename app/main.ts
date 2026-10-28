// Modules to control application life and create native browser window
import express from 'express'
import { Server } from 'http'
import * as path from 'path'
import fs from 'fs'

import {socketServer} from './server/index'
import serial from './server/serial'

import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import electronDl, { download } from 'electron-dl'
import { autoUpdater } from 'electron-updater'
// we need this html for later use when
// adding scripts and styles to a production build

electronDl()

ipcMain.on('download-button', (event, args) => {
  if (args.path) {
    fs.writeFileSync(args.path, JSON.stringify(args.data, null, 2), 'utf-8')
  }
})

ipcMain.on('load-button', (event, args) => {
  const file = fs.readFileSync(args.path, { encoding: 'utf-8'})
  event.sender.send('file-loaded', JSON.parse(file))
})

ipcMain.on('temporary-load-button', (event, args) => {
  const file = fs.readFileSync(args.path, { encoding: 'utf-8'})
  const baseName = path.basename(args.path)
  const protocolNameForButton = baseName.split('.')[0]

  event.sender.send('temporary-file-loaded', {
    temporaryButtons: {
      buttonPosition: args.temporaryProtocolButtonPosition,
      name: protocolNameForButton
    },
    protocol: JSON.parse(file)
  })
})

// electron.remote удалён в Electron 14+ — диалоги открываем из main-процесса
ipcMain.handle('dialog:open', async (event, options) => {
  return dialog.showOpenDialog(options)
})

ipcMain.handle('dialog:save', async (event, options) => {
  return dialog.showSaveDialog(options)
})

const HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>TQ Reactor</title>
  <style type="text/css"></style>
</head>
<body id="body">
  <div id="root"></div>
  <script></script>
</body>
</html>`

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: BrowserWindow

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
    width: 1400,
    height: 1200,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      backgroundThrottling: false
    },
  })

  // let serialport2 = require('serialport')
  // serialport2.list().then(ports => ports.forEach(port => console.log(port)))
  // serialport.list().then(ports => ports.forEach(port => console.log(port)))

  if (process.env.NODE_ENV === 'production') {
    // const serialport = require('serialport')
    // serialport.list().then(ports => ports.forEach(port => console.log(port)))
    const exp = express()
    const http = new Server(exp)
    socketServer(http, serial)
    exp.get(/.*/, (req, res) => res.send(HTML))
    httpInstance = http.listen(port, () => {
      const address = http.address()
      console.log('Listening on: %j', address)
      if(typeof address !== 'string'){
        console.log(' -> that probably means: http://localhost:%d', address.port)
      }
    })
  }
   else {
    const exp = express()
    const http = new Server(exp)
    socketServer(http, serial)
    const webpackMidlleware = require('./server/middlewares/webpack').default
    exp.use(webpackMidlleware)
    exp.get(/.*/, (req, res) => res.sendFile(path.resolve('app/index.html')))
    http.listen(port, () => {
      const address = http.address()
      if(typeof address !== 'string'){
        console.log(' -> that probably means: http://localhost:%d', address.port)
      }
    })
  }

  // and load the index.html of the app.
  if (process.env.NODE_ENV === 'development') {
    require('electron-react-devtools');
    mainWindow.loadURL(`http://localhost:${port}/`)
  } else {
    mainWindow.loadURL(`http://localhost:${port}/`)
    mainWindow.maximize()
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

// Автообновление по сети (electron-updater, фид — GitHub Releases).
// Работает только в packaged-сборке: в dev electron-updater бросает исключение.
function initAutoUpdater() {
  if (!app.isPackaged) return

  autoUpdater.autoDownload = true
  autoUpdater.logger = console

  // статусы для тоста в UI (renderer слушает 'updater-status')
  const sendUpdaterStatus = (payload: object) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('updater-status', payload)
    }
  }

  autoUpdater.on('checking-for-update', () => {
    console.log('[updater] проверка обновлений...')
    sendUpdaterStatus({status: 'checking'})
  })
  autoUpdater.on('update-available', (info) => {
    console.log('[updater] доступна версия', info.version)
    sendUpdaterStatus({status: 'available', version: info.version})
  })
  autoUpdater.on('update-not-available', (info) => {
    console.log('[updater] установлена последняя версия', info.version)
    sendUpdaterStatus({status: 'not-available', version: info.version})
  })
  autoUpdater.on('download-progress', (progress) => {
    console.log(`[updater] загрузка: ${progress.percent.toFixed(1)}%`)
    sendUpdaterStatus({status: 'downloading', percent: Math.round(progress.percent)})
  })
  autoUpdater.on('error', (error) => {
    console.error('[updater] ошибка:', error.message)
    sendUpdaterStatus({status: 'error', message: error.message})
  })
  autoUpdater.on('update-downloaded', () => {
    sendUpdaterStatus({status: 'downloaded'})
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Обновление',
      message: 'Загружена новая версия приложения.',
      detail: 'Перезапустить для установки обновления?',
      buttons: ['Перезапустить', 'Позже'],
    }).then(({ response }) => {
      if (response === 0) {
        autoUpdater.quitAndInstall()
      }
    })
  })

  // небольшая задержка: сначала стартует сервер и окно, потом проверка по сети
  setTimeout(() => {
    autoUpdater.checkForUpdates().catch((error) => console.error('[updater] ', error))
  }, 10000)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow()
  initAutoUpdater()
})

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
