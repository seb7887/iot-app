/// <reference types="next" />
/// <reference types="next/types/global" />

type AuthType = 'login' | 'register'

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
