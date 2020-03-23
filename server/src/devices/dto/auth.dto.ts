import { IsNotEmpty, IsUUID } from 'class-validator'

export class AuthDeviceDto {
  @IsNotEmpty()
  @IsUUID()
  readonly serial: string

  @IsNotEmpty()
  readonly secret: string
}
