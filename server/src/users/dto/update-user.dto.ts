import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateUserDto {
  @IsNotEmpty()
  @ApiProperty()
  readonly email: string

  @IsNotEmpty()
  @ApiProperty()
  readonly username: string

  @IsNotEmpty()
  @ApiProperty()
  readonly avatar: string
}
