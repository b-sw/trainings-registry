import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserNormalized } from '../../src/users/entities/user.interface';

export class AuthUtils {
    private jwtService: JwtService;

    constructor(private readonly app: INestApplication) {
        this.jwtService = this.app.get(JwtService);
    }

    public generateToken(user: UserNormalized): string {
        const payload = { email: user.email, sub: user.id };
        return this.jwtService.sign(payload);
    }

    public generateInvalidToken(): string {
        return 'invalid-jwt-token';
    }
}
