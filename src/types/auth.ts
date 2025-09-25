// Authentication and user types

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'ADMIN' | 'MANAGER' | 'MEMBER' | 'VIEWER'
  department?: string
  position?: string
  createdAt: string
  updatedAt: string
}

export interface AuthUser extends User {
  isAuthenticated: boolean
  permissions: string[]
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  role?: 'ADMIN' | 'MANAGER' | 'MEMBER' | 'VIEWER'
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
}
