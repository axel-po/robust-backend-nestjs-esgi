import type { UserRole } from './user'

export interface RegisterDto {
  email: string
  password: string
  name: string
  role: UserRole
}

export interface LoginDto {
  email: string
  password: string
}

export interface AuthTokensDto {
  accessToken: string
  refreshToken: string
}

export interface RefreshDto {
  refreshToken: string
}
