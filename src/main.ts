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
import { initializeIpcHandlers } from "./ipcHandlers";
import * as wordnet from "wordnet";

(async () => {
  // await wordnet.init('/home/aziz0x/Downloads/owen/oewn2024');

  // await wordnet.list();

  // console.log(results, "okay")

})();
// Right now this specifies a folder where database files will be stored.
// export const defaultDbFolder = app.getPath('downloads');
export class AppState {
  private static instance: AppState | null = null;

  private tray: Tray | null = null;

  static mainWindow: BrowserWindow;

  private icon = nativeImage.createFromPath(
    app.getAppPath() + "/assets/icon.png"
  );
  constructor() {
    // Handle creating/removing shortcuts on Windows when installing/uninstalling.
    if (require("electron-squirrel-startup")) {
      app.quit();
    }

    global.database = new Database();
  }

  public static async initApp() {
    const appState = AppState.getInstance();
    initializeIpcHandlers();

    app
      .whenReady()
      .then(() => {
        console.log("App is ready");
        appState.createWindow();

        globalShortcut.register("Control+Shift+W", async () => {
          const selection = execSync("xclip -o").toString();

          const resp = await database.query(selection);

          let notify: Notification;

          if (!resp) {
            notify = new Notification({
              title: "Not found",
              body: `${selection} does not match word in dictionary`,
            });
          } else {
            notify = new Notification({
              icon: nativeImage.createFromPath(
                app.getAppPath() + "/assets/favicon.png"
              ),
              title: resp.word,
              body: resp.meanings[0].definitions[0].definition,
            });
            console.log(resp);
          }

          notify.show();

          notify.addListener("click", (e) => {
            console.log(e);
          });
        });

        // Initialize auto-updater in production
        if (app.isPackaged) {
          // initAutoUpdater()
        } else {
          console.log("Running in development mode - auto-updater disabled");
        }
      })
      .catch((e) => {
        console.error("Error on app initializing: ", e);
      });

    // Quit when all windows are closed, except on macOS. There, it's common
    // for applications and their menu bar to stay active until the user quits
    // explicitly with Cmd + Q.
    app.on("window-all-closed", () => {
      app.dock?.hide();
    });

    app.on("activate", () => {
      // On OS X it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) {
        appState.createWindow();
      }
    });
  }

  public static createSettingsWindow() {
    new BrowserWindow({
      parent: AppState.mainWindow,
      width:1000,
      height:500,
      modal: true,
      frame: false,
    });    
  }

  public static getInstance(): AppState {
    if (!AppState.instance) {
      AppState.instance = new AppState();
    }
    return AppState.instance;
  }

  private createTray() {
    this.tray = new Tray(this.icon);

    const context = Menu.buildFromTemplate([
      {
        label: "Show App",
        role: 'window',
        click:()=>{
          app.focus()
        }
      },
      {
        label: "Create new Window",
        role: 'window',
        click: ()=>{
          this.createWindow();
        }
      },
      {
        label: "Quit",
        role: 'quit',
        click: () => {
          app.quit();
        },
      },
    ]);

    this.tray.setContextMenu(context);
  }

  public createWindow(): void {
    if (this.tray === null) {
      this.createTray();
    }

    // Create the browser window.
    AppState.mainWindow = new BrowserWindow({
      width: 500,
      height: 800,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        nodeIntegration: true,
      },
      resizable: false,
      icon: this.icon,
    });
    // mainWindow.addListener('')

    AppState.mainWindow.setMenuBarVisibility(false);

    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
      AppState.mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
      AppState.mainWindow.loadFile(
        path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
      );
    }

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
    // AppState.mainWindow.webContents.openDevTools();

    app.commandLine.appendSwitch("enable-speech-dispatcher");
  }
}

AppState.initApp().catch(console.error);
