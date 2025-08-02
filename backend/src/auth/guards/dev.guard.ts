import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { envConfig } from 'src/shared/env.config';
import { AuthDevDto } from '../dto/auth.dto';

@Injectable()
export class DevGuard implements CanActivate {
    static readonly DEV_ENV = 'development';
    static readonly NOT_DEV_ENV_MESSAGE = 'Not dev env.';
    static readonly INVALID_DEV_AUTH_PASSWORD_MESSAGE = 'Invalid dev auth password.';

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const body: AuthDevDto = request.body;

        this.requireDevEnv();
        this.requireValidDevAuthPassword(body.devPassword);

        return true;
    }

    private requireDevEnv(): void {
        const isDevEnv = !process.env.NODE_ENV || process.env.NODE_ENV === DevGuard.DEV_ENV;

        if (!isDevEnv) {
            throw new HttpException(DevGuard.NOT_DEV_ENV_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }

    private requireValidDevAuthPassword(devPassword: string): void {
        const isValidDevAuthPassword = devPassword && devPassword === envConfig.devAuthPassword;

        if (!isValidDevAuthPassword) {
            throw new HttpException(
                DevGuard.INVALID_DEV_AUTH_PASSWORD_MESSAGE,
                HttpStatus.FORBIDDEN,
            );
        }
    }
}
