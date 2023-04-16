import { Optional } from "@nestjs/common";
import { ObjectId } from "mongoose";
import { ConvertingType, SaveAndReturnOption, Tempo } from "src/Defaults/types";

export interface TempoOptionsDto {
    name: string,
    type: ConvertingType,
    saveAndReturnOption: SaveAndReturnOption,
    intervalCount: number,
    tempo?: Tempo,
    config?: string
    user: ObjectId,
}