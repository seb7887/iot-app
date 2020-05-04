import { IsNotEmpty } from 'class-validator'

export class ResetTokenDto {
  @IsNotEmpty()
  readonly email: string
}
