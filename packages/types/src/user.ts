export enum UserRole {
  MENTOR = 'MENTOR',
  MENTEE = 'MENTEE',
}

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatarUrl?: string
  createdAt: Date
}
