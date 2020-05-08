import { ApiProperty } from '@nestjs/swagger'

export class UpdateDeviceDto {
  @ApiProperty()
  readonly groupId?: string | undefined

  @ApiProperty()
  readonly connected?: boolean | undefined

  @ApiProperty()
  readonly properties?: Record<string, any> | undefined
}
