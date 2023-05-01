import { ConvertingType, Genre, SaveAndReturnOption } from "src/defaults/types";
import { ObjectId } from "mongoose";

export interface GenreOptionsDto {
    name: string,
    type: ConvertingType,
    saveAndReturnOption: SaveAndReturnOption,
    useIntervals: boolean,
    intervalCount?: number,
    genre?: Genre,
    config?: string
    user: ObjectId,
    useCustomFft?: boolean
}