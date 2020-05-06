import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateGroupDto {
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string

  @ApiProperty()
  readonly parentId: string | null
}
