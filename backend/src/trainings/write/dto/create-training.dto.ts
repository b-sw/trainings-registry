import { ApiProperty } from '@nestjs/swagger';
import {
    IsDateString,
    IsIn,
    IsNotEmpty,
    IsNumber,
    IsPositive,
    IsString,
    Max,
    Min,
} from 'class-validator';
import { ActivityType } from '../../entities/training.entity';

export class CreateTrainingDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    userId: string;

    @ApiProperty()
    // @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsDateString()
    date: string;

    @ApiProperty({ minimum: 0, maximum: 999, exclusiveMaximum: true })
    @IsNumber()
    @IsPositive()
    @Min(0)
    @Max(999)
    distance: number;

    @ApiProperty({ enum: ActivityType })
    @IsNotEmpty()
    @IsIn([ActivityType.Running, ActivityType.Cycling, ActivityType.Walking])
    activityType: ActivityType;
}
