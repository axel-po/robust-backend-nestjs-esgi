import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { TypedBody, TypedParam } from '@nestia/core';
import type { Message, CreateMessageDto } from '../dto';
import { JwtGuard } from '../common/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
import { MessagesService } from './messages.service';

@Controller('sessions/:sessionId/messages')
@UseGuards(JwtGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  getAll(
    @TypedParam('sessionId') sessionId: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<Message[]> {
    return this.messagesService.getAll(sessionId, user.sub);
  }

  @Post()
  send(
    @TypedParam('sessionId') sessionId: string,
    @CurrentUser() user: JwtPayload,
    @TypedBody() body: CreateMessageDto,
  ): Promise<Message> {
    return this.messagesService.send(sessionId, user.sub, body);
  }
}
