export enum ConvertingType {
    SYNESTHESIA,
    GENRE,
    TEMPO,
    INSTRUMENT,
    ENERGY,
    SPEECH
}

export type IData = {
    start: number;
    end: number;
    intensity: number;
    color: string;
}