import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Role } from '../entities/user.entity';
import { UsersReadService } from '../read/users-read.service';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(protected readonly usersReadService: UsersReadService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = await this.usersReadService.readById(request.user.id);

        if (user && user.role === Role.Admin) {
            return true;
        }

        throw new ForbiddenException();
    }
}
