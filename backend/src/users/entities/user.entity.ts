import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export enum Role {
    Admin = 'admin',
    Employee = 'employee',
    User = 'user',
}

@Schema({ collection: 'users', timestamps: true })
export class UserEntity {
    _id: Types.ObjectId;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true, enum: Role, default: Role.User })
    role: Role;

    createdAt: Date;
    updatedAt: Date;
}

export type UserDocument = HydratedDocument<UserEntity>;

export const UserSchema = SchemaFactory.createForClass(UserEntity);
