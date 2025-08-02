import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserEntity, UserSchema } from '../entities/user.entity';
import { UsersWriteService } from './users-write.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: UserEntity.name, schema: UserSchema }])],
    providers: [UsersWriteService],
    exports: [UsersWriteService],
})
export class UsersWriteModule {}
