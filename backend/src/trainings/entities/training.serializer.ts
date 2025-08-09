import { TrainingEntity } from './training.entity';
import { TrainingNormalized, TrainingSerialized } from './training.interface';

export class TrainingSerializer {
    public static normalize(entity: TrainingEntity): TrainingNormalized {
        return {
            id: entity._id.toString(),
            userId: entity.userId,
            description: entity.description,
            date: entity.date,
            distance: entity.distance,
            activityType: entity.activityType,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }

    public static normalizeMany(entities: TrainingEntity[]): TrainingNormalized[] {
        return entities.map((entity) => this.normalize(entity));
    }

    public static serialize(normalized: TrainingNormalized): TrainingSerialized {
        return {
            id: normalized.id,
            userId: normalized.userId,
            description: normalized.description,
            date: normalized.date,
            distance: normalized.distance,
            activityType: normalized.activityType,
            createdAt: normalized.createdAt,
            updatedAt: normalized.updatedAt,
        };
    }

    public static serializeMany(normalized: TrainingNormalized[]): TrainingSerialized[] {
        return normalized.map((entity) => this.serialize(entity));
    }
}
