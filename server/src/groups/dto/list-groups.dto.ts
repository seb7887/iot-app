import { IsNotEmpty, IsUUID } from 'class-validator'

export class ListGroupsDto {
  @IsNotEmpty()
  @IsUUID()
  readonly id: string

  @IsNotEmpty()
  readonly role: string

  readonly name: string | null

  readonly parentId?: string

  @IsNotEmpty()
  readonly sortBy: string

  @IsNotEmpty()
  readonly sortOrder: 'ASC' | 'DESC'

  @IsNotEmpty()
  readonly pageSize: number

  @IsNotEmpty()
  readonly page: number
}
