import { IsNotEmpty, IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ListTimeseriesDto {
  @IsUUID()
  @ApiProperty()
  readonly deviceId?: string

  @ApiProperty()
  readonly category?: string

  @IsNotEmpty()
  @ApiProperty()
  readonly sortBy: string

  @IsNotEmpty()
  @ApiProperty()
  readonly sortOrder: 'ASC' | 'DESC'

  @IsNotEmpty()
  @ApiProperty()
  readonly pageSize: number

  @IsNotEmpty()
  @ApiProperty()
  readonly page: number
}
