import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MessagesRepository } from './messages.repository';
import { JwtGuard } from '../common/guards/jwt.guard';
import { SessionsModule } from '../sessions/sessions.module';

@Module({
  imports: [SessionsModule],
  controllers: [MessagesController],
  providers: [MessagesService, MessagesRepository, JwtGuard],
})
export class MessagesModule {}
