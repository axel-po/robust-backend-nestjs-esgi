import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { JwtGuard } from '../common/guards/jwt.guard';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, JwtGuard],
  exports: [UsersService],
})
export class UsersModule {}
