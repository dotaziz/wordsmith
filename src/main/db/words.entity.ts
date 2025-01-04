import { Column, Entity } from 'typeorm'

export interface IPhonetic {
  text?: string
  audio?: string
  license?: {
    url?: string
    name?: string
  }
  sourceUrl?: string
}

type definitions = {
  definition: string
  example: string
  synonyms?: string[]
  antonyms?: string[]
}

export type Meaning = {
  definitions: Array<definitions>
  partOfSpeech: string
}

@Entity({ name: 'words' })
export class Words {
  @Column({ type: 'varchar', length: 255, primary: true })
  word: string

  @Column({ type: 'varchar', length: 255 })
  display: string

  @Column({ type: 'json' })
  phonetics: Array<IPhonetic> = []

  @Column({ type: 'json' })
  meanings: Array<Meaning> = []
}
