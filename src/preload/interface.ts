import { History } from '../main/entities/history.entity'
import { Words } from '../main/entities/words.entity'
export interface ElectronAPI {
  query: (word: string) => Promise<Words>
  openSettings: () => void
  getHistory: () => Promise<History[]>
}
