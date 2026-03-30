import { Module } from '@nestjs/common';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';
import { RequestsRepository } from './requests.repository';
import { JwtGuard } from '../common/guards/jwt.guard';
import { SessionsModule } from '../sessions/sessions.module';

@Module({
  imports: [SessionsModule],
  controllers: [RequestsController],
  providers: [RequestsService, RequestsRepository, JwtGuard],
})
export class RequestsModule {}
