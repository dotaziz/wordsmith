import { app, ipcMain } from 'electron'

export function initializeIpcHandlers(): void {
  ipcMain.handle('dictionary:query', async (event, args) => {
    const resp = await database.query(args)
    //    return wordnet.lookup(resp.display).then(results =>{
    //     return  results as any;
    //    }).catch(e =>{
    //     console.log(e)
    //    })
    return resp
  })

  ipcMain.handle('window:close', () => {
    app.dock.hide()
  })

  // ipcMain.emit()

  ipcMain.handle('window:minimize', () => {
    app?.hide()
  })
}
