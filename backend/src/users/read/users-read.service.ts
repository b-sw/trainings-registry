import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, UserEntity } from '../entities/user.entity';
import { UserNormalized } from '../entities/user.interface';
import { UserSerializer } from '../entities/user.serializer';

@Injectable()
export class UsersReadService {
    constructor(
        @InjectModel(UserEntity.name)
        private readonly userModel: Model<UserEntity>,
    ) {}

    public async readById(id: string): Promise<UserNormalized | null> {
        const entity = await this.userModel.findById(id).lean<UserEntity>().exec();

        if (!entity) {
            return null;
        }

        return UserSerializer.normalize(entity);
    }

    public async readAll(): Promise<UserNormalized[]> {
        const entities = await this.userModel
            .find({})
            .sort({ createdAt: -1 })
            .lean<UserEntity[]>()
            .exec();

        return UserSerializer.normalizeMany(entities);
    }

    public async readByRole(role: Role): Promise<UserNormalized[]> {
        const entities = await this.userModel
            .find({ role })
            .sort({ createdAt: -1 })
            .lean<UserEntity[]>()
            .exec();

        return UserSerializer.normalizeMany(entities);
    }

    public async readByEmail(email: string): Promise<UserNormalized | null> {
        const entity = await this.userModel.findOne({ email }).lean<UserEntity>().exec();

        if (!entity) {
            return null;
        }

        return UserSerializer.normalize(entity);
    }

    public async countAll(): Promise<number> {
        return this.userModel.countDocuments().lean().exec();
    }

    public async existsByEmail(email: string): Promise<boolean> {
        const result = await this.userModel.exists({ email });
        return result !== null;
    }
}
