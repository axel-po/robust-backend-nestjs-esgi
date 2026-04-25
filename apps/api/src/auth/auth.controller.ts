import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { TypedBody } from '@nestia/core';
import type { RegisterDto, LoginDto, AuthTokensDto, RefreshDto } from '../dto';
import { AuthService } from './auth.service';

@Throttle({
  short: { limit: 2, ttl: 1000 },
  medium: { limit: 5, ttl: 60000 },
  long: { limit: 20, ttl: 300000 },
})
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@TypedBody() body: RegisterDto): Promise<AuthTokensDto> {
    return this.authService.register(body);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@TypedBody() body: LoginDto): Promise<AuthTokensDto> {
    return this.authService.login(body);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@TypedBody() body: RefreshDto): Promise<AuthTokensDto> {
    return this.authService.refresh(body.refreshToken);
  }
}
