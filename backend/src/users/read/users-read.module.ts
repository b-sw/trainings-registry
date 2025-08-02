import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserEntity, UserSchema } from '../entities/user.entity';
import { UsersReadService } from './users-read.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: UserEntity.name, schema: UserSchema }])],
    providers: [UsersReadService],
    exports: [UsersReadService],
})
export class UsersReadModule {}
