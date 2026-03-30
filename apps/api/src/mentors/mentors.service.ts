import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import type {
  MentorProfile,
  CreateMentorProfileDto,
  UpdateMentorProfileDto,
} from '../dto';
import { MentorsRepository } from './mentors.repository';
import type { MentorProfile as DbMentorProfile } from '../database/schema';

@Injectable()
export class MentorsService {
  constructor(private readonly mentorsRepository: MentorsRepository) {}

  async getAll(): Promise<MentorProfile[]> {
    const profiles = await this.mentorsRepository.findAll();
    return profiles.map(this.toPublic);
  }

  async getById(id: string): Promise<MentorProfile> {
    const profile = await this.mentorsRepository.findById(id);
    if (!profile) throw new NotFoundException('Mentor profile not found');
    return this.toPublic(profile);
  }

  async createProfile(
    userId: string,
    dto: CreateMentorProfileDto,
  ): Promise<MentorProfile> {
    const existing = await this.mentorsRepository.findByUserId(userId);
    if (existing) throw new ConflictException('Mentor profile already exists');
    const profile = await this.mentorsRepository.create(userId, dto);
    return this.toPublic(profile);
  }

  async updateProfile(
    userId: string,
    dto: UpdateMentorProfileDto,
  ): Promise<MentorProfile> {
    const profile = await this.mentorsRepository.update(userId, dto);
    if (!profile) throw new NotFoundException('Mentor profile not found');
    return this.toPublic(profile);
  }

  private toPublic = (profile: DbMentorProfile): MentorProfile => {
    return {
      id: profile.id,
      userId: profile.userId,
      bio: profile.bio,
      skills: profile.skills,
      hourlyRate: profile.hourlyRate ?? undefined,
      isAvailable: profile.isAvailable,
    };
  };
}
