import { IsNotEmpty } from 'class-validator'

export class ResetPasswordDto {
  @IsNotEmpty()
  readonly userId: string

  @IsNotEmpty()
  readonly resetToken: string

  @IsNotEmpty()
  readonly newPassword: string
}
