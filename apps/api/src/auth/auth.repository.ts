import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { users, type NewUser } from '../database/schema';

@Injectable()
export class AuthRepository {
  constructor(private readonly db: DatabaseService) {}

  async findByEmail(email: string) {
    return this.db.db.query.users.findFirst({
      where: eq(users.email, email),
    });
  }

  async findById(id: string) {
    return this.db.db.query.users.findFirst({
      where: eq(users.id, id),
    });
  }

  async create(data: NewUser) {
    const [user] = await this.db.db.insert(users).values(data).returning();
    return user;
  }
}
