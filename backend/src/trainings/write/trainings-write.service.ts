import { Logger, Metrics } from '@logdash/js-sdk';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateQuery } from 'mongoose';
import { envConfig } from '../../shared/env.config';
import { TrainingEntity } from '../entities/training.entity';
import { TrainingNormalized } from '../entities/training.interface';
import { TrainingSerializer } from '../entities/training.serializer';
import { CreateTrainingDto } from './dto/create-training.dto';
import { UpdateTrainingDto } from './dto/update-training.dto';

@Injectable()
export class TrainingsWriteService {
    constructor(
        @InjectModel(TrainingEntity.name)
        private readonly trainingModel: Model<TrainingEntity>,
        private readonly logger: Logger,
        private readonly metrics: Metrics,
    ) {}

    async create(dto: CreateTrainingDto): Promise<TrainingNormalized> {
        // Disallow activity creation before 12 Aug 07:00 CET (05:00 UTC) in non-dev environments
        if (!envConfig.isDevEnv) {
            const nowUtc = new Date();
            const creationOpenAtUtc = new Date('2025-08-12T05:00:00.000Z');
            if (nowUtc.getTime() < creationOpenAtUtc.getTime()) {
                throw new BadRequestException('Activity creation is not allowed yet');
            }
        }

        const trainingDate = new Date(dto.date);
        const now = new Date();
        if (trainingDate.getTime() > now.getTime()) {
            throw new BadRequestException('Training date cannot be in the future');
        }

        const entity = await this.trainingModel.create({
            userId: dto.userId,
            description: dto.description,
            date: trainingDate,
            distance: dto.distance,
            activityType: dto.activityType,
        });

        const normalized = TrainingSerializer.normalize(entity);

        // metrics and logging
        this.metrics.mutate('activitiesCount', 1);
        this.logger.info('Training created', {
            id: normalized.id,
            userId: normalized.userId,
            distance: normalized.distance,
            activityType: normalized.activityType,
        });

        return normalized;
    }

    public async update(trainingId: string, dto: UpdateTrainingDto): Promise<TrainingNormalized> {
        const updateQuery: UpdateQuery<TrainingEntity> = {};

        if (dto.description) {
            updateQuery.description = dto.description;
        }

        if (dto.date) {
            const trainingDate = new Date(dto.date);
            const now = new Date();
            if (trainingDate.getTime() > now.getTime()) {
                throw new BadRequestException('Training date cannot be in the future');
            }
            updateQuery.date = trainingDate as any;
        }

        if (dto.distance) {
            updateQuery.distance = dto.distance as any;
        }

        if (dto.activityType) {
            updateQuery.activityType = dto.activityType as any;
        }

        const entity = await this.trainingModel.findByIdAndUpdate(trainingId, updateQuery, {
            new: true,
        });

        if (!entity) {
            throw new NotFoundException('Training not found');
        }

        return TrainingSerializer.normalize(entity);
    }

    public async deleteById(trainingId: string): Promise<TrainingNormalized> {
        const entity = await this.trainingModel.findByIdAndDelete(trainingId);

        if (!entity) {
            throw new NotFoundException('Training not found');
        }

        const normalized = TrainingSerializer.normalize(entity);

        // metrics and logging
        this.metrics.mutate('activitiesCount', -1);
        this.logger.info('Training deleted', {
            id: normalized.id,
            userId: normalized.userId,
            distance: normalized.distance,
            activityType: normalized.activityType,
        });

        return normalized;
    }

    public async deleteByUserId(userId: string): Promise<void> {
        await this.trainingModel.deleteMany({ userId });
    }
}
