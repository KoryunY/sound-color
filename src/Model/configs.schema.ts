import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Genres } from './genres.enum';

export type ConfigDocument = HydratedDocument<Config>;

@Schema()
export class Config {
    @Prop()
    name: string;

    @Prop()
    type: Genres;

    @Prop()
    colors: string[];

    @Prop({ type: [{ type: Types.ObjectId, ref: 'UserConfig' }] })
    userConfigs: Types.ObjectId[];
}

export const ConfigSchema = SchemaFactory.createForClass(Config);