export enum UserRole {
  MENTOR = 'MENTOR',
  MENTEE = 'MENTEE',
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: Date;
}

export interface UpdateUserDto {
  name?: string;
  avatarUrl?: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthTokensDto {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshDto {
  refreshToken: string;
}

export interface MentorProfile {
  id: string;
  userId: string;
  bio: string;
  skills: string[];
  hourlyRate?: number;
  isAvailable: boolean;
}

export interface CreateMentorProfileDto {
  bio: string;
  skills: string[];
  hourlyRate?: number;
}

export interface UpdateMentorProfileDto {
  bio?: string;
  skills?: string[];
  hourlyRate?: number;
  isAvailable?: boolean;
}

export enum RequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export interface MentorshipRequest {
  id: string;
  mentorId: string;
  menteeId: string;
  message: string;
  status: RequestStatus;
  createdAt: Date;
}

export interface CreateRequestDto {
  mentorId: string;
  message: string;
}

export interface UpdateRequestStatusDto {
  status: RequestStatus;
}

export enum SessionStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface Session {
  id: string;
  mentorId: string;
  menteeId: string;
  requestId: string;
  status: SessionStatus;
  createdAt: Date;
}

export interface UpdateSessionStatusDto {
  status: SessionStatus;
}

export interface Message {
  id: string;
  sessionId: string;
  senderId: string;
  content: string;
  createdAt: Date;
}

export interface CreateMessageDto {
  content: string;
}
