import { Optional } from "@nestjs/common";
import { ObjectId, Types } from "mongoose";
import { ConvertingType, Energy, Genre, IData, Instrument, Sentiment, Tempo } from "src/Defaults/types";

export interface UpdateConfigDto {
    name?: string,
    type?: Genre | Tempo | Energy | Sentiment | Instrument,
    colors?: string[];
}