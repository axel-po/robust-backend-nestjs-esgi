export interface MentorProfile {
  id: string
  userId: string
  bio: string
  skills: string[]
  hourlyRate?: number
  isAvailable: boolean
}
