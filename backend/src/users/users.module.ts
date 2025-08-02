import { Module } from '@nestjs/common';
import { UsersReadModule } from './read/users-read.module';
import { UsersController } from './users.controller';
import { UsersWriteModule } from './write/users-write.module';

@Module({
    imports: [UsersReadModule, UsersWriteModule],
    controllers: [UsersController],
    exports: [UsersReadModule, UsersWriteModule],
})
export class UsersModule {}
