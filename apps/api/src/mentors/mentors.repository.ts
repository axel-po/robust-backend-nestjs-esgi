import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { mentorProfiles } from '../database/schema';
import type { CreateMentorProfileDto, UpdateMentorProfileDto } from '../dto';

@Injectable()
export class MentorsRepository {
  constructor(private readonly db: DatabaseService) {}

  async findAll() {
    return this.db.db.query.mentorProfiles.findMany({
      where: eq(mentorProfiles.isAvailable, true),
    });
  }

  async findById(id: string) {
    return this.db.db.query.mentorProfiles.findFirst({
      where: eq(mentorProfiles.id, id),
    });
  }

  async findByUserId(userId: string) {
    return this.db.db.query.mentorProfiles.findFirst({
      where: eq(mentorProfiles.userId, userId),
    });
  }

  async create(userId: string, dto: CreateMentorProfileDto) {
    const [profile] = await this.db.db
      .insert(mentorProfiles)
      .values({ userId, ...dto })
      .returning();
    return profile;
  }

  async update(userId: string, dto: UpdateMentorProfileDto) {
    const [profile] = await this.db.db
      .update(mentorProfiles)
      .set({ ...dto, updatedAt: new Date() })
      .where(eq(mentorProfiles.userId, userId))
      .returning();
    return profile;
  }
}
