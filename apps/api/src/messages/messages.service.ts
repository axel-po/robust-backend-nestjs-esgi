import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import type { Message, CreateMessageDto } from '../dto';
import { MessagesRepository } from './messages.repository';
import { SessionsRepository } from '../sessions/sessions.repository';
import type { Message as DbMessage } from '../database/schema';

@Injectable()
export class MessagesService {
  constructor(
    private readonly messagesRepository: MessagesRepository,
    private readonly sessionsRepository: SessionsRepository,
  ) {}

  async getAll(sessionId: string, userId: string): Promise<Message[]> {
    await this.assertSessionAccess(sessionId, userId);
    const msgs = await this.messagesRepository.findAllBySession(sessionId);
    return msgs.map(this.toPublic);
  }

  async send(
    sessionId: string,
    userId: string,
    dto: CreateMessageDto,
  ): Promise<Message> {
    await this.assertSessionAccess(sessionId, userId);
    const message = await this.messagesRepository.create(
      sessionId,
      userId,
      dto.content,
    );
    return this.toPublic(message);
  }

  private async assertSessionAccess(
    sessionId: string,
    userId: string,
  ): Promise<void> {
    const session = await this.sessionsRepository.findById(sessionId);
    if (!session) throw new NotFoundException('Session not found');
    if (session.mentorId !== userId && session.menteeId !== userId) {
      throw new ForbiddenException('Not authorized');
    }
  }

  private toPublic = (message: DbMessage): Message => ({
    id: message.id,
    sessionId: message.sessionId,
    senderId: message.senderId,
    content: message.content,
    createdAt: message.createdAt,
  });
}
