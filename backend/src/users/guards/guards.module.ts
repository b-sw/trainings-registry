import { Module } from '@nestjs/common';
import { TrainingsReadModule } from '../../trainings/read/trainings-read.module';
import { UsersReadModule } from '../read/users-read.module';
import { AdminGuard } from './admin.guard';
import { SelfGuard } from './self.guard';

@Module({
    imports: [UsersReadModule, TrainingsReadModule],
    providers: [AdminGuard, SelfGuard],
    exports: [AdminGuard, SelfGuard],
})
export class GuardsModule {}
