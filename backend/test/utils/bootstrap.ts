import { Injectable, ValidationPipe } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { PassportModule, PassportStrategy } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtGuard } from '../../src/auth/guards/jwt.guard';
import { TrainingEntity, TrainingSchema } from '../../src/trainings/entities/training.entity';
import { TrainingsReadModule } from '../../src/trainings/read/trainings-read.module';
import { TrainingsController } from '../../src/trainings/trainings.controller';
import { TrainingsWriteModule } from '../../src/trainings/write/trainings-write.module';
import { UserEntity, UserSchema } from '../../src/users/entities/user.entity';
import { GuardsModule } from '../../src/users/guards/guards.module';
import { UsersReadModule } from '../../src/users/read/users-read.module';
import { UsersController } from '../../src/users/users.controller';
import { UsersWriteModule } from '../../src/users/write/users-write.module';
import { AuthUtils } from './auth.utils';
import { closeInMemoryMongoServer, rootMongooseTestModule } from './mongo-in-memory-server';
import { TrainingUtils } from './training.utils';
import { UserUtils } from './user.utils';

// Set up test environment variables
process.env.DEV_AUTH_PASSWORD = 'test-dev-password';
process.env.JWT_SECRET = 'test-jwt-secret-key';

export type JwtPayload = { sub: string; email: string };

@Injectable()
class TestJwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'test-jwt-secret-key',
        });
    }

    async validate(payload: JwtPayload): Promise<{ id: string; email: string }> {
        return {
            id: payload.sub,
            email: payload.email,
        };
    }
}

export async function createTestApp() {
    const module: TestingModule = await Test.createTestingModule({
        imports: [
            rootMongooseTestModule(),
            PassportModule.register({ defaultStrategy: 'jwt' }),
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
            GuardsModule,
        ],
        controllers: [UsersController, TrainingsController],
        providers: [TestJwtStrategy, JwtGuard],
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
