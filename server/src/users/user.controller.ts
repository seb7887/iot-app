import { Get, Post, Body, Controller, HttpException } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'

import { CreateUserDto, LoginUserDto } from './dto'
import { UserService } from './user.service'
import { UserRO } from './user.interface'
import { User } from './user.decorator'

@ApiBearerAuth()
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('user')
  async findMe(@User('email') email: string): Promise<UserRO> {
    return this.userService.findByEmail(email)
  }

  @Post('users')
  async create(@Body() userData: CreateUserDto) {
    return this.userService.create(userData)
  }

  @Post('users/login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<UserRO> {
    const _user = await this.userService.findOne(loginUserDto)

    const errors = { User: 'Not Found' }
    if (!_user) {
      throw new HttpException({ errors }, 401)
    }

    const token = this.userService.generateJWT(_user)
    const { id, email, username, role, avatar, groupId } = _user
    const user = { id, email, token, username, role, avatar, groupId }

    return {
      user
    }
  }
}
