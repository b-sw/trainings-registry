import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { envConfig } from './shared/env.config';
import { TrainingsModule } from './trainings/trainings.module';
import { UsersModule } from './users/users.module';

@Module({
    imports: [MongooseModule.forRoot(envConfig.mongoUrl), UsersModule, TrainingsModule, AuthModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
