import { IsNotEmpty } from 'class-validator'

export class CreateDeviceDto {
  @IsNotEmpty()
  readonly serial: string

  @IsNotEmpty()
  readonly groupId: string | null
}
