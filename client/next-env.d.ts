/// <reference types="next" />
/// <reference types="next/types/global" />

type AuthType = 'login' | 'register'

interface Meta {
  count: number
  page: string
  pageSize: string
  sortOrder: string
}

interface User {
  id: string
  username: string
  email: string
  token?: string
  groupId: string | null
  role: RoleType
  resetToken?: string
  avatar?: string
}

interface UserResponse {
  user: User
}

interface UsersResponse {
  users: User[]
  meta: Meta
}

interface Device {
  id: string
  groupId: string | null
  serial: string
  secret?: string
  connected: boolean
  properties: Record<string, any>
}

interface DeviceResponse {
  device: Device
}

interface DevicesResponse {
  devices: Device[]
  meta: Meta
}

interface Group {
  id: string
  name: string
  parentId: string | null
}

interface GroupResponse {
  group: Group
}

interface GroupsResponse {
  groups: Group[]
  meta: Meta
}
