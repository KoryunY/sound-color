import { Optional } from "@nestjs/common";
import { ObjectId } from "mongoose";
import { ConvertingType } from "src/Defaults/types";

export interface ColorOptionsDto {
    name: string,
    type: ConvertingType,
    useIntervals: false;
    intervalCount?: number | 128,
    //saturation?: number | 100,
   // ligthness?: number | 50,
    config?: ObjectId
    user: ObjectId,
}