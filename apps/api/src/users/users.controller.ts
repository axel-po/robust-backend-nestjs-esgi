import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { TypedBody } from '@nestia/core';
import type { User, UpdateUserDto } from '../dto';
import { JwtGuard } from '../common/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@CurrentUser() user: JwtPayload): Promise<User> {
    return this.usersService.getMe(user.sub);
  }

  @Patch('me')
  updateMe(
    @CurrentUser() user: JwtPayload,
    @TypedBody() body: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateMe(user.sub, body);
  }
}
