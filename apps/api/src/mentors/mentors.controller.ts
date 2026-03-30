import { Controller, Get, Post, Patch, UseGuards } from '@nestjs/common';
import { TypedBody, TypedParam } from '@nestia/core';
import type {
  MentorProfile,
  CreateMentorProfileDto,
  UpdateMentorProfileDto,
} from '../dto';
import { JwtGuard } from '../common/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
import { MentorsService } from './mentors.service';

@Controller('mentors')
export class MentorsController {
  constructor(private readonly mentorsService: MentorsService) {}

  @Get()
  getAll(): Promise<MentorProfile[]> {
    return this.mentorsService.getAll();
  }

  @Get(':id')
  getById(@TypedParam('id') id: string): Promise<MentorProfile> {
    return this.mentorsService.getById(id);
  }

  @Post('profile')
  @UseGuards(JwtGuard)
  createProfile(
    @CurrentUser() user: JwtPayload,
    @TypedBody() body: CreateMentorProfileDto,
  ): Promise<MentorProfile> {
    return this.mentorsService.createProfile(user.sub, body);
  }

  @Patch('profile')
  @UseGuards(JwtGuard)
  updateProfile(
    @CurrentUser() user: JwtPayload,
    @TypedBody() body: UpdateMentorProfileDto,
  ): Promise<MentorProfile> {
    return this.mentorsService.updateProfile(user.sub, body);
  }
}
