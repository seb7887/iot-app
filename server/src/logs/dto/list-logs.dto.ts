import { IsNotEmpty, IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ListLogsDto {
  @IsUUID()
  @ApiProperty()
  readonly deviceId?: string

  @ApiProperty()
  readonly connected?: boolean

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
