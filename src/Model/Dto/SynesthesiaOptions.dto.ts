import { Optional } from "@nestjs/common";
import { ObjectId } from "mongoose";
import { ConvertingType, SaveAndReturnOption } from "src/Defaults/types";

export interface SynesthesiaOptionsDto {
    name: string,
    type: ConvertingType,
    saveAndReturnOption: SaveAndReturnOption
    useIntervals: boolean;
    intervalCount?: number,
    user: ObjectId,
    gradientSplitCount?: number,
}