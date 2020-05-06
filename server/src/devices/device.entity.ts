import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert
} from 'typeorm'
import * as bcrypt from 'bcryptjs'

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
    const salt = bcrypt.genSaltSync(10)
    this.password = bcrypt.hashSync(this.password, salt)
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
