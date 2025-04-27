import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header
        console.log('Authorization Header:', request.headers['authorization']);
        if (!token) {
            throw new UnauthorizedException('Token missing');
        }

        try {
            const user = this.jwtService.verify(token);
            request.user = user; // Add user object to request
            console.log('User from token:', user); // Log the user object for debugging
            
            return true;
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}
