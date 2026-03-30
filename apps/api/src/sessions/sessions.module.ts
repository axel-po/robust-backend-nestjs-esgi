import { Module } from '@nestjs/common';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { SessionsRepository } from './sessions.repository';
import { JwtGuard } from '../common/guards/jwt.guard';

@Module({
  controllers: [SessionsController],
  providers: [SessionsService, SessionsRepository, JwtGuard],
  exports: [SessionsRepository],
})
export class SessionsModule {}
