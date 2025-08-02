import { Module } from '@nestjs/common';
import { UsersReadModule } from 'src/users/read/users-read.module';
import { TrainingsReadModule } from './read/trainings-read.module';
import { TrainingsController } from './trainings.controller';
import { TrainingsWriteModule } from './write/trainings-write.module';

@Module({
    imports: [TrainingsReadModule, TrainingsWriteModule, UsersReadModule],
    controllers: [TrainingsController],
})
export class TrainingsModule {}
