import { RoleType } from './user.entity'

export interface UserData {
  id: string
  username: string
  email: string
  token?: string
  groupId: string | null
  role: RoleType
  resetToken?: string
  avatar?: string
}

export interface UserRO {
  user: UserData
}

export interface Meta {
  count: number
  page: number
  pageSize: number
  sortOrder: string
}

export interface UsersListRO {
  users: UserData[]
  meta: Meta
}
