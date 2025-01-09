export interface ElectronAPI {
  query: (word: string) => Promise<Word[]>
  openSettings: () => void
  // getHistory: () => Promise<History[]>
}

export interface Word {
  categories?: string[]
  forms?: {
    form: string
    tags: string[]
  }[]
  head_templates?: {
    args?: {
      [key: string]: string
    }
    expansion?: string
    name?: string
  }[]
  pos: string
  etymology_text?: string
  etymology_templates?: {
    name?: string
    args?: {
      [key: string]: string
    }
    expansion?: string
  }[]
  hyphenation?: string
  senses?: {
    glosses?: string[]
    tags?: string[]
    examples?: {
      text: string
    }[]
  }[]
  sounds?: {
    ipa?: string
    tags?: string[]
  }[]
  word: string
}
