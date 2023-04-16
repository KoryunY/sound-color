import { ConvertingType, SaveAndReturnOption } from "src/Defaults/types";
import { ObjectId } from "mongoose";

export interface EnergyOptionsDto {
    name: string,
    type: ConvertingType,
    saveAndReturnOption: SaveAndReturnOption,
    user: ObjectId,
    intervalCount?: number,
    config?: string,
}