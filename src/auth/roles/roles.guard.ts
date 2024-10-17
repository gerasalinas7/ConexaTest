import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.get<string>('role', context.getHandler());
    if (!requiredRole) {
      return true;  // Si no se requiere un rol específico, cualquier usuario autenticado puede acceder
    }
    
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new ForbiddenException('No token found');
    }

    const user = this.jwtService.decode(token) as any;
    
    if (user.role !== requiredRole) {
      throw new ForbiddenException('You do not have the required permissions');
    }

    return true;
  }
}