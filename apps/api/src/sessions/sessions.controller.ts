import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { TypedBody, TypedParam } from '@nestia/core';
import type { Session, UpdateSessionStatusDto } from '../dto';
import { JwtGuard } from '../common/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
import { SessionsService } from './sessions.service';

@Controller('sessions')
@UseGuards(JwtGuard)
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get()
  getAll(@CurrentUser() user: JwtPayload): Promise<Session[]> {
    return this.sessionsService.getAllForUser(user.sub);
  }

  @Get(':id')
  getById(
    @TypedParam('id') id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<Session> {
    return this.sessionsService.getById(id, user.sub);
  }

  @Patch(':id/status')
  updateStatus(
    @TypedParam('id') id: string,
    @CurrentUser() user: JwtPayload,
    @TypedBody() body: UpdateSessionStatusDto,
  ): Promise<Session> {
    return this.sessionsService.updateStatus(id, user.sub, body);
  }
}
