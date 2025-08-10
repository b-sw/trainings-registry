import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActivityType, TrainingEntity } from '../../src/trainings/entities/training.entity';
import { TrainingNormalized } from '../../src/trainings/entities/training.interface';
import { TrainingSerializer } from '../../src/trainings/entities/training.serializer';

export class TrainingUtils {
    private trainingModel: Model<TrainingEntity>;

    constructor(private readonly app: INestApplication) {
        this.trainingModel = this.app.get(getModelToken(TrainingEntity.name));
    }

    public async getTraining(): Promise<TrainingNormalized | null> {
        const training = await this.trainingModel.findOne();
        return training ? TrainingSerializer.normalize(training) : null;
    }

    public async createTraining(params?: {
        userId?: string;
        title?: string;
        description?: string;
        date?: Date;
        distance?: number;
        activityType?: ActivityType;
    }): Promise<TrainingNormalized> {
        const training = await this.trainingModel.create({
            userId: params?.userId || 'default-user-id',
            title: params?.title || 'Test Training',
            description: params?.description || 'Test training description',
            date: params?.date || new Date(),
            distance: params?.distance || 5.0,
            activityType: params?.activityType || ActivityType.Running,
        });

        return TrainingSerializer.normalize(training);
    }

    public async createMultipleTrainings(
        count: number,
        userId: string,
        baseParams?: {
            title?: string;
            description?: string;
            distance?: number;
            activityType?: ActivityType;
        },
    ): Promise<TrainingNormalized[]> {
        const trainings = [] as TrainingNormalized[];
        for (let i = 0; i < count; i++) {
            const training = await this.createTraining({
                userId,
                title: `${baseParams?.title || 'Training'} ${i + 1}`,
                description: `${baseParams?.description || 'Description'} ${i + 1}`,
                distance: baseParams?.distance || Math.random() * 10 + 1,
                date: new Date(Date.now() + i * 24 * 60 * 60 * 1000), // Each day apart
                activityType: baseParams?.activityType || ActivityType.Running,
            });
            trainings.push(training);
        }
        return trainings;
    }
}
