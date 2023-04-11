import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop()
    name: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'UserConfig' }] })
    userConfigs: Types.ObjectId[];

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Audio' }] })
    audios: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);