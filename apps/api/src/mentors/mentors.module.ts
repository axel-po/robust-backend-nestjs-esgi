import { Module } from '@nestjs/common';
import { MentorsController } from './mentors.controller';
import { MentorsService } from './mentors.service';
import { MentorsRepository } from './mentors.repository';
import { JwtGuard } from '../common/guards/jwt.guard';

@Module({
  controllers: [MentorsController],
  providers: [MentorsService, MentorsRepository, JwtGuard],
})
export class MentorsModule {}
