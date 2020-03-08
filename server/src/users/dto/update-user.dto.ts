import { IsNotEmpty } from 'class-validator'

export class UpdateUserDto {
  @IsNotEmpty()
  readonly email: string

  @IsNotEmpty()
  readonly username: string

  @IsNotEmpty()
  readonly avatar: string
}
