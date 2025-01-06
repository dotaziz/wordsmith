import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm'

@Entity({ name: 'search_history' })
export class History {
  @PrimaryColumn({ generated: 'increment', generatedType: 'VIRTUAL', type: 'int' })
  id: number
  @Column({ type: 'varchar' })
  word: string

  @CreateDateColumn()
  createdAt: Date
}
