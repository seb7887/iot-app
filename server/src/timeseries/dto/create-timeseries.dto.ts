import { IsNotEmpty, IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateTimeseriesDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  readonly deviceId: string

  @ApiProperty()
  readonly category: string

  @ApiProperty()
  readonly numericValue: number

  @ApiProperty()
  readonly stringValue: string
}
