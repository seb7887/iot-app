import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity({ name: 'groups ' })
export class Group {
  @PrimaryGeneratedColumn()
  id: string

  @Column({ nullable: true, name: 'parent_id' })
  parentId: string

  @Column({ nullable: false })
  name: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
