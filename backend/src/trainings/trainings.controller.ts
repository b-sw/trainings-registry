import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AdminGuard } from '../users/guards/admin.guard';
import { SelfGuard } from '../users/guards/self.guard';
import { TrainingSerialized } from './entities/training.interface';
import { TrainingSerializer } from './entities/training.serializer';
import { TrainingsReadService } from './read/trainings-read.service';
import { ActivityDto } from './write/dto/activity.dto';
import { CreateTrainingDto } from './write/dto/create-training.dto';
import { UpdateTrainingDto } from './write/dto/update-training.dto';
import { TrainingsWriteService } from './write/trainings-write.service';

@ApiTags('trainings')
@Controller()
export class TrainingsController {
    constructor(
        private readonly trainingsReadService: TrainingsReadService,
        private readonly trainingsWriteService: TrainingsWriteService,
    ) {}

    @Get('trainings')
    @UseGuards(JwtGuard)
    @ApiOperation({ summary: 'Get all trainings' })
    async getAll(): Promise<TrainingSerialized[]> {
        const trainings = await this.trainingsReadService.readAll();
        return TrainingSerializer.serializeMany(trainings);
    }

    @Get('trainings/total-distance')
    @UseGuards(JwtGuard)
    @ApiOperation({ summary: 'Get total distance across all trainings' })
    async getTotalDistance(): Promise<{ totalDistance: number }> {
        const totalDistance = await this.trainingsReadService.getTotalDistance();
        return { totalDistance };
    }

    @Get('trainings/:trainingId')
    @UseGuards(JwtGuard)
    @ApiOperation({ summary: 'Get training by id' })
    async getById(@Param('trainingId') trainingId: string): Promise<TrainingSerialized> {
        const training = await this.trainingsReadService.readById(trainingId);
        if (!training) {
            throw new NotFoundException('Training not found');
        }
        return TrainingSerializer.serialize(training);
    }

    @Post('trainings')
    @UseGuards(JwtGuard, SelfGuard)
    @ApiOperation({ summary: 'Create a training' })
    async create(@Body() dto: CreateTrainingDto): Promise<TrainingSerialized> {
        const training = await this.trainingsWriteService.create(dto);
        return TrainingSerializer.serialize(training);
    }

    @Put('trainings/:trainingId')
    @UseGuards(JwtGuard, AdminGuard)
    @ApiOperation({ summary: 'Update a training' })
    async update(
        @Param('trainingId') trainingId: string,
        @Body() dto: UpdateTrainingDto,
    ): Promise<TrainingSerialized> {
        const training = await this.trainingsWriteService.update(trainingId, dto);
        return TrainingSerializer.serialize(training);
    }

    @Delete('trainings/:trainingId')
    @UseGuards(JwtGuard, AdminGuard)
    @ApiOperation({ summary: 'Delete a training' })
    async delete(@Param('trainingId') trainingId: string): Promise<TrainingSerialized> {
        const training = await this.trainingsWriteService.deleteById(trainingId);
        return TrainingSerializer.serialize(training);
    }

    @Get('users/:userId/trainings')
    @UseGuards(JwtGuard)
    @ApiOperation({ summary: 'Get user trainings with pagination support' })
    @ApiQuery({
        name: 'skip',
        required: false,
        type: Number,
        description: 'Number of trainings to skip',
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Number of trainings to return (max 100)',
    })
    async getUserTrainings(
        @Param('userId') userId: string,
        @Query('skip') skip?: string,
        @Query('limit') limit?: string,
    ): Promise<{
        trainings: TrainingSerialized[];
        total: number;
        hasMore: boolean;
        skip: number;
        limit: number;
    }> {
        const skipNum = skip ? parseInt(skip, 10) : 0;
        const limitNum = limit ? Math.min(parseInt(limit, 10), 100) : 20; // Max 100 to prevent abuse

        const result = await this.trainingsReadService.readByUserIdPaginated(
            userId,
            skipNum,
            limitNum,
        );

        return {
            trainings: TrainingSerializer.serializeMany(result.trainings),
            total: result.total,
            hasMore: result.hasMore,
            skip: skipNum,
            limit: limitNum,
        };
    }

    @Post('users/:userId/activities')
    @HttpCode(200)
    @UseGuards(JwtGuard)
    @ApiOperation({ summary: 'Get user activity in date range' })
    async getUserActivities(
        @Param('userId') userId: string,
        @Body() dto: ActivityDto,
    ): Promise<{
        userId: string;
        totalDistance: number;
        totalTrainings: number;
        trainings: TrainingSerialized[];
    }> {
        const trainings = await this.trainingsReadService.readByDateRange(
            new Date(dto.startDate),
            new Date(dto.endDate),
        );
        const userTrainings = trainings.filter((t) => t.userId === userId);
        const totalDistance = userTrainings.reduce((acc, training) => acc + training.distance, 0);

        return {
            userId,
            totalDistance,
            totalTrainings: userTrainings.length,
            trainings: TrainingSerializer.serializeMany(userTrainings),
        };
    }

    @Post('users/activities')
    @HttpCode(200)
    @UseGuards(JwtGuard)
    @ApiOperation({ summary: 'Get all users activities in date range' })
    async getAllUsersActivities(@Body() dto: ActivityDto): Promise<
        {
            userId: string;
            totalDistance: number;
            totalTrainings: number;
        }[]
    > {
        const trainings = await this.trainingsReadService.readByDateRange(
            new Date(dto.startDate),
            new Date(dto.endDate),
        );

        // Group by userId
        const userActivities = trainings.reduce(
            (acc, training) => {
                if (!acc[training.userId]) {
                    acc[training.userId] = {
                        userId: training.userId,
                        totalDistance: 0,
                        totalTrainings: 0,
                    };
                }

                acc[training.userId].totalDistance += training.distance;
                acc[training.userId].totalTrainings += 1;

                return acc;
            },
            {} as Record<string, { userId: string; totalDistance: number; totalTrainings: number }>,
        );

        return Object.values(userActivities);
    }

    @Post('teams/activities')
    @HttpCode(200)
    @UseGuards(JwtGuard)
    @ApiOperation({ summary: 'Get team activities summary for date range' })
    async getTeamActivities(@Body() dto: ActivityDto): Promise<{
        totalDistance: number;
        totalTrainings: number;
        totalUsers: number;
    }> {
        const trainings = await this.trainingsReadService.readByDateRange(
            new Date(dto.startDate),
            new Date(dto.endDate),
        );
        const uniqueUsers = new Set(trainings.map((t) => t.userId));

        const totalDistance = trainings.reduce((acc, training) => acc + training.distance, 0);

        return {
            totalDistance,
            totalTrainings: trainings.length,
            totalUsers: uniqueUsers.size,
        };
    }
}
