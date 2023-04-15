import { Optional } from "@nestjs/common";
import { ObjectId } from "mongoose";
import { ConvertingType, Genre, Instrument } from "src/Defaults/types";

export interface InstrumentOptionsDto {
    name: string,
    type: ConvertingType,
    user: ObjectId,
    useIntervals: false;
    intervalCount?: number | 128,
    instrument?: Instrument;
    config?: string
}