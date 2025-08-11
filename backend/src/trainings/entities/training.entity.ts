import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export enum ActivityType {
    Running = 'running',
    Cycling = 'cycling',
    Walking = 'walking',
}

@Schema({ collection: 'trainings', timestamps: true })
export class TrainingEntity {
    _id: Types.ObjectId;

    @Prop({ required: true })
    userId: string;

    @Prop()
    description: string;

    @Prop({ required: true })
    date: Date;

    @Prop({
        required: true,
        validate: {
            validator: (value: number) => value >= 0 && value <= 999,
            message: 'Distance must be >= 0 and <= 999',
        },
    })
    distance: number;

    @Prop({ required: true, enum: ActivityType })
    activityType: ActivityType;

    createdAt: Date;
    updatedAt: Date;
}

export type TrainingDocument = HydratedDocument<TrainingEntity>;

export const TrainingSchema = SchemaFactory.createForClass(TrainingEntity);
