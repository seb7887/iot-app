import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ListUsersDto {
  @ApiProperty()
  readonly role: string

  @ApiProperty()
  readonly username: string | null

  @ApiProperty()
  readonly email: string

  @ApiProperty()
  readonly groupId: string

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
