import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.get<string>('role', context.getHandler());
    if (!requiredRole) {
      return true; 
    }
    
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new ForbiddenException('No token found');
    }

    let user;
    try {
      user = this.jwtService.verify(token); 
    } catch (error) {
      throw new ForbiddenException('Invalid token');
    }
    
    if (user.role !== requiredRole) {
      throw new ForbiddenException('You do not have the required permissions');
    }

    return true;
  }
}