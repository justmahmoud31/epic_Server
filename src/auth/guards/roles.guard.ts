import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/users/roles.enum';
import { Roles } from 'src/common/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private jwtService: JwtService
    ) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.get<Role[]>('roles', context.getHandler());
    
        if (!requiredRoles) {
            return true;
        }
    
        const request = context.switchToHttp().getRequest();
        const user = request.user;
    
        if (!user) {
            throw new UnauthorizedException('User not authenticated');
        }
        // Check if user has a valid JWT token
        // Check if user has any of the required roles (fix to match user.role)
        const hasRole = requiredRoles.some(role => user.roles.includes(role));
        if (!hasRole) {
            throw new ForbiddenException('You do not have permission to access this resource');
        }
    
        return true;
    }
    
}
