export type IData = {
    start: number;
    end: number;
    intensity: number;
    color: string;
}

export enum ConvertingType {
    SYNESTHESIA = "SYNESTHESIA",
    GENRE = "GENRE",
    TEMPO = "TEMPO",
    INSTRUMENT = "INSTRUMENT",
    ENERGY = "ENERGY",
    SPEECH = "SPEECH"
}

export enum SaveAndReturnOption {
    SAVE_AND_RETURN_ID = "SAVE_AND_RETURN_ID",
    SAVE_AND_RETURN_DEMO = "SAVE_AND_RETURN_DEMO",
    RETURN_DEMO = "RETURN_DEMO",

}

export enum Genre {
    ROCK = "ROCK",
    POP = "POP",
    ELECTRONIC = "ELECTRONIC",
    HIP_HOP = "HIP_HOP",
    JAZZ = "JAZZ",
    BLUES = "BLUES",
    COUNTRY = "COUNTRY",
    CLASSICAL = "CLASSICAL",
    REGGAE = "REGGAE",
    FOLK = "FOLK",
    WORLD = "WORLD",
    LATIN = "LATIN",
    RNB = "RNB",
    METAL = "METAL",
    PUNK = "PUNK",
    FUNK = "FUNK",
    SOUL = "SOUL",
    DISCO = "DISCO",
    GOSPEL = "GOSPEL",
    OTHER = "OTHER"
}


export enum Tempo {
    LARGHISSIMO,
    ADAGISSIMO,
    GRAVE,
    LARGO,
    ADAGIO,
    LARGHETTO,
    ADAGIETTO,
    LENTO,
    ANDANTE,
    ANDANTINO,
    MARCIA_MODERATO,
    ANDANTE_MODERATO,
    MODERATO,
    ALLEGRETTO,
    ALLEGRO_MODERATO,
    ALLEGRO,
    MOLTO_ALLEGRO,
    VIVACE,
    VIVACISSIMO,
    ALLEGRISIMO,
    PRESTO,
    PRESTISSIMO,
    OTHER,
}

export enum Energy {
    high,
    mid,
    low,
    other,
}

export enum Instrument {
    ACOUSTIC_BASS,
    ACOUSTIC_GUITAR,
    ALTO_SAXOPHONE,
    BACKING_VOCALS,
    BANJO,
    BARITONE_SAXOPHONE,
    BASS,
    BASS_CLARINET,
    BASS_GUITAR,
    BASS_SYNTH,
    CELLO,
    CHURCH_ORGAN,
    CLARINET,
    CLASSICAL_GUITAR,
    CONTRABASS,
    COWBELL,
    DRUMS,
    ELECTRIC_BASS,
    ELECTRIC_GUITAR,
    ELECTRIC_PIANO,
    FLUTE,
    FRENCH_HORN,
    GRAND_PIANO,
    HAMMOND_ORGAN,
    HARP,
    HARPSICHORD,
    HORN_SECTION,
    KEYBOARD,
    LEAD_GUITAR,
    LEAD_SYNTH,
    MARACAS,
    MARIMBA,
    MIXING_DESK,
    OBOE,
    ORCHESTRA_HIT,
    ORGAN,
    OTHER,
    OUD,
    OVERDRIVEN_GUITAR,
    PAD_SYNTH,
    PERCUSSION,
    PIANO,
    RHYTHM_GUITAR,
    SAXOPHONE,
    SHAKER,
    SLIDE_GUITAR,
    SOPRANO_SAXOPHONE,
    STEEL_DRUMS,
    STRINGS,
    SYNTH_BASS,
    SYNTH_BRASS,
    SYNTH_CHOIR,
    SYNTH_DRUMS,
    SYNTH_GUITAR,
    SYNTH_KEYS,
    SYNTH_LEAD,
    SYNTH_ORCHESTRA,
    SYNTH_PAD,
    SYNTH_PLUCK,
    TALKING_DRUM,
    TAMBORA,
    TAMBOURINE,
    TENOR_SAXOPHONE,
    TIMBALES,
    TIMPANI,
    TRUMPET,
    TROMBONE,
    TUBA,
    UKULELE,
    VIOLA,
    VIOLIN,
    VOCALS,
    WHISTLE,
    WURLITZER_PIANO,
    XYLOPHONE
}

export enum Sentiment {
    LOVE,
    JOY,
    ANGER,
    SADNESS,
    FEAR,
    SURPRISE,
    TRUST,
    DISGUST,
    NEUTRAL
}



