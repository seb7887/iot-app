import { IsNotEmpty, IsUUID } from 'class-validator'

export class ListUsersDto {
  readonly role: string

  readonly username: string | null

  readonly email: string

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
