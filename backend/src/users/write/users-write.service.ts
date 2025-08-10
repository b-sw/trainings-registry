import { Logger, Metrics } from '@logdash/js-sdk';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateQuery } from 'mongoose';
import { UserEntity } from '../entities/user.entity';
import { UserNormalized } from '../entities/user.interface';
import { UserSerializer } from '../entities/user.serializer';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersWriteService {
    constructor(
        @InjectModel(UserEntity.name)
        private readonly userModel: Model<UserEntity>,
        private readonly logger: Logger,
        private readonly metrics: Metrics,
    ) {}

    async create(dto: CreateUserDto): Promise<UserNormalized> {
        // Check if user with email already exists
        const existingUser = await this.userModel.findOne({ email: dto.email });
        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        const entity = await this.userModel.create({
            email: dto.email,
            name: dto.name,
            role: dto.role,
            imageUrl: dto.imageUrl,
        });

        const normalized = UserSerializer.normalize(entity);

        this.logger.info('User created', { id: normalized.id, email: normalized.email });
        this.metrics.mutate('usersCount', 1);

        return normalized;
    }

    public async update(userId: string, dto: UpdateUserDto): Promise<UserNormalized> {
        const updateQuery: UpdateQuery<UserEntity> = {};

        if (dto.email) {
            // Check if email is already taken by another user
            const existingUser = await this.userModel.findOne({
                email: dto.email,
                _id: { $ne: userId },
            });
            if (existingUser) {
                throw new ConflictException('User with this email already exists');
            }
            updateQuery.email = dto.email;
        }

        if (dto.name) {
            updateQuery.name = dto.name;
        }

        if (dto.role) {
            updateQuery.role = dto.role;
        }

        if (dto.imageUrl) {
            updateQuery.imageUrl = dto.imageUrl as any;
        }

        const entity = await this.userModel.findByIdAndUpdate(userId, updateQuery, { new: true });

        if (!entity) {
            throw new NotFoundException('User not found');
        }

        return UserSerializer.normalize(entity);
    }

    public async deleteById(userId: string): Promise<UserNormalized> {
        const entity = await this.userModel.findByIdAndDelete(userId);

        if (!entity) {
            throw new NotFoundException('User not found');
        }

        return UserSerializer.normalize(entity);
    }
}
