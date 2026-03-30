import { Injectable } from '@nestjs/common';
import { or, eq } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { mentorshipRequests } from '../database/schema';
import type { CreateRequestDto, RequestStatus } from '../dto';

@Injectable()
export class RequestsRepository {
  constructor(private readonly db: DatabaseService) {}

  async findAllForUser(userId: string) {
    return this.db.db.query.mentorshipRequests.findMany({
      where: or(
        eq(mentorshipRequests.mentorId, userId),
        eq(mentorshipRequests.menteeId, userId),
      ),
    });
  }

  async findById(id: string) {
    return this.db.db.query.mentorshipRequests.findFirst({
      where: eq(mentorshipRequests.id, id),
    });
  }

  async create(menteeId: string, dto: CreateRequestDto) {
    const [request] = await this.db.db
      .insert(mentorshipRequests)
      .values({ menteeId, mentorId: dto.mentorId, message: dto.message })
      .returning();
    return request;
  }

  async updateStatus(id: string, status: RequestStatus) {
    const [request] = await this.db.db
      .update(mentorshipRequests)
      .set({ status, updatedAt: new Date() })
      .where(eq(mentorshipRequests.id, id))
      .returning();
    return request;
  }
}
