import { Energy, Genre, Instrument, Sentiment, Tempo } from "src/Defaults/types";

export interface UpdateConfigDto {
    name?: string,
    type?: Genre | Tempo | Energy | Sentiment | Instrument,
    colors?: string[]
}