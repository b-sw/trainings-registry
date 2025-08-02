import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TrainingEntity, TrainingSchema } from '../entities/training.entity';
import { TrainingsReadService } from './trainings-read.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: TrainingEntity.name, schema: TrainingSchema }])],
    providers: [TrainingsReadService],
    exports: [TrainingsReadService],
})
export class TrainingsReadModule {}
