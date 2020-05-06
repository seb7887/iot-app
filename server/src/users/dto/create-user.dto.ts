import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

import { RoleType } from '../user.entity'

export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty()
  readonly username: string

  @IsNotEmpty()
  @ApiProperty()
  readonly email: string

  @IsNotEmpty()
  @ApiProperty()
  readonly password: string

  @ApiProperty()
  readonly groupId: string | null

  @IsNotEmpty()
  @ApiProperty()
  readonly role: RoleType
}
