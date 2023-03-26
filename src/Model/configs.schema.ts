import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ConfigDocument = HydratedDocument<Config>;

@Schema()
export class Config {
    @Prop()
    name: string;

    @Prop()
    type: number;

    @Prop()
    breed: string;
}

export const Configchema = SchemaFactory.createForClass(Config);