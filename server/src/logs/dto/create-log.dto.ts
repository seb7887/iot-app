import { IsNotEmpty, IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateLogDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  readonly deviceId: string

  @IsNotEmpty()
  @ApiProperty()
  readonly connected: boolean
}
