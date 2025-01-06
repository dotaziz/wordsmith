import { DataSource, ILike } from 'typeorm'
import { Words } from './words.entity'
import { History } from './history.entity'

export class Database {
  private connection: DataSource
  private path: string

  constructor(path: string) {
    this.path = path
    this.init()
  }

  private init(): void {
    const dataSource = new DataSource({
      type: 'sqlite',
      database: this.path,
      entities: [Words, History],
      synchronize: true
    })

    dataSource
      .initialize()
      .then(() => {
        console.log('Data source initialized')
      })
      .catch((err) => {
        console.error('Error during Data Source initialization', err)
      })

    this.connection = dataSource
  }

  public async query(word: string): Promise<Words | null> {
    const repo = this.connection.getRepository(Words)
    // await this.addHistory(word)
    return repo.findOne({
      where: {
        word: ILike(word.toLowerCase())
      }
    })
  }

  public async getHistory(): Promise<History[]> {
    return this.connection.getRepository(History).find()
  }

  // private async addHistory(word: string): Promise<void> {
  //   await this.connection.getRepository(History).insert({
  //     word: word,
  //     createdAt: new Date()
  //   })
  // }
}
