import { Optional } from "@nestjs/common";
import { ObjectId } from "mongoose";
import { ConvertingType, Genre } from "src/Defaults/types";

export interface GenreOptionsDto {
    name: string,
    type: ConvertingType,
    user: ObjectId,
    useIntervals: false;
    intervalCount?: number | 128,
    genre?: Genre;
    config?: string
}