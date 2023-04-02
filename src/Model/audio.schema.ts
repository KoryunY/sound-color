import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Genres } from './genres.enum';

export type AudioDocument = HydratedDocument<Audio>;

@Schema()
export class Audio {
    @Prop({ type: Types.Array })
    data: Types.Array<number>;
}

export const AudioSchema = SchemaFactory.createForClass(Audio);