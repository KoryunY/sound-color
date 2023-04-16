import { Optional } from "@nestjs/common";
import { ObjectId } from "mongoose";
import { ConvertingType, Energy, Genre, Instrument, SaveAndReturnOption } from "src/Defaults/types";

export interface EnergyOptionsDto {
    name: string,
    type: ConvertingType,
    saveAndReturnOption: SaveAndReturnOption,
    user: ObjectId,
    intervalCount?: number,
    config?: string,
}