// Enums
export enum UserRole {
  MENTOR = 'MENTOR',
  MENTEE = 'MENTEE',
}

export enum RequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export enum SessionStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// User
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatarUrl?: string
  createdAt: Date
}

// Mentor profile
export interface MentorProfile {
  id: string
  userId: string
  bio: string
  skills: string[]
  hourlyRate?: number
  isAvailable: boolean
}

// Mentorship request
export interface MentorshipRequest {
  id: string
  mentorId: string
  menteeId: string
  message: string
  status: RequestStatus
  createdAt: Date
}

// Session
export interface Session {
  id: string
  mentorId: string
  menteeId: string
  requestId: string
  status: SessionStatus
  createdAt: Date
}

// Message
export interface Message {
  id: string
  sessionId: string
  senderId: string
  content: string
  createdAt: Date
}
