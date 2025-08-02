import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { Role } from './entities/user.entity';
import { UserSerialized } from './entities/user.interface';
import { UserSerializer } from './entities/user.serializer';
import { AdminGuard } from './guards/admin.guard';
import { UsersReadService } from './read/users-read.service';
import { CreateUserDto } from './write/dto/create-user.dto';
import { UpdateUserDto } from './write/dto/update-user.dto';
import { UsersWriteService } from './write/users-write.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersReadService: UsersReadService,
        private readonly usersWriteService: UsersWriteService,
    ) {}

    @Get('')
    @UseGuards(JwtGuard)
    @ApiOperation({ summary: 'Get all users' })
    async getAll(): Promise<UserSerialized[]> {
        const users = await this.usersReadService.readAll();
        return UserSerializer.serializeMany(users);
    }

    @Get('admins')
    @UseGuards(JwtGuard)
    @ApiOperation({ summary: 'Get all admins' })
    async getAllAdmins(): Promise<UserSerialized[]> {
        const users = await this.usersReadService.readByRole(Role.Admin);
        return UserSerializer.serializeMany(users);
    }

    @Get('employees')
    @UseGuards(JwtGuard)
    @ApiOperation({ summary: 'Get all employees' })
    async getAllEmployees(): Promise<UserSerialized[]> {
        const users = await this.usersReadService.readByRole(Role.Employee);
        return UserSerializer.serializeMany(users);
    }

    @Get(':userId')
    @UseGuards(JwtGuard)
    @ApiOperation({ summary: 'Get user by id' })
    async getById(@Param('userId') userId: string): Promise<UserSerialized> {
        const user = await this.usersReadService.readById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return UserSerializer.serialize(user);
    }

    @Post('')
    @UseGuards(JwtGuard, AdminGuard)
    @ApiOperation({ summary: 'Create user' })
    async create(@Body() dto: CreateUserDto): Promise<UserSerialized> {
        const user = await this.usersWriteService.create(dto);
        return UserSerializer.serialize(user);
    }

    @Put(':userId')
    @UseGuards(JwtGuard, AdminGuard)
    @ApiOperation({ summary: 'Update user' })
    async update(
        @Param('userId') userId: string,
        @Body() dto: UpdateUserDto,
    ): Promise<UserSerialized> {
        const user = await this.usersWriteService.update(userId, dto);
        return UserSerializer.serialize(user);
    }

    @Delete(':userId')
    @UseGuards(JwtGuard, AdminGuard)
    @ApiOperation({ summary: 'Delete user' })
    async delete(@Param('userId') userId: string): Promise<UserSerialized> {
        const user = await this.usersWriteService.deleteById(userId);
        return UserSerializer.serialize(user);
    }
}
