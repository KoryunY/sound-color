import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ConfigDocument = HydratedDocument<Config>;

@Schema()
export class Config {
    @Prop()
    name: string;

    @Prop()
    colors: string[];

    @Prop({ type: [{ type: Types.ObjectId, ref: 'UserConfig' }] })
    userConfigs: Types.ObjectId[];
}

export const ConfigSchema = SchemaFactory.createForClass(Config);