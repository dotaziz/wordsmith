import { ipcMain } from "electron";
import { AppState } from "./main";
import * as wordnet from "wordnet";


export function initializeIpcHandlers(): void {
  ipcMain.handle("dictionary:query", async (event, args) => {
    const resp = await database.query(args);
//    return wordnet.lookup(resp.display).then(results =>{
//     return  results as any;
//    }).catch(e =>{
//     console.log(e)
//    })
    return resp;
  });

  ipcMain.handle("window:open-settings", async () => {
    AppState.createSettingsWindow();
  });
}
