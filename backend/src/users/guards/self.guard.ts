import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Role } from '../entities/user.entity';
import { UsersReadService } from '../read/users-read.service';

@Injectable()
export class SelfGuard implements CanActivate {
    constructor(protected readonly usersReadService: UsersReadService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        // Check if user is admin first (admins can do anything)
        const user = await this.usersReadService.readById(request.user.id);
        if (user && user.role === Role.Admin) {
            return true;
        }

        // For training creation, check if userId in body matches authenticated user
        if (request.body && request.body.userId) {
            if (request.user.id === request.body.userId) {
                return true;
            }
        }

        // For updating own profile, check if userId in params matches authenticated user
        if (request.params && request.params.userId) {
            if (request.user.id === request.params.userId) {
                return true;
            }
        }

        throw new ForbiddenException();
    }
}
