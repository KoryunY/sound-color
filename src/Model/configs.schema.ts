import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ConfigDocument = HydratedDocument<Config>;

@Schema()
export class Config {
    @Prop()
    name: string;

    @Prop()
    type: string

    @Prop()
    colors: string[];

    @Prop({ type: Types.ObjectId, ref: 'UserConfig' })
    user: Types.ObjectId;
}

export const ConfigSchema = SchemaFactory.createForClass(Config);