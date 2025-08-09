import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, Min } from 'class-validator';

export class ActivityDto {
    @ApiProperty()
    @IsDateString()
    startDate: string;

    @ApiProperty()
    @IsDateString()
    endDate: string;

    @ApiPropertyOptional({ description: 'Number of items to skip' })
    @IsOptional()
    @IsNumber()
    @Min(0)
    skip?: number;

    @ApiPropertyOptional({ description: 'Max number of items to return' })
    @IsOptional()
    @IsNumber()
    @Min(1)
    limit?: number;
}
