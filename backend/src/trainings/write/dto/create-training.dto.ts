import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsIn, IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
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

    @ApiProperty()
    @IsNumber()
    @IsPositive()
    distance: number;

    @ApiProperty({ enum: ActivityType })
    @IsNotEmpty()
    @IsIn([ActivityType.Running, ActivityType.Cycling, ActivityType.Walking])
    activityType: ActivityType;
}
