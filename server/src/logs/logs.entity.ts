import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn
} from 'typeorm'

@Entity({ name: 'logs' })
export class Logs {
  @PrimaryGeneratedColumn()
  id: string

  @Column({ nullable: false, name: 'device_id' })
  deviceId: string

  @Column({ nullable: false })
  connected: boolean

  @CreateDateColumn()
  createdAt: Date
}
