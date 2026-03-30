import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { SessionStatus } from '../dto';
import type { Session, UpdateSessionStatusDto } from '../dto';
import { SessionsRepository } from './sessions.repository';
import type { Session as DbSession } from '../database/schema';

@Injectable()
export class SessionsService {
  constructor(private readonly sessionsRepository: SessionsRepository) {}

  async getAllForUser(userId: string): Promise<Session[]> {
    const all = await this.sessionsRepository.findAllForUser(userId);
    return all.map(this.toPublic);
  }

  async getById(id: string, userId: string): Promise<Session> {
    const session = await this.sessionsRepository.findById(id);
    if (!session) throw new NotFoundException('Session not found');
    if (session.mentorId !== userId && session.menteeId !== userId) {
      throw new ForbiddenException('Not authorized');
    }
    return this.toPublic(session);
  }

  async updateStatus(
    id: string,
    userId: string,
    dto: UpdateSessionStatusDto,
  ): Promise<Session> {
    const session = await this.sessionsRepository.findById(id);
    if (!session) throw new NotFoundException('Session not found');
    if (session.mentorId !== userId && session.menteeId !== userId) {
      throw new ForbiddenException('Not authorized');
    }
    const updated = await this.sessionsRepository.updateStatus(id, dto.status);
    return this.toPublic(updated);
  }

  private toPublic = (session: DbSession): Session => {
    return {
      id: session.id,
      mentorId: session.mentorId,
      menteeId: session.menteeId,
      requestId: session.requestId,
      status: session.status as SessionStatus,
      createdAt: session.createdAt,
    };
  };
}
