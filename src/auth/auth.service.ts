import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { UnauthorizedException } from '@nestjs/common';
import { LoginDTO } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: LoginDTO) {
    const validatedUser = await this.validateUser(user.email, user.password);
  
    if (!validatedUser) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const payload = { 
      email: validatedUser._doc.email, 
      sub: validatedUser._doc._id, 
      role: validatedUser._doc.role 
    };
  
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

}