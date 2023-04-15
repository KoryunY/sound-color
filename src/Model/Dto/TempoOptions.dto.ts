import { Optional } from "@nestjs/common";
import { ObjectId } from "mongoose";
import { ConvertingType, Tempo } from "src/Defaults/types";

export interface TempoOptionsDto {
    name: string,
    type: ConvertingType,
    user: ObjectId,
    useIntervals: false;
    intervalCount?: number | 128,
    tempo?: Tempo;
    config?: ObjectId
}