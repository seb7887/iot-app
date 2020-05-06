import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateDeviceDto {
  @IsNotEmpty()
  @ApiProperty()
  readonly serial: string

  @IsNotEmpty()
  @ApiProperty()
  readonly groupId: string | null
}
