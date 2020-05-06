import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ResetTokenDto {
  @IsNotEmpty()
  @ApiProperty()
  readonly email: string
}
