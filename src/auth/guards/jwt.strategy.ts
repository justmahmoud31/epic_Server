import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt'; // <-- Correct import from passport-jwt
import { JwtPayload } from './jwt-payload.interface';
import { AuthService } from '../auth.service';
import { ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'secret-key',
    });
  }

  async validate(payload: JwtPayload) {
    // Optionally, you can fetch the user from DB based on the JWT payload.
    return { userId: payload.sub, email: payload.email };
  }
}
