import { Injectable, HttpStatus } from '@nestjs/common'
import { HttpException } from '@nestjs/common/exceptions/http.exception'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, getRepository } from 'typeorm'
import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'
import { validate } from 'class-validator'

import { SECRET } from '../config'
import { UserEntity } from './user.entity'
import { CreateUserDto, LoginUserDto } from './dto'
import { UserRO } from './user.interface'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find()
  }

  async findOne(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const options = {
      email: loginUserDto.email,
      password: bcrypt.hashSync(loginUserDto.password, 10)
    }

    return this.userRepository.findOne(options)
  }

  async create(dto: CreateUserDto): Promise<UserRO> {
    const { username, email, password, role } = dto
    const qb = getRepository(UserEntity)
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
    const newUser = new UserEntity()
    newUser.username = username
    newUser.email = email
    newUser.password = password
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

  async findById(id: number): Promise<UserRO> {
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

    return jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        exp: exp.getTime() / 1000
      },
      SECRET
    )
  }

  private buildUserRO(user: UserEntity) {
    const userRO = {
      username: user.username,
      email: user.email,
      token: this.generateJWT(user),
      role: user.role,
      avatar: user.avatar
    }

    return {
      user: userRO
    }
  }
}
