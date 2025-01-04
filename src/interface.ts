import { Words } from "./db/words.entity";

// Types for the exposed Electron API
export interface ElectronAPI {
    query: (word: string) => Promise<Words>
    openSettings: () => void
    closeWindow: () => void
    minimizeWindow: ()=> void
}
