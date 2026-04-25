import { Controller, Get, Post, Patch, UseGuards } from '@nestjs/common';
import { TypedBody, TypedParam } from '@nestia/core';
import type {
  MentorshipRequest,
  CreateRequestDto,
  UpdateRequestStatusDto,
} from '../dto';
import { JwtGuard } from '../common/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
import { RequestsService } from './requests.service';

/**
 * @security bearer
 * @tag Requests
 */
@Controller('requests')
@UseGuards(JwtGuard)
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Get()
  getAll(@CurrentUser() user: JwtPayload): Promise<MentorshipRequest[]> {
    return this.requestsService.getAllForUser(user.sub);
  }

  @Post()
  create(
    @CurrentUser() user: JwtPayload,
    @TypedBody() body: CreateRequestDto,
  ): Promise<MentorshipRequest> {
    return this.requestsService.create(user.sub, body);
  }

  @Patch(':id/status')
  updateStatus(
    @TypedParam('id') id: string,
    @CurrentUser() user: JwtPayload,
    @TypedBody() body: UpdateRequestStatusDto,
  ): Promise<MentorshipRequest> {
    return this.requestsService.updateStatus(id, user.sub, body);
  }
}
