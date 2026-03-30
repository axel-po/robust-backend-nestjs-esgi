import { Injectable } from '@nestjs/common';
import { or, eq } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { sessions, type NewSession } from '../database/schema';

@Injectable()
export class SessionsRepository {
  constructor(private readonly db: DatabaseService) {}

  async findAllForUser(userId: string) {
    return this.db.db.query.sessions.findMany({
      where: or(eq(sessions.mentorId, userId), eq(sessions.menteeId, userId)),
    });
  }

  async findById(id: string) {
    return this.db.db.query.sessions.findFirst({ where: eq(sessions.id, id) });
  }

  async create(data: Pick<NewSession, 'mentorId' | 'menteeId' | 'requestId'>) {
    const [session] = await this.db.db
      .insert(sessions)
      .values(data)
      .returning();
    return session;
  }

  async updateStatus(id: string, status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED') {
    const [session] = await this.db.db
      .update(sessions)
      .set({ status, updatedAt: new Date() })
      .where(eq(sessions.id, id))
      .returning();
    return session;
  }
}
