import {
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  Controller,
  HttpException
} from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'

import {
  CreateUserDto,
  LoginUserDto,
  ValidateJwtDto,
  UpdateUserDto
} from './dto'
import { UserService } from './user.service'
import { UserRO, UsersListRO } from './user.interface'
import { User } from './user.decorator'

@ApiBearerAuth()
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('users')
  async findAll(
    @User('groupId') groupId: string,
    @Query() query
  ): Promise<UsersListRO> {
    const { username, role, email, sortBy, sortOrder, page, pageSize } = query

    return this.userService.listUsers({
      role,
      username,
      email,
      groupId,
      sortBy,
      sortOrder,
      page,
      pageSize
    })
  }

  @Get('users/:id')
  async findById(@Param('id') id: string): Promise<UserRO> {
    return this.userService.findById(id)
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

  @Post('users/validate-jwt')
  async validateJwt(
    @Body() jwtDto: ValidateJwtDto
  ): Promise<Record<string, boolean>> {
    const { jwt } = jwtDto
    return this.userService.validateJWT(jwt)
  }

  @Put('users/:id')
  async updateProfile(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UserRO> {
    return this.userService.updateUser(id, updateUserDto)
  }
}
