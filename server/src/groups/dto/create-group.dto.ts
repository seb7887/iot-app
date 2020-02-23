import { IsNotEmpty } from 'class-validator'

export class CreateGroupDto {
  @IsNotEmpty()
  readonly name: string

  readonly parentId: string | null
}
