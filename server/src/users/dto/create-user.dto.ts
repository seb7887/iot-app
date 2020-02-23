import { IsNotEmpty } from 'class-validator'

import { RoleType } from '../user.entity'

export class CreateUserDto {
  @IsNotEmpty()
  readonly username: string

  @IsNotEmpty()
  readonly email: string

  @IsNotEmpty()
  readonly password: string

  readonly groupId: string | null

  @IsNotEmpty()
  readonly role: RoleType
}
