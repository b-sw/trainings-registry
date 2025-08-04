import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { envConfig } from '../../shared/env.config';

export type JwtPayload = { sub: string; email: string };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: envConfig.jwtSecret,
        });
    }

    async validate(payload: JwtPayload): Promise<{ id: string; email: string }> {
        return {
            id: payload.sub,
            email: payload.email,
        };
    }
}
