import { ApiProperty } from '@nestjs/swagger';

export class TrainingNormalized {
    id: string;
    userId: string;
    title: string;
    description: string;
    date: Date;
    distance: number;
    createdAt: Date;
    updatedAt: Date;
}

export class TrainingSerialized {
    @ApiProperty()
    id: string;

    @ApiProperty()
    userId: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    date: Date;

    @ApiProperty()
    distance: number;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}
