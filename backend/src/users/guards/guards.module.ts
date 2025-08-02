import { Module } from '@nestjs/common';
import { UsersReadModule } from '../read/users-read.module';
import { AdminGuard } from './admin.guard';
import { SelfGuard } from './self.guard';

@Module({
    imports: [UsersReadModule],
    providers: [AdminGuard, SelfGuard],
    exports: [AdminGuard, SelfGuard],
})
export class GuardsModule {}
