import { ConvertingType, SaveAndReturnOption, Tempo } from "src/Defaults/types";
import { ObjectId } from "mongoose";

export interface TempoOptionsDto {
    name: string,
    type: ConvertingType,
    saveAndReturnOption: SaveAndReturnOption,
    intervalCount: number,
    tempo?: Tempo,
    config?: string
    user: ObjectId,
    useCustomFft?: boolean
}