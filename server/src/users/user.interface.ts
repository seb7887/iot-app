import { RoleType } from './user.entity'

export interface UserData {
  id: string
  username: string
  email: string
  token: string
  groupId: string | null
  role: RoleType
  avatar?: string
}

export interface UserRO {
  user: UserData
}
