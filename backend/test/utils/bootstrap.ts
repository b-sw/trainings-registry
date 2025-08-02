import { ValidationPipe } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { JwtStrategy } from '../../src/auth/strategies/jwt.strategy';
import { TrainingEntity, TrainingSchema } from '../../src/trainings/entities/training.entity';
import { TrainingsReadModule } from '../../src/trainings/read/trainings-read.module';
import { TrainingsController } from '../../src/trainings/trainings.controller';
import { TrainingsWriteModule } from '../../src/trainings/write/trainings-write.module';
import { UserEntity, UserSchema } from '../../src/users/entities/user.entity';
import { UsersReadModule } from '../../src/users/read/users-read.module';
import { UsersController } from '../../src/users/users.controller';
import { UsersWriteModule } from '../../src/users/write/users-write.module';
import { AuthUtils } from './auth.utils';
import { closeInMemoryMongoServer, rootMongooseTestModule } from './mongo-in-memory-server';
import { TrainingUtils } from './training.utils';
import { UserUtils } from './user.utils';

// Set test environment variables
process.env.JWT_SECRET = 'test-jwt-secret-key';
process.env.DEV_AUTH_PASSWORD = 'test-dev-password';

export async function createTestApp() {
    const module: TestingModule = await Test.createTestingModule({
        imports: [
            rootMongooseTestModule(),
            PassportModule,
            JwtModule.register({
                secret: 'test-jwt-secret-key',
                signOptions: { expiresIn: '30m' },
            }),
            MongooseModule.forFeature([
                { name: UserEntity.name, schema: UserSchema },
                { name: TrainingEntity.name, schema: TrainingSchema },
            ]),
            UsersReadModule,
            UsersWriteModule,
            TrainingsReadModule,
            TrainingsWriteModule,
        ],
        controllers: [UsersController, TrainingsController],
        providers: [JwtStrategy],
    }).compile();

    const app = module.createNestApplication();
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            transformOptions: { enableImplicitConversion: true },
        }),
    );
    await app.init();

    const userModel: Model<UserEntity> = module.get(getModelToken(UserEntity.name));
    const trainingModel: Model<TrainingEntity> = module.get(getModelToken(TrainingEntity.name));

    const clearDatabase = async () => {
        await Promise.all([userModel.deleteMany({}), trainingModel.deleteMany({})]);
    };

    const beforeEach = async () => {
        await clearDatabase();
    };

    const afterAll = async () => {
        await app.close();
        await closeInMemoryMongoServer();
    };

    return {
        app,
        module,
        models: {
            userModel,
            trainingModel,
        },
        utils: {
            userUtils: new UserUtils(app),
            trainingUtils: new TrainingUtils(app),
            authUtils: new AuthUtils(app),
        },
        methods: {
            clearDatabase,
            beforeEach,
            afterAll,
        },
    };
}
