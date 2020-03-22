import { IsNotEmpty, IsUUID } from 'class-validator'

export class ListDevicesDto {
  @IsNotEmpty()
  readonly role: string

  @IsNotEmpty()
  @IsUUID()
  readonly groupId: string | null

  @IsNotEmpty()
  readonly sortBy: string

  @IsNotEmpty()
  readonly sortOrder: 'ASC' | 'DESC'

  @IsNotEmpty()
  readonly pageSize: number

  @IsNotEmpty()
  readonly page: number
}
