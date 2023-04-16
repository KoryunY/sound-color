import { Optional } from "@nestjs/common";
import { ObjectId } from "mongoose";
import { ConvertingType } from "src/Defaults/types";

export interface SynesthesiaOptionsDto {
    name: string,
    type: ConvertingType,
    useIntervals: boolean;
    intervalCount?: number | 128,
    //saturation?: number | 100,
    // ligthness?: number | 50,
    user: ObjectId
}