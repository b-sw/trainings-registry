import { ApiProperty } from '@nestjs/swagger';
import { ActivityType } from './training.entity';

export class TrainingNormalized {
    id: string;
    userId: string;
    description: string;
    date: Date;
    distance: number;
    activityType: ActivityType;
    createdAt: Date;
    updatedAt: Date;
}

export class TrainingSerialized {
    @ApiProperty()
    id: string;

    @ApiProperty()
    userId: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    date: Date;

    @ApiProperty()
    distance: number;

    @ApiProperty({ enum: ActivityType })
    activityType: ActivityType;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}
