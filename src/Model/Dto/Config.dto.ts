import { Optional } from "@nestjs/common";
import { ObjectId, Types } from "mongoose";
import { ConvertingType, IData } from "src/Defaults/types";

export interface ConfigDto {
    name: string,
    // type: Genre | Tempo | Energy | Sentiment | Instrument,
    data: Types.Array<IData>;
}