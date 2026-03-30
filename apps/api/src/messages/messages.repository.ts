import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { messages } from '../database/schema';

@Injectable()
export class MessagesRepository {
  constructor(private readonly db: DatabaseService) {}

  async findAllBySession(sessionId: string) {
    return this.db.db.query.messages.findMany({
      where: eq(messages.sessionId, sessionId),
    });
  }

  async create(sessionId: string, senderId: string, content: string) {
    const [message] = await this.db.db
      .insert(messages)
      .values({ sessionId, senderId, content })
      .returning();
    return message;
  }
}
