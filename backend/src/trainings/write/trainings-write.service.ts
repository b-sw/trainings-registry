import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateQuery } from 'mongoose';
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
    ) {}

    async create(dto: CreateTrainingDto): Promise<TrainingNormalized> {
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

        return TrainingSerializer.normalize(entity);
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

        return TrainingSerializer.normalize(entity);
    }

    public async deleteByUserId(userId: string): Promise<void> {
        await this.trainingModel.deleteMany({ userId });
    }
}
