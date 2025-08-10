import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsUrl } from 'class-validator';
import { Role } from '../../entities/user.entity';

export class UpdateUserDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    name?: string;

    @ApiProperty({ enum: Role, required: false })
    @IsOptional()
    @IsEnum(Role)
    role?: Role;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUrl()
    imageUrl?: string;
}
