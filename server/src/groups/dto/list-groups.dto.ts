import { IsNotEmpty, IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ListGroupsDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  readonly id: string

  @IsNotEmpty()
  @ApiProperty()
  readonly role: string

  @ApiProperty()
  readonly name: string | null

  @ApiProperty()
  readonly parentId?: string

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
