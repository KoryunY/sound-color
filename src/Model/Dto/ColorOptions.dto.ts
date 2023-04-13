import { Optional } from "@nestjs/common";
import { ObjectId } from "mongoose";
import { ConvertingType } from "src/Defaults/types";

export interface ColorOptionsDto {
    type: ConvertingType,
    saturation?: number | 100,
    ligthness?: number | 50,
    intervalCount?: number | 64,
    user: ObjectId,
    config?: ObjectId
}