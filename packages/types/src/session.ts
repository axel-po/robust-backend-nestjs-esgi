export enum SessionStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface Session {
  id: string
  mentorId: string
  menteeId: string
  requestId: string
  status: SessionStatus
  createdAt: Date
}
