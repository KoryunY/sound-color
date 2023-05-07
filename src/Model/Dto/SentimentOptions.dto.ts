import { ConvertingType, SaveAndReturnOption, Sentiment } from "src/defaults/types";
import { ObjectId } from "mongoose";

export interface SentimentOptionsDto {
    name: string,
    type: ConvertingType,
    saveAndReturnOption: SaveAndReturnOption,
    intervalCount: number,
    sentiment?: Sentiment,
    familyCount?: number,
    config?: string,
    user: ObjectId,
    useCustomFft?: boolean
}