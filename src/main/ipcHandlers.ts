import { ipcMain } from 'electron'
import { fetchOne } from 'sqlite-electron'
import { Word } from '../interface'

export function initializeIpcHandlers(): void {
  ipcMain.handle('dictionary:query', async (_, word: string) => {
    return queryWord(word)
  })

  ipcMain.handle('dictionary:history', async () => {
    // return database.getHistory()
  })
}

export const queryWord = async (word: string): Promise<Word> => {
  let resp = (await fetchOne(
    `
    SELECT * FROM words 
    WHERE word = ?
    `,
    [word]
  )) as Word

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resp = {
    ...resp,
    phonetics: JSON.parse(resp.phonetics as unknown as string),
    meanings: JSON.parse(resp.meanings as unknown as string)
  }
  return resp
}
