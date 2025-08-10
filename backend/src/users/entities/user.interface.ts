import { ApiProperty } from '@nestjs/swagger';
import { Role } from './user.entity';

export class UserNormalized {
    id: string;
    email: string;
    name: string;
    role: Role;
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

export class UserSerialized {
    @ApiProperty()
    id: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    name: string;

    @ApiProperty({ enum: Role })
    role: Role;

    @ApiProperty({ required: false })
    imageUrl?: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}
