import { ConvertingType, SaveAndReturnOption, Sentiment } from "src/defaults/types";
import { ObjectId } from "mongoose";

export interface SentimentOptionsDto {
    name: string,
    type: ConvertingType,
    saveAndReturnOption: SaveAndReturnOption,
    user: ObjectId,
    intervalCount: number,
    config?: string,
    sentiment?: Sentiment,
    familyCount?: number,
    useCustomFft?: boolean
}