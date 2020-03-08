import { IsNotEmpty } from 'class-validator'

export class ValidateJwtDto {
  @IsNotEmpty()
  readonly jwt: string
}
