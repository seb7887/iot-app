import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn
} from 'typeorm'

@Entity({ name: 'timeseries' })
export class Timeseries {
  @PrimaryGeneratedColumn()
  id: string

  @Column({ nullable: false, name: 'device_id' })
  deviceId: string

  @Column({ nullable: false })
  category: string

  @Column({ nullable: true, name: 'numeric_value' })
  numericValue: number

  @Column({ nullable: true, name: 'string_value' })
  stringValue: string

  @CreateDateColumn({ name: 'time' })
  time: Date
}
