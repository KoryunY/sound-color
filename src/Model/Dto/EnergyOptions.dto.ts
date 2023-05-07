import { ConvertingType, SaveAndReturnOption } from "src/defaults/types";
import { ObjectId } from "mongoose";

export interface EnergyOptionsDto {
    name: string,
    type: ConvertingType,
    saveAndReturnOption: SaveAndReturnOption,
    intervalCount?: number,
    config?: string,
    user: ObjectId,
    useCustomFft?: boolean
}