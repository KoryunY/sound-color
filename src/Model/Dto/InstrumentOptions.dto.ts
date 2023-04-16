import { Optional } from "@nestjs/common";
import { ObjectId } from "mongoose";
import { ConvertingType, Genre, Instrument, SaveAndReturnOption } from "src/Defaults/types";

export interface InstrumentOptionsDto {
    name: string,
    type: ConvertingType,
    saveAndReturnOption: SaveAndReturnOption,
    intervalCount?: number,
    instrument?: Instrument;
    config?: string
    user: ObjectId,
}