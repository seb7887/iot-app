import { IsNotEmpty, IsUUID } from 'class-validator'

export class ListLogsDto {
  @IsUUID()
  readonly deviceId?: string

  readonly connected?: boolean

  @IsNotEmpty()
  readonly sortBy: string

  @IsNotEmpty()
  readonly sortOrder: 'ASC' | 'DESC'

  @IsNotEmpty()
  readonly pageSize: number

  @IsNotEmpty()
  readonly page: number
}
