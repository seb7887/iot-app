import { IsNotEmpty, IsUUID } from 'class-validator'

export class CreateTimeseriesDto {
  @IsNotEmpty()
  @IsUUID()
  readonly deviceId: string

  readonly category: string

  readonly numericValue: number

  readonly stringValue: string
}
