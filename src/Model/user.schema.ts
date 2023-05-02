import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop({ required: true })
    name: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Config' }] })
    configs: Types.ObjectId[];

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Audio' }] })
    audios: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);