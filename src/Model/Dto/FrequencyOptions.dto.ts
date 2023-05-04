import { ConvertingType, SaveAndReturnOption } from "src/defaults/types";
import { ObjectId } from "mongoose";

export interface FrequencyOptionsDto {
    name: string,
    type: ConvertingType,
    saveAndReturnOption: SaveAndReturnOption,
    useIntervals: boolean,
    intervalCount?: number,
    user: ObjectId,
    gradientSplitCount?: number,
    useCustomFft?: boolean
}