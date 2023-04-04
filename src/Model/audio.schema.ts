import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Genres } from './genres.enum';

export type AudioDocument = HydratedDocument<Audio>;

type IData = {
    start: number;
    end: number;
    intensity: number;
    color: string;
}

// interface IDataDocument extends Document {
//     data: IData[];
// }

@Schema()
export class Audio {
    @Prop({ type: [{ start: Number, end: Number, intensity: Number, color: String }], required: true })
    data: Types.Array<IData>;
}

export const AudioSchema = SchemaFactory.createForClass(Audio);