import { Injectable, HttpStatus } from '@nestjs/common'
import { HttpException } from '@nestjs/common/exceptions/http.exception'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, getRepository } from 'typeorm'
import { sign, verify, decode } from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'
import { validate } from 'class-validator'

import { SECRET } from '../config'
import { User } from './user.entity'
import {
  CreateUserDto,
  LoginUserDto,
  UpdateUserDto,
  ListUsersDto,
  ResetTokenDto,
  ResetPasswordDto
} from './dto'
import { UserRO, UsersListRO, UserData } from './user.interface'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find()
  }

  async findById(id: string): Promise<UserRO> {
    const user = await this.userRepository.findOne(id)

    if (!user) {
      const errors = { User: 'Not found' }
      throw new HttpException({ errors }, HttpStatus.NOT_FOUND)
    }

    return this.buildUserRO(user)
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

  async listUsers(dto: ListUsersDto): Promise<UsersListRO> {
    const {
      username,
      role,
      groupId,
      email,
      sortBy,
      sortOrder,
      page,
      pageSize
    } = dto

    const [users, count] = await getRepository(User)
      .createQueryBuilder('users')
      .where(groupId ? 'users.group_id = :groupId' : '1 = 1', { groupId })
      .andWhere(role ? 'users.role = :role' : '1 = 1', {
        role
      })
      .andWhere(email ? 'users.email ILIKE :email' : '1:1', {
        email: `%${email}%`
      })
      .andWhere(username ? 'users.username ILIKE :username' : '1:1', {
        username: `%${username}%`
      })
      .orderBy(sortBy, sortOrder)
      .limit(pageSize)
      .offset((Number(page) - 1) * Number(pageSize))
      .getManyAndCount()

    return this.buildUsersListRO(users, count, page, pageSize, sortOrder)
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

  async findByEmail(email: string): Promise<UserRO> {
    const user = await this.userRepository.findOne({ email })
    return this.buildUserRO(user)
  }

  async validateJWT(jwt: string) {
    try {
      verify(jwt, SECRET)

      const decoded = decode(jwt) as any
      const expiry = decoded.exp
      const now = new Date()

      return now.getTime() < expiry * 1000
        ? { isValid: true }
        : { isValid: false }
    } catch (err) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED)
    }
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<UserRO> {
    await this.userRepository.update({ id }, dto)

    const user = await this.userRepository.findOne(id)

    return this.buildUserRO(user)
  }

  async generateResetToken(dto: ResetTokenDto) {
    const { email } = dto

    const { user } = await this.findByEmail(email)

    if (!user) {
      throw new HttpException(
        { message: 'User not found' },
        HttpStatus.NOT_FOUND
      )
    }

    const resetToken = sign({ id: user.id }, SECRET, { expiresIn: '1h' })

    await this.userRepository.update({ id: user.id }, { resetToken })

    return {
      resetToken
    }
  }

  async resetPassword(dto: ResetPasswordDto) {
    const { userId, resetToken, newPassword } = dto

    const { user } = await this.findById(userId)

    if (!user) {
      throw new HttpException(
        { message: 'User not found' },
        HttpStatus.NOT_FOUND
      )
    }

    if (user.resetToken !== resetToken) {
      throw new HttpException(
        { message: 'Password reset token does not match' },
        HttpStatus.BAD_REQUEST
      )
    }

    try {
      verify(resetToken, SECRET)
    } catch (err) {
      throw new HttpException(
        { message: 'Password reset token is invalid' },
        HttpStatus.BAD_REQUEST
      )
    }

    await this.userRepository.update(
      { id: userId },
      { password: newPassword, resetToken: null }
    )

    return {
      success: true
    }
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
      avatar: user.avatar,
      ...(user.resetToken && { resetToken: user.resetToken })
    }

    return {
      user: userRO
    }
  }

  private buildUsersListRO(
    users: User[],
    count: number,
    page: number,
    pageSize: number,
    sortOrder: string
  ) {
    const usersRO: UserData[] = users.map(user => ({
      id: user.id,
      groupId: user.groupId,
      username: user.username,
      email: user.email,
      role: user.role,
      ...(user.resetToken && { resetToken: user.resetToken }),
      ...(user.avatar && { avatar: user.avatar })
    }))

    return {
      users: usersRO,
      meta: {
        count,
        page,
        pageSize,
        sortOrder
      }
    }
  }
}
