import { IsNotEmpty, IsUUID } from 'class-validator'

export class ListTimeseriesDto {
  @IsUUID()
  readonly deviceId?: string

  readonly category?: string

  @IsNotEmpty()
  readonly sortBy: string

  @IsNotEmpty()
  readonly sortOrder: 'ASC' | 'DESC'

  @IsNotEmpty()
  readonly pageSize: number

  @IsNotEmpty()
  readonly page: number
}
