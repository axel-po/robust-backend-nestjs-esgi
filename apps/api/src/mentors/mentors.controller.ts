import {
  Controller,
  Get,
  Post,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { TypedBody, TypedParam } from '@nestia/core';
import type {
  MentorProfile,
  CreateMentorProfileDto,
  UpdateMentorProfileDto,
} from '../dto';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../dto';
import { MentorsService } from './mentors.service';

/**
 * @tag Mentors
 */
@Controller('mentors')
export class MentorsController {
  constructor(private readonly mentorsService: MentorsService) {}

  // Cache la liste des mentors pendant 30 secondes
  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000)
  getAll(): Promise<MentorProfile[]> {
    return this.mentorsService.getAll();
  }

  // Cache un profil mentor pendant 15 secondes
  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(15000)
  getById(@TypedParam('id') id: string): Promise<MentorProfile> {
    return this.mentorsService.getById(id);
  }

  /**
   * Seul un MENTOR peut créer son profil
   * @security bearer
   */
  @Post('profile')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.MENTOR)
  createProfile(
    @CurrentUser() user: JwtPayload,
    @TypedBody() body: CreateMentorProfileDto,
  ): Promise<MentorProfile> {
    return this.mentorsService.createProfile(user.sub, body);
  }

  /**
   * Seul un MENTOR peut modifier son profil
   * @security bearer
   */
  @Patch('profile')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.MENTOR)
  updateProfile(
    @CurrentUser() user: JwtPayload,
    @TypedBody() body: UpdateMentorProfileDto,
  ): Promise<MentorProfile> {
    return this.mentorsService.updateProfile(user.sub, body);
  }
}
