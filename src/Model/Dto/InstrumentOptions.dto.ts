import { ConvertingType, Instrument, SaveAndReturnOption } from "src/Defaults/types";
import { ObjectId } from "mongoose";

export interface InstrumentOptionsDto {
    name: string,
    type: ConvertingType,
    saveAndReturnOption: SaveAndReturnOption,
    intervalCount?: number,
    instrument?: Instrument;
    config?: string
    user: ObjectId,
}