import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'
import { IsEmail } from 'class-validator'
import * as bcrypt from 'bcryptjs'

export enum RoleType {
  USER = 'user',
  ADMIN = 'admin'
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: string

  @Column({ unique: true, nullable: false })
  @IsEmail()
  email: string

  @Column({ nullable: false })
  username: string

  @Column({ nullable: false })
  password: string
  @BeforeInsert()
  hashPassword() {
    const salt = bcrypt.genSaltSync(10)
    this.password = bcrypt.hashSync(this.password, salt)
  }

  @Column({ nullable: true, name: 'group_id' })
  groupId: string

  @Column({ nullable: true })
  avatar: string

  @Column({ type: 'enum', enum: RoleType, default: RoleType.USER })
  role: RoleType

  @Column({ nullable: true, name: 'reset_token' })
  resetToken: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
