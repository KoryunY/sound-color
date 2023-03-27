import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<UserConfig>;

@Schema()
export class UserConfig {
    @Prop({ type: Types.ObjectId, ref: 'User' })
    user: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Config' })
    config: Types.ObjectId;
}

export const UserConfigSchema = SchemaFactory.createForClass(UserConfig);
