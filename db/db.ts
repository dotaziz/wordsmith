import { DataSource, ILike } from "typeorm";
import path from 'path'
import { Words } from "./words.entity";

export class Database {
    private connection: DataSource;

    constructor(){
        this.init();
    }

    private init(){
        const dataSource = new DataSource({
            type: 'sqlite',
            database: path.join('db','dict_en_v2.db'),
            entities: [Words],
            synchronize: false
        })

        dataSource.initialize().then(()=>{
            console.log("Data source initialized")
        }).catch(err =>{
            console.error("Error during Data Source initialization", err)
        })

        this.connection = dataSource;
    }

    public async query(word: string): Promise<Words> {
        const repo = this.connection.getRepository(Words);

        return repo.findOne({
            where:{
                word: ILike(word.toLowerCase())
            }
        })
    }
}