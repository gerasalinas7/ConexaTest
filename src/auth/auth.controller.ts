import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() userDto: any) {
    return this.authService.register(userDto);
  }

  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.body);
  }
}
