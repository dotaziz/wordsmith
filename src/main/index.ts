// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
import 'reflect-metadata'
import {
  app,
  BrowserWindow,
  Menu,
  nativeImage,
  shell,
  Notification,
  Tray,
  globalShortcut
} from 'electron'
import { join } from 'node:path'
import { execSync } from 'node:child_process'
import { copyFileSync } from 'node:fs'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
// import icon from '../../resources/icon.png?asset'
import { initializeIpcHandlers } from './ipcHandlers'
import { Database } from './db/db'

// import * as wordnet from "wordnet";
;(async () => {
  // await wordnet.init('/home/aziz0x/Downloads/owen/oewn2024');
  // await wordnet.list();
  // console.log(results, "okay")
})()
// Right now this specifies a folder where database files will be stored.
// export const defaultDbFolder = app.getPath('downloads');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit()
}

const appPath = app.getPath('userData')

const db = join(appPath, 'dict_en_v2.db')

copyFileSync(join('dict_en_v2.db'), db)
global.database = new Database(db)

initializeIpcHandlers()

const icon = nativeImage.createFromPath(app.getAppPath() + '../../resources/icon.png')

let tray: Tray | null

const createTray = () => {
  tray = new Tray(icon)

  const context = Menu.buildFromTemplate([
    {
      label: 'Show App',
      role: 'window',
      click: () => {
        app.focus()
      }
    },
    {
      label: 'Create new Window',
      role: 'window',
      click: () => {
        createWindow()
      }
    },
    {
      label: 'Quit',
      role: 'quit',
      click: () => {
        app.quit()
      }
    }
  ])

  tray.setContextMenu(context)
}

const createWindow = () => {
  if (!tray) {
    createTray()
  }

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 500,
    fullscreenable: false,
    frame: false,
    height: 800,
    show: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    },
    resizable: false,
    ...(process.platform === 'linux' ? { icon } : {})
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  const menuTemplate = Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        { label: 'New Window', click: () => console.log('New Window') },
        {
          label: 'Settings',
          click: () => {
            console.log('settings')
          }
        },
        { label: 'Quit' },
        { label: 'Hide' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', role: 'undo' },
        { label: 'Redo', role: 'redo' },
        { type: 'separator' },
        { label: 'Copy', role: 'copy' },
        { label: 'Paste', role: 'paste' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click: () => {
            // TODO: implement about
          }
        }
      ]
    }
  ])

  Menu.setApplicationMenu(menuTemplate)

  // app.dock.setIcon(nativeImage.createFromPath(app.getAppPath() + '/assets/favicon.png'))    // Open the DevTools.
  mainWindow.webContents.openDevTools()

  app.commandLine.appendSwitch('enable-speech-dispatcher')
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.dotaziz.words')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  globalShortcut.register('Control+Shift+W', async () => {
    /**
     * Strange behaviour.
     *
     * putting console.log make the global shortcut to respond faster.
     * without console.log the response delays abit
     */
    let selection = execSync('xclip -o').toString()

    // if (process.platform === 'win32') {
    //   //todo: add xclip alternate on windows
    // } else {
    //   selection = execSync('xclip -o').toString()
    // }
    const resp = await database.query(selection)

    let notify: Notification

    if (!resp) {
      notify = new Notification({
        title: 'Not found',
        body: `${selection} does not match word in dictionary`,
        icon: nativeImage.createFromPath(app.getAppPath() + '/assets/icon.png')
      })
    } else {
      notify = new Notification({
        title: `${resp.word} ${resp.phonetics[0]?.text}`,
        timeoutType: 'never',
        body: resp.meanings[0].definitions[0].definition,
        icon: nativeImage.createFromPath(app.getAppPath() + '/assets/icon.png')
      })
    }

    notify.show()
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

if (app.isPackaged) {
  // initAutoUpdater()
} else {
  console.log('Running in development mode - auto-updater disabled')
}

app.on('window-all-closed', () => {
  app.dock?.hide()
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
