import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { users } from '../database/schema';
import type { UpdateUserDto } from '../dto';

@Injectable()
export class UsersRepository {
  constructor(private readonly db: DatabaseService) {}

  async findById(id: string) {
    return this.db.db.query.users.findFirst({ where: eq(users.id, id) });
  }

  async update(id: string, dto: UpdateUserDto) {
    const [user] = await this.db.db
      .update(users)
      .set({ ...dto, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }
}
