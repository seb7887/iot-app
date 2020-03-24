import { IsNotEmpty, IsUUID } from 'class-validator'

export class CreateLogDto {
  @IsNotEmpty()
  @IsUUID()
  readonly deviceId: string

  @IsNotEmpty()
  readonly connected: boolean
}
