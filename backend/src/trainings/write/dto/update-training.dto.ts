import { ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsDateString,
    IsIn,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    Max,
    Min,
} from 'class-validator';
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

    @ApiPropertyOptional({ minimum: 0, maximum: 999, exclusiveMaximum: true })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    @Min(0)
    @Max(999)
    distance?: number;

    @ApiPropertyOptional({ enum: ActivityType })
    @IsOptional()
    @IsIn([ActivityType.Running, ActivityType.Cycling, ActivityType.Walking])
    activityType?: ActivityType;
}
