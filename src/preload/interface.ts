import { Words } from '../main/db/words.entity'
export interface ElectronAPI {
  query: (word: string) => Promise<Words>
  openSettings: () => void
  closeWindow: () => void
  minimizeWindow: () => void
}
