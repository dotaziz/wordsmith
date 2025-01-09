import { ipcMain } from 'electron'

export function initializeIpcHandlers(): void {
  ipcMain.handle('dictionary:query', async (_, word: string) => {
    return word
  })
  ipcMain.handle('dictionary:history', async () => {
    // return database.getHistory()
  })
}
