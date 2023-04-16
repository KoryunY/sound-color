import { Optional } from "@nestjs/common";
import { ObjectId } from "mongoose";
import { ConvertingType, Energy, Genre, Instrument, SaveAndReturnOption, Sentiment } from "src/Defaults/types";

export interface SentimentOptionsDto {
    name: string,
    type: ConvertingType,
    saveAndReturnOption: SaveAndReturnOption,
    user: ObjectId,
    intervalCount: number,
    config?: string,
    sentiment:Sentiment
}