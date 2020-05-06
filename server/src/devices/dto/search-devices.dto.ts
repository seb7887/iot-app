import { IsNotEmpty, IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class SearchDevicesDto {
  @IsNotEmpty()
  @ApiProperty()
  readonly props: Record<string, string | number>

  @IsNotEmpty()
  @ApiProperty()
  readonly role: string

  @IsNotEmpty()
  @IsUUID()
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
