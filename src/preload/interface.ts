import { History } from '../main/db/history.entity'
import { Words } from '../main/db/words.entity'
export interface ElectronAPI {
  query: (word: string) => Promise<Words>
  openSettings: () => void
  getHistory: () => Promise<History[]>
}
