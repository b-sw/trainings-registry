import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthDto {
    @ApiProperty({ type: String })
    @IsNotEmpty()
    googleToken: string;
}

export class AuthDevDto {
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    devPassword: string;
}
