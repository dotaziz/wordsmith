import { ipcMain } from 'electron'
import { fetchAll } from 'sqlite-electron'
// import { Word } from '../preload/interface'

export function initializeIpcHandlers(): void {
  ipcMain.handle('dictionary:query', async (_, word: string) => {
    let resp = (await fetchAll(
      `
      SELECT * FROM words 
      WHERE word = ?
      `,
      [word]
    )) as object[]

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resp = resp.map((i: any) => {
      return {
        ...i,
        forms: JSON.parse(i.forms),
        senses: JSON.parse(i.senses),
        sound: JSON.parse(i.sound),
        etymology: JSON.parse(i.etymology),
        templates: JSON.parse(i.templates),
        categories: JSON.parse(i.categories)
      }
    })
    return resp
  })
  ipcMain.handle('dictionary:history', async () => {
    // return database.getHistory()
  })
}
