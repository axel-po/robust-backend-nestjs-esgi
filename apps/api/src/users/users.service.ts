import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRole } from '../dto';
import type { User, UpdateUserDto } from '../dto';
import { UsersRepository } from './users.repository';
import type { User as DbUser } from '../database/schema';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getMe(userId: string): Promise<User> {
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    return this.toPublic(user);
  }

  async updateMe(userId: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.update(userId, dto);
    if (!user) throw new NotFoundException('User not found');
    return this.toPublic(user);
  }

  private toPublic(user: DbUser): User {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as UserRole,
      avatarUrl: user.avatarUrl ?? undefined,
      createdAt: user.createdAt,
    };
  }
}
