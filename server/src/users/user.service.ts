import { Injectable, HttpStatus } from '@nestjs/common'
import { HttpException } from '@nestjs/common/exceptions/http.exception'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, getRepository } from 'typeorm'
import { sign } from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'
import { validate } from 'class-validator'

import { SECRET } from '../config'
import { User } from './user.entity'
import { CreateUserDto, LoginUserDto } from './dto'
import { UserRO } from './user.interface'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find()
  }

  async findOne(loginUserDto: LoginUserDto): Promise<User> {
    const { email, password } = loginUserDto
    const user = await this.userRepository.findOne({ email })

    if (!user) {
      return null
    }

    const isValid = bcrypt.compareSync(password, user.password)

    return isValid ? user : null
  }

  async create(dto: CreateUserDto): Promise<UserRO> {
    if (!dto) {
      throw new HttpException('Missing properties', HttpStatus.BAD_REQUEST)
    }

    const { username, email, password, groupId, role } = dto
    const qb = getRepository(User)
      .createQueryBuilder('users')
      .where('users.username = :username', { username })
      .orWhere('users.email = :email', { email })

    const user = await qb.getOne()

    if (user) {
      const errors = { username: 'Username and email must be unique' }
      throw new HttpException(
        { message: 'Input data validation failed', errors },
        HttpStatus.BAD_REQUEST
      )
    }

    // Create new user
    const newUser = new User()
    newUser.username = username
    newUser.email = email
    newUser.password = password
    newUser.groupId = groupId
    newUser.role = role

    const errors = await validate(newUser)
    if (errors.length > 0) {
      const _errors = { username: 'UserInput is not valid' }
      throw new HttpException(
        { message: 'Input data validation failed', _errors },
        HttpStatus.BAD_REQUEST
      )
    } else {
      const savedUser = await this.userRepository.save(newUser)
      return this.buildUserRO(savedUser)
    }
  }

  async findById(id: string): Promise<UserRO> {
    const user = await this.userRepository.findOne(id)

    if (!user) {
      const errors = { User: 'Not Found' }
      throw new HttpException({ errors }, 401)
    }

    return this.buildUserRO(user)
  }

  async findByEmail(email: string): Promise<UserRO> {
    const user = await this.userRepository.findOne({ email })
    return this.buildUserRO(user)
  }

  public generateJWT(user) {
    const today = new Date()
    const exp = new Date(today)
    exp.setDate(today.getDate() + 60)

    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        groupId: user.groupId,
        exp: exp.getTime() / 1000
      },
      SECRET
    )
  }

  private buildUserRO(user: User) {
    const userRO = {
      id: user.id,
      username: user.username,
      email: user.email,
      token: this.generateJWT(user),
      groupId: user.groupId,
      role: user.role,
      avatar: user.avatar
    }

    return {
      user: userRO
    }
  }
}
