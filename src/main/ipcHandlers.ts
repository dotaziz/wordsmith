import { ipcMain } from 'electron'

export function initializeIpcHandlers(): void {
  ipcMain.handle('dictionary:query', async (_, args) => {
    const resp = await database.query(args)
    //    return wordnet.lookup(resp.display).then(results =>{
    //     return  results as any;
    //    }).catch(e =>{
    //     console.log(e)
    //    })
    return resp
  })
  ipcMain.handle('dictionary:history', async () => {
    return database.getHistory()
  })
}
