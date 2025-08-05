import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TrainingEntity } from '../entities/training.entity';
import { TrainingNormalized } from '../entities/training.interface';
import { TrainingSerializer } from '../entities/training.serializer';

@Injectable()
export class TrainingsReadService {
    constructor(
        @InjectModel(TrainingEntity.name)
        private readonly trainingModel: Model<TrainingEntity>,
    ) {}

    public async readById(id: string): Promise<TrainingNormalized | null> {
        const entity = await this.trainingModel.findById(id).lean<TrainingEntity>().exec();

        if (!entity) {
            return null;
        }

        return TrainingSerializer.normalize(entity);
    }

    public async readAll(): Promise<TrainingNormalized[]> {
        const entities = await this.trainingModel
            .find({})
            .sort({ date: -1 })
            .lean<TrainingEntity[]>()
            .exec();

        return TrainingSerializer.normalizeMany(entities);
    }

    public async readByUserId(userId: string): Promise<TrainingNormalized[]> {
        const entities = await this.trainingModel
            .find({ userId })
            .sort({ date: -1 })
            .lean<TrainingEntity[]>()
            .exec();

        return TrainingSerializer.normalizeMany(entities);
    }

    public async readByUserIdPaginated(
        userId: string,
        skip: number = 0,
        limit: number = 20,
    ): Promise<{
        trainings: TrainingNormalized[];
        total: number;
        hasMore: boolean;
    }> {
        const [entities, total] = await Promise.all([
            this.trainingModel
                .find({ userId })
                .sort({ date: -1 })
                .skip(skip)
                .limit(limit)
                .lean<TrainingEntity[]>()
                .exec(),
            this.trainingModel.countDocuments({ userId }).exec(),
        ]);

        const trainings = TrainingSerializer.normalizeMany(entities);
        const hasMore = skip + limit < total;

        return {
            trainings,
            total,
            hasMore,
        };
    }

    public async readByDateRange(startDate: Date, endDate: Date): Promise<TrainingNormalized[]> {
        const entities = await this.trainingModel
            .find({
                date: {
                    $gte: startDate,
                    $lte: endDate,
                },
            })
            .sort({ date: -1 })
            .lean<TrainingEntity[]>()
            .exec();

        return TrainingSerializer.normalizeMany(entities);
    }

    public async getTotalDistanceByUserId(userId: string): Promise<number> {
        const result = await this.trainingModel.aggregate([
            { $match: { userId } },
            { $group: { _id: null, totalDistance: { $sum: '$distance' } } },
        ]);

        return result.length > 0 ? result[0].totalDistance : 0;
    }

    public async getTotalDistance(): Promise<number> {
        const result = await this.trainingModel.aggregate([
            { $group: { _id: null, totalDistance: { $sum: '$distance' } } },
        ]);

        return result.length > 0 ? result[0].totalDistance : 0;
    }

    public async countAll(): Promise<number> {
        return this.trainingModel.countDocuments().lean().exec();
    }

    public async countByUserId(userId: string): Promise<number> {
        return this.trainingModel.countDocuments({ userId }).lean().exec();
    }
}
