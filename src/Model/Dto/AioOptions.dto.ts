import { ConvertingType, Genre, Instrument, SaveAndReturnOption, Sentiment, Tempo } from "src/defaults/types";
import { ObjectId } from "mongoose";

export interface AioOptionsDto {
    name: string,
    type: ConvertingType,
    saveAndReturnOption: SaveAndReturnOption,
    useIntervals?: boolean,
    intervalCount?: number,
    familyCount?: number,
    gradientSplitCount?: number,
    genre?: Genre,
    instrument?: Instrument,
    tempo?: Tempo
    sentiment?: Sentiment,
    config?: string,
    user: ObjectId,
    useCustomFft?: boolean,
}