export enum RequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export interface MentorshipRequest {
  id: string
  mentorId: string
  menteeId: string
  message: string
  status: RequestStatus
  createdAt: Date
}
