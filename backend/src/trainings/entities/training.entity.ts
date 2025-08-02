import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ collection: 'trainings', timestamps: true })
export class TrainingEntity {
    _id: Types.ObjectId;

    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    date: Date;

    @Prop({ required: true })
    distance: number; // in kilometers

    createdAt: Date;
    updatedAt: Date;
}

export type TrainingDocument = HydratedDocument<TrainingEntity>;

export const TrainingSchema = SchemaFactory.createForClass(TrainingEntity);
