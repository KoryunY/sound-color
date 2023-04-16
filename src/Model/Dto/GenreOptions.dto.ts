import { Optional } from "@nestjs/common";
import { ObjectId } from "mongoose";
import { ConvertingType, Genre, SaveAndReturnOption } from "src/Defaults/types";

export interface GenreOptionsDto {
    name: string,
    type: ConvertingType,
    saveAndReturnOption: SaveAndReturnOption,
    useIntervals: boolean;
    intervalCount?: number,
    genre?: Genre;
    config?: string
    user: ObjectId,
}