export interface ElectronAPI {
  query: (word: string) => Promise<unknown>
  openSettings: () => void
  // getHistory: () => Promise<History[]>
}
