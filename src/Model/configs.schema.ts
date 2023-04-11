import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Genre, Tempo, Energy, Sentiment, Instrument } from 'src/Defaults/types';

export type ConfigDocument = HydratedDocument<Config>;

@Schema()
export class Config {
    @Prop()
    name: string;

    @Prop()
    type: Genre | Tempo | Energy | Sentiment | Instrument;

    @Prop()
    colors: string[];

    @Prop({ type: Types.ObjectId, ref: 'UserConfig' })
    user: Types.ObjectId;
}

export const ConfigSchema = SchemaFactory.createForClass(Config);