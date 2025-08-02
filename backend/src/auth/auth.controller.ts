import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService, UserInfo } from './auth.service';
import { AuthDevDto, AuthDto } from './dto/auth.dto';
import { DevGuard } from './guards/dev.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('google')
    @ApiOperation({ summary: 'Authenticate user with Google token' })
    async authenticateUser(@Body() authDto: AuthDto): Promise<UserInfo> {
        return this.authService.googleLogin(authDto.googleToken);
    }

    @Post('dev')
    @UseGuards(DevGuard)
    @ApiOperation({ summary: 'Authenticate user in development mode' })
    async authenticateUserDev(@Body() authDto: AuthDevDto): Promise<{ accessToken: string }> {
        return this.authService.devLogin(authDto.email);
    }
}
