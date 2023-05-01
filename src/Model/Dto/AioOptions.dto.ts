import { ConvertingType, Genre, Instrument, SaveAndReturnOption, Sentiment, Tempo } from "src/defaults/types";
import { ObjectId } from "mongoose";

export interface AioOptionsDto {
    name: string,
    type: ConvertingType,
    saveAndReturnOption: SaveAndReturnOption,
    user: ObjectId,
    config?: string,
    useIntervals?: boolean,
    intervalCount?: number,
    familyCount?: number,
    gradientSplitCount?: number,
    genre?: Genre,
    instrument?: Instrument,
    tempo?: Tempo
    sentiment?: Sentiment,
    useCustomFft?: boolean,
}