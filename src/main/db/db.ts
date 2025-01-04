import { DataSource, ILike } from 'typeorm'
import { Words } from './words.entity'

export class Database {
  private connection: DataSource
  private path: string

  constructor(path: string) {
    this.path = path
    this.init()
  }

  private init() {
    const dataSource = new DataSource({
      type: 'sqlite',
      database: this.path,
      entities: [Words],
      synchronize: false
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

  public async query(word: string): Promise<Words> {
    const repo = this.connection.getRepository(Words)

    return repo.findOne({
      where: {
        word: ILike(word.toLowerCase())
      }
    })
  }
}
