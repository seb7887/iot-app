import { IsNotEmpty, IsUUID } from 'class-validator'

export class SearchDevicesDto {
  @IsNotEmpty()
  readonly props: Record<string, string | number>

  @IsNotEmpty()
  readonly role: string

  @IsNotEmpty()
  @IsUUID()
  readonly groupId: string

  @IsNotEmpty()
  readonly sortBy: string

  @IsNotEmpty()
  readonly sortOrder: 'ASC' | 'DESC'

  @IsNotEmpty()
  readonly pageSize: number

  @IsNotEmpty()
  readonly page: number
}
