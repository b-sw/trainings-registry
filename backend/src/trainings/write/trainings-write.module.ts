import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TrainingEntity, TrainingSchema } from '../entities/training.entity';
import { TrainingsWriteService } from './trainings-write.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: TrainingEntity.name, schema: TrainingSchema }])],
    providers: [TrainingsWriteService],
    exports: [TrainingsWriteService],
})
export class TrainingsWriteModule {}
