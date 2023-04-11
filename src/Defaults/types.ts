export enum ConvertingType {
    SYNESTHESIA,
    GENRE,
    TEMPO,
    INSTRUMENT,
    ENERGY,
    SPEECH
}

export enum Genre {
    ROCK,
    POP,
    ELECTRO,
    HIP_HOP,
    OTHER
}

export enum Tempo {
    slow,
    medium,
    fast,
    other,
}

export enum Energy {
    high,
    mid,
    low,
    other,
}

export enum Instrument {
    bass,
    guitar,
    drums,
    vocals,
    keyboard,
    brass,
    other 
}

export enum Sentiment {
    romantic,
    sad,
    political,
    angry,
    neutral
}

export type IData = {
    start: number;
    end: number;
    intensity: number;
    color: string;
}

