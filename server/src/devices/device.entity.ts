import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert
} from 'typeorm'
import * as bcrypt from 'bcrypt'

@Entity({ name: 'devices' })
export class Device {
  @PrimaryGeneratedColumn()
  id: string

  @Column({ nullable: true, name: 'group_id' })
  groupId: string

  @Column({ nullable: false })
  serial: string

  @Column({ nullable: false })
  password: string
  @BeforeInsert()
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 10)
  }

  @Column()
  connected: boolean

  @Column('jsonb')
  properties: Record<string, any>

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
