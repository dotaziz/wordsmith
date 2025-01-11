import { ipcMain } from 'electron'
import { fetchOne } from 'sqlite-electron'
import { Word } from '../interface'
import { store } from './index'

export function initializeIpcHandlers(): void {
  ipcMain.handle('dictionary:query', async (_, word: string) => {
    const history = store.get('history')
    store.set('history', [...history, { word, time: new Date().toISOString() }])

    return queryWord(word)
  })

  ipcMain.handle('dictionary:history', async () => {
    return store.get('history')
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
