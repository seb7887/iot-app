import { IsNotEmpty, IsUUID } from 'class-validator'

export class ListGroupsDto {
  @IsNotEmpty()
  @IsUUID()
  readonly id: string

  readonly name: string | null

  readonly parentId: string | null

  @IsNotEmpty()
  readonly sortBy: string

  @IsNotEmpty()
  readonly sortOrder: string

  @IsNotEmpty()
  readonly pageSize: number

  @IsNotEmpty()
  readonly page: number | null
}
