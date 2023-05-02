import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ConfigDocument = HydratedDocument<Config>;

@Schema()
export class Config {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    type: string

    @Prop({ required: true })
    colors: string[];

    @Prop({ type: Types.ObjectId, ref: 'UserConfig', required: true })
    user: Types.ObjectId;
}

export const ConfigSchema = SchemaFactory.createForClass(Config);