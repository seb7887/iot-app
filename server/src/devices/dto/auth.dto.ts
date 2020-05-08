import { IsNotEmpty, IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class AuthDeviceDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  readonly deviceId: string

  @IsNotEmpty()
  @ApiProperty()
  readonly secret: string
}
