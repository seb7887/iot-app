import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'
import { IsEmail } from 'class-validator'
import * as bcrypt from 'bcrypt'

export enum RoleType {
  USER = 'user',
  ADMIN = 'admin'
}

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true, nullable: false })
  @IsEmail()
  email: string

  @Column({ nullable: false })
  username: string

  @Column({ nullable: false })
  password: string
  @BeforeInsert()
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 10)
  }

  @Column({ nullable: true })
  avatar: string

  @Column({ type: 'enum', enum: RoleType, default: RoleType.USER })
  role: RoleType

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
