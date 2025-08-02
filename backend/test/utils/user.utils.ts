import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, UserEntity } from '../../src/users/entities/user.entity';
import { UserNormalized } from '../../src/users/entities/user.interface';
import { UserSerializer } from '../../src/users/entities/user.serializer';

export class UserUtils {
    private userModel: Model<UserEntity>;

    constructor(private readonly app: INestApplication) {
        this.userModel = this.app.get(getModelToken(UserEntity.name));
    }

    public async getUser(): Promise<UserNormalized | null> {
        const user = await this.userModel.findOne();
        return user ? UserSerializer.normalize(user) : null;
    }

    public async createDefaultUser(params?: {
        email?: string;
        name?: string;
        role?: Role;
    }): Promise<UserNormalized> {
        const user = await this.userModel.create({
            email: params?.email || `test-user-${Math.random()}@example.com`,
            name: params?.name || 'Test User',
            role: params?.role || Role.User,
        });

        return UserSerializer.normalize(user);
    }

    public async createAdminUser(params?: {
        email?: string;
        name?: string;
    }): Promise<UserNormalized> {
        return this.createDefaultUser({
            ...params,
            role: Role.Admin,
        });
    }

    public async createEmployeeUser(params?: {
        email?: string;
        name?: string;
    }): Promise<UserNormalized> {
        return this.createDefaultUser({
            ...params,
            role: Role.Employee,
        });
    }
}
