import { UserEntity } from './user.entity';
import { UserNormalized, UserSerialized } from './user.interface';

export class UserSerializer {
    public static normalize(entity: UserEntity): UserNormalized {
        return {
            id: entity._id.toString(),
            email: entity.email,
            name: entity.name,
            role: entity.role,
            imageUrl: entity.imageUrl,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }

    public static normalizeMany(entities: UserEntity[]): UserNormalized[] {
        return entities.map((entity) => this.normalize(entity));
    }

    public static serialize(normalized: UserNormalized): UserSerialized {
        return {
            id: normalized.id,
            email: normalized.email,
            name: normalized.name,
            role: normalized.role,
            imageUrl: normalized.imageUrl,
            createdAt: normalized.createdAt,
            updatedAt: normalized.updatedAt,
        };
    }

    public static serializeMany(normalized: UserNormalized[]): UserSerialized[] {
        return normalized.map((entity) => this.serialize(entity));
    }
}
