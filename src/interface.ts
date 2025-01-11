export interface ElectronAPI {
  query: (word: string) => Promise<Word>
  openSettings: () => void
  getHistory: () => Promise<SearchHistory>
}

export type Word = {
  word: string
  display: string
  phonetics: Array<{
    text?: string
    audio?: string
    license?: {
      url?: string
      name?: string
    }
    sourceUrl?: string
  }>
  meanings: Array<{
    partOfSpeech: string
    definitions: Array<{
      definition: string
      example: string
      synonyms?: string[]
      antonyms?: string[]
    }>
  }>
}

export type SearchHistory = {
  word: string
  time: string
}[]
