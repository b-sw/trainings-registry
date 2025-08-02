import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { envConfig } from 'src/shared/env.config';
import { UsersReadModule } from 'src/users/read/users-read.module';
import { UsersWriteModule } from 'src/users/write/users-write.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DevGuard } from './guards/dev.guard';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    imports: [
        JwtModule.register({
            secret: envConfig.jwtSecret,
            signOptions: { expiresIn: '30m' },
        }),
        UsersWriteModule,
        UsersReadModule,
    ],
    providers: [JwtStrategy, AuthService, DevGuard],
    controllers: [AuthController],
    exports: [AuthService, JwtStrategy, DevGuard],
})
export class AuthModule {}
