import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { envConfig } from 'src/shared/env.config';
import { Role } from '../users/entities/user.entity';
import { UserNormalized } from '../users/entities/user.interface';
import { UsersReadService } from '../users/read/users-read.service';
import { UsersWriteService } from '../users/write/users-write.service';

type GoogleUser = {
    email: string;
    family_name: string;
    given_name: string;
    picture: string;
};

export type UserInfo = UserNormalized & {
    accessToken: string;
};

@Injectable()
export class AuthService {
    private static readonly USER_NOT_FOUND_MESSAGE = 'User not found';
    private static readonly USER_INVALID_MESSAGE = 'User is invalid';
    private static readonly GOOGLE_USER_INFO_ENDPOINT =
        'https://www.googleapis.com/oauth2/v1/userinfo';

    constructor(
        private readonly usersReadService: UsersReadService,
        private readonly usersWriteService: UsersWriteService,
        private readonly jwtService: JwtService,
    ) {}

    async googleLogin(googleToken: string): Promise<UserInfo> {
        const { data: googleUser }: { data: GoogleUser } = await axios.get(
            `${AuthService.GOOGLE_USER_INFO_ENDPOINT}?access_token=${googleToken}`,
            {
                baseURL: '',
                headers: { Authorization: `Bearer ${googleToken}`, Accept: 'application/json' },
            },
        );

        this.requireValidEmail(googleUser.email);

        const user =
            (await this.usersReadService.readByEmail(googleUser.email)) ??
            (await this.createUserFromGoogleData(googleUser));

        const jwt = this.getJwt(user.email, user.id);

        return { ...user, accessToken: jwt };
    }

    async devLogin(email: string): Promise<{ accessToken: string }> {
        const user = await this.getUser(email);
        const jwt = this.getJwt(user.email, user.id);
        return { accessToken: jwt };
    }

    private async createUserFromGoogleData(googleUser: GoogleUser): Promise<UserNormalized> {
        return this.usersWriteService.create({
            email: googleUser.email,
            name: `${googleUser.given_name} ${googleUser.family_name}`,
            role: Role.User,
        });
    }

    private requireValidEmail(email: string): void {
        if (!email || !email.includes('@')) {
            throw new BadRequestException(AuthService.USER_INVALID_MESSAGE);
        }

        if (!envConfig.isDevEnv) {
            const domain = email.split('@')[1]?.toLowerCase();
            if (domain !== 'box.com') {
                throw new UnauthorizedException('Only @box.com emails are allowed');
            }
        }
    }

    private async getUser(email: string): Promise<UserNormalized> {
        const user = await this.usersReadService.readByEmail(email);

        if (!user) {
            throw new NotFoundException(AuthService.USER_NOT_FOUND_MESSAGE);
        }

        return user;
    }

    private getJwt(userEmail: string, userId: string): string {
        const payload = { email: userEmail, sub: userId };
        return this.jwtService.sign(payload);
    }
}
