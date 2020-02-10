import { RoleType } from './user.entity'

export interface UserData {
  username: string
  email: string
  token: string
  role: RoleType
  avatar?: string
}

export interface UserRO {
  user: UserData
}
