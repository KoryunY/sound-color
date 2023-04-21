import { ConvertingType, SaveAndReturnOption } from "src/Defaults/types";
import { ObjectId } from "mongoose";

export interface SynesthesiaOptionsDto {
    name: string,
    type: ConvertingType,
    saveAndReturnOption: SaveAndReturnOption,
    useIntervals: boolean,
    intervalCount?: number,
    user: ObjectId,
    gradientSplitCount?: number,
    useCustomFft?: boolean
}