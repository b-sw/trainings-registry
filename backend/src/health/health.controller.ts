import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Connection } from 'mongoose';

@ApiTags('health')
@Controller()
export class HealthController {
    constructor(@InjectConnection() private readonly connection: Connection) {}

    @Get('health')
    @ApiOperation({ summary: 'Health check' })
    async health(): Promise<{
        status: string;
        uptime: number;
        db: string;
        timestamp: string;
    }> {
        const dbState = this.connection.readyState === 1 ? 'up' : 'down';
        return {
            status: 'ok',
            uptime: process.uptime(),
            db: dbState,
            timestamp: new Date().toISOString(),
        };
    }
}
