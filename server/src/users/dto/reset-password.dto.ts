import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ResetPasswordDto {
  @IsNotEmpty()
  @ApiProperty()
  readonly userId: string

  @IsNotEmpty()
  @ApiProperty()
  readonly resetToken: string

  @IsNotEmpty()
  @ApiProperty()
  readonly newPassword: string
}
