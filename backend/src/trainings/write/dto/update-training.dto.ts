import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsIn, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { ActivityType } from '../../entities/training.entity';

export class UpdateTrainingDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    date?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @IsPositive()
    distance?: number;

    @ApiPropertyOptional({ enum: ActivityType })
    @IsOptional()
    @IsIn([ActivityType.Running, ActivityType.Cycling, ActivityType.Walking])
    activityType?: ActivityType;
}
