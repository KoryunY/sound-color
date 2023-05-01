import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { IData } from 'src/defaults/types';

export type AudioDocument = HydratedDocument<Audio>;



// interface IDataDocument extends Document {
//     data: IData[];
// }

@Schema()
export class Audio {
    @Prop()
    name: string;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    user: Types.ObjectId;

    @Prop({ type: [{ start: Number, end: Number, intensity: Number, color: String }], required: true })
    data: Types.Array<IData>;
}

export const AudioSchema = SchemaFactory.createForClass(Audio);