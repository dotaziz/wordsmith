// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
import "reflect-metadata";
import { Database } from "../db/db";
import {
  app,
  BrowserWindow,
  Menu,
  nativeImage,
  Notification,
  Tray,
  globalShortcut,
} from "electron";
import path from "path";
import { execSync } from "node:child_process";
import { copyFileSync } from "node:fs";
import { initializeIpcHandlers } from "./ipcHandlers";
// import * as wordnet from "wordnet";

(async () => {
  // await wordnet.init('/home/aziz0x/Downloads/owen/oewn2024');
  // await wordnet.list();
  // console.log(results, "okay")
})();
// Right now this specifies a folder where database files will be stored.
// export const defaultDbFolder = app.getPath('downloads');


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const appPath = app.getPath("userData");

const db = path.join(appPath, "dict_en_v2.db");

copyFileSync(path.join("dict_en_v2.db"),db)
global.database = new Database(db);

initializeIpcHandlers();

const icon = nativeImage.createFromPath(
  app.getAppPath() + "/assets/icon.png"
);

let tray: Tray | null;


const createTray = () =>{
  tray = new Tray(icon);

  const context = Menu.buildFromTemplate([
    {
      label: "Show App",
      role: "window",
      click: () => {
        app.focus();
      },
    },
    {
      label: "Create new Window",
      role: "window",
      click: () => {
        createWindow();
      },
    },
    {
      label: "Quit",
      role: "quit",
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(context);
}

const createWindow = ()=> {
  if (!tray) {
    createTray();
  }

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 500,
    fullscreenable: false,
    frame: false,
    useContentSize: true,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
    resizable: false,

    icon: icon,
  });
  // mainWindow.addListener('')

  mainWindow.setMenuBarVisibility(false);

  // if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
  //   mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  // } else {
  //   mainWindow.loadFile(
  //     path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
  //   );
  // }

  const menuTemplate = Menu.buildFromTemplate([
    {
      label: "File",
      submenu: [
        { label: "New Window", click: () => console.log("New Window") },
        {
          label: "Settings",
          click: () => {
            console.log("settings");
          },
        },
        { label: "Quit" },
        { label: "Hide" },
      ],
    },
    {
      label: "Edit",
      submenu: [
        { label: "Undo", role: "undo" },
        { label: "Redo", role: "redo" },
        { type: "separator" },
        { label: "Copy", role: "copy" },
        { label: "Paste", role: "paste" },
      ],
    },
    {
      label: "Help",
      submenu: [
        {
          label: "About",
          click: () => {
            // TODO: implement about
          },
        },
      ],
    },
  ]);

  Menu.setApplicationMenu(menuTemplate);

  // app.dock.setIcon(nativeImage.createFromPath(app.getAppPath() + '/assets/favicon.png'))    // Open the DevTools.
  mainWindow.webContents.openDevTools();

  app.commandLine.appendSwitch("enable-speech-dispatcher");
}


app.whenReady().then(()=>{
  console.log("App is ready");
  createWindow();

  globalShortcut.register("Control+Shift+W", async () => {
    /**
     * Strange behaviour.
     * 
     * putting console.log make the global shortcut to respond faster.
     * without console.log the response delays abit
     */
    let selection: string;

    if (process.platform === "win32") {
      //todo: add xclip alternate on windows
    } else {
      selection = execSync("xclip -o").toString();
    }
    const resp = await database.query(selection);


    let notify: Notification;

    if (!resp) {
      notify = new Notification({
        title: "Not found",
        body: `${selection} does not match word in dictionary`,
        icon: nativeImage.createFromPath(
          app.getAppPath() + "/assets/icon.png"
        )
      });
    } else {
      notify = new Notification({
        title: `${resp.word} ${resp.phonetics[0]?.text}`,
        timeoutType: 'never',
        body: resp.meanings[0].definitions[0].definition,
        icon: nativeImage.createFromPath(
          app.getAppPath() + "/assets/icon.png"
        )
      });
    }

    notify.show()

}

)})


if(app.isPackaged) {
  // initAutoUpdater()
} else {
  console.log("Running in development mode - auto-updater disabled");
}

app.on("window-all-closed", () => {
  app.dock?.hide();
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

