import { Energy, Genre, Instrument, Sentiment, Tempo } from "src/Defaults/types";

export interface ConfigDto {
    name: string,
    type: Genre | Tempo | Energy | Sentiment | Instrument,
    colors: string[];
}