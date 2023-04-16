export const AllowedMimes = ['audio/mp3', 'audio/mpeg'];
export const defaultIntervalCOunt = 256;

export const genreColors = {
    ROCK: ["#ff0000", "#000000", "#ffffff"], // red, black, white
    POP: ["#ff8800", "#ffff00", "#00ffff"], // orange, yellow, cyan
    ELECTRONIC: ["#ffff00", "#00ff00", "#0000ff"], // yellow, green, blue
    HIPHOP: ["#00ff00", "#ff00ff", "#ff0000"], // green, magenta, red
    CLASSICAL: ["#ff8800", "#ffff00", "#00ffff"],
    OTHER: ["#ffff00", "#00ff00", "#0000ff"],
    JAZZ: ["#ffff00", "#00ff00", "#0000ff"]
};

export const tempoColors = {
    'slow': ["#00ff00", "#ff00ff", "#ff0000"],
    'medium': ["#ff8800", "#ffff00", "#00ffff"],
    'fast': ["#ff8800", "#ffff00", "#00ffff"],
    'other': ["#ff0000", "#000000", "#ffffff"]
};
export const energyColors = {
    high: '#ff0000',  // red
    mid: '#ffff00',  // yellow
    low: '#00ff00',   // green
};

export const instrumentColors = {
    bass: ["#ff0000", "#000000", "#ffffff"], // red, black, white
    guitar: ["#ff8800", "#ffff00", "#00ffff"], // orange, yellow, cyan
    drums: ["#ffff00", "#00ff00", "#0000ff"], // yellow, green, blue
    vocals: ["#00ff00", "#ff00ff", "#ff0000"], // green, magenta, red
    keyboard: ["#ff8800", "#ffff00", "#00ffff"],
    brass: ["#ffff00", "#00ff00", "#0000ff"],
    other: ["#ffff00", "#00ff00", "#0000ff"]
};

export const sentimentDict = {
    'love': 'LOVE',
    'romance': 'LOVE',
    'affection': 'LOVE',
    'passion': 'LOVE',
    'joy': 'JOY',
    'happiness': 'JOY',
    'excitement': 'JOY',
    'delight': 'JOY',
    'anger': 'ANGER',
    'rage': 'ANGER',
    'frustration': 'ANGER',
    'sadness': 'SADNESS',
    'grief': 'SADNESS',
    'heartbreak': 'SADNESS',
    'fear': 'FEAR',
    'terror': 'FEAR',
    'anxiety': 'FEAR',
    'surprise': 'SURPRISE',
    'shock': 'SURPRISE',
    'astonishment': 'SURPRISE',
    'trust': 'TRUST',
    'confidence': 'TRUST',
    'reliance': 'TRUST',
    'disgust': 'DISGUST',
    'revulsion': 'DISGUST',
    'nausea': 'DISGUST',
    'neutral': 'NEUTRAL'
};

export const sentimentsColors = {
    romantic: ["#FF1493", "#FF69B4", "#FFC0CB"], // deep pink, hot pink, pink
    sad: ["#6495ED", "#1E90FF", "#4169E1"], // cornflower blue, dodger blue, royal blue
    political: ["#FF8C00", "#FFA500", "#FFD700"], // dark orange, orange, gold
    angry: ["#B22222", "#DC143C", "#FF0000"], // firebrick, crimson, red
    neutral: ["#808080", "#A9A9A9", "#D3D3D3"] // gray, dark gray, light gray
};

export const instrumentPitchRanges = {
    "ACOUSTIC_BASS": { min: 21, max: 48 },
    "ACOUSTIC_GUITAR": { min: 40, max: 88 },
    "ALTO_SAXOPHONE": { min: 49, max: 88 },
    "BACKING_VOCALS": { min: 40, max: 88 },
    "BANJO": { min: 50, max: 79 },
    "BARITONE_SAXOPHONE": { min: 29, max: 72 },
    "BASS": { min: 21, max: 48 },
    "BASS_CLARINET": { min: 21, max: 48 },
    "BASS_GUITAR": { min: 21, max: 48 },
    "BASS_SYNTH": { min: 21, max: 96 },
    "CELLO": { min: 36, max: 76 },
    "CHURCH_ORGAN": { min: 21, max: 96 },
    "CLARINET": { min: 49, max: 88 },
    "CLASSICAL_GUITAR": { min: 40, max: 88 },
    "CONTRABASS": { min: 21, max: 48 },
    "COWBELL": { min: 60, max: 80 },
    "DRUMS": { min: 36, max: 84 },
    "ELECTRIC_BASS": { min: 21, max: 48 },
    "ELECTRIC_GUITAR": { min: 40, max: 88 },
    "ELECTRIC_PIANO": { min: 21, max: 96 },
    "FLUTE": { min: 65, max: 88 },
    "FRENCH_HORN": { min: 45, max: 72 },
    "GRAND_PIANO": { min: 21, max: 96 },
    "HAMMOND_ORGAN": { min: 21, max: 96 },
    "HARP": { min: 40, max: 84 },
    "HARPSICHORD": { min: 29, max: 84 },
    "HORN_SECTION": { min: 45, max: 72 },
    "KEYBOARD": { min: 21, max: 96 },
    "LEAD_GUITAR": { min: 40, max: 88 },
    "LEAD_SYNTH": { min: 21, max: 96 },
    "MARACAS": { min: 80, max: 100 },
    "MARIMBA": { min: 49, max: 84 },
    "MIXING_DESK": { min: 0, max: 0 },
    "OBOE": { min: 49, max: 84 },
    "ORCHESTRA_HIT": { min: 21, max: 96 },
    "ORGAN": { min: 21, max: 96 },
    "OTHER": { min: 0, max: 127 },
    "OUD": { min: 40, max: 84 },
    "OVERDRIVEN_GUITAR": { min: 40, max: 88 },
    "PAD_SYNTH": { min: 21, max: 96 },
    "PERCUSSION": { min: 36, max: 81 },
    "PIANO": { min: 21, max: 96 },
    "RHYTHM_GUITAR": { min: 40, max: 88 },
    "SAXOPHONE": { min: 45, max: 84 },
    "SHAKER": { min: 60, max: 72 },
    "SLIDE_GUITAR": { min: 40, max: 88 },
    "SOPRANO_SAXOPHONE": { min: 57, max: 84 },
    "STEEL_DRUMS": { min: 60, max: 96 },
    "STRINGS": { min: 33, max: 84 },
    "SYNTH_BASS": { min: 21, max: 96 },
    "SYNTH_BRASS": { min: 45, max: 84 },
    "SYNTH_CHOIR": { min: 40, max: 84 },
    "SYNTH_DRUMS": { min: 36, max: 84 },
    "SYNTH_GUITAR": { min: 40, max: 88 },
    "SYNTH_KEYS": { min: 21, max: 96 },
    "SYNTH_LEAD": { min: 40, max: 96 },
    "SYNTH_ORCHESTRA": { min: 21, max: 84 },
    "SYNTH_PAD": { min: 21, max: 96 },
    "SYNTH_PLUCK": { min: 40, max: 96 },
    "TALKING_DRUM": { min: 56, max: 64 },
    "TAMBORA": { min: 36, max: 48 },
    "TAMBOURINE": { min: 60, max: 84 },
    "TENOR_SAXOPHONE": { min: 45, max: 84 },
    "TIMBALES": { min: 60, max: 72 },
    "TIMPANI": { min: 41, max: 88 },
    "TRUMPET": { min: 55, max: 84 },
    "TROMBONE": { min: 39, max: 77 },
    "TUBA": { min: 21, max: 60 },
    "UKULELE": { min: 67, max: 84 },
    "VIOLA": { min: 48, max: 80 },
    "VIOLIN": { min: 55, max: 103 },
    "VOCALS": { min: 40, max: 88 },
    "WHISTLE": { min: 65, max: 84 },
    "WURLITZER_PIANO": { min: 41, max: 88 },
    "XYLOPHONE": { min: 60, max: 96 },
}
export const frequencyBandColors = {
    'positive': {
        'bass': '#FFC300',
        'guitar': '#FFC300',
        'keyboard': '#3D9970',
        'brass': '#3D9970',
        'vocals': '#FF4136',
        'other': '#FF4136'
    },
    'neutral': {
        'bass': '#0074D9',
        'guitar': '#FFDC00',
        'keyboard': '#0074D9',
        'brass': '#FFDC00',
        'vocals': '#0074D9',
        'other': '#FFDC00'
    },
    'angry': { //negative
        'bass': ['#85144b', '#0074D9', '#FFDC00'],
        'guitar': '#85144b',
        'keyboard': '#111111',
        'brass': '#111111',
        'vocals': '#F012BE',
        'other': '#F012BE'
    }
};

export const genres = {
    'ROCK': { min: 80, max: 800 },
    'POP': { min: 400, max: 4000 },
    'ELECTRONIC': { min: 1000, max: 10000 },
    'HIP_HOP': { min: 100, max: 1000 },
    'JAZZ': { min: 200, max: 2000 },
    'BLUES': { min: 60, max: 600 },
    'COUNTRY': { min: 80, max: 800 },
    'CLASSICAL': { min: 40, max: 400 },
    'REGGAE': { min: 80, max: 800 },
    'FOLK': { min: 60, max: 600 },
    'WORLD': { min: 80, max: 800 },
    'LATIN': { min: 100, max: 1000 },
    'RNB': { min: 60, max: 600 },
    'METAL': { min: 80, max: 800 },
    'PUNK': { min: 120, max: 1200 },
    'FUNK': { min: 80, max: 800 },
    'SOUL': { min: 80, max: 800 },
    'DISCO': { min: 120, max: 1200 },
    'GOSPEL': { min: 80, max: 800 },
    'OTHER': { min: 20, max: 200 }
};

export const genreWeights = {
    'rock': 3,
    'pop': 3,
    'electronic': 2,
    'hipHop': 1,
    'classical': 1,
    'jazz': 1,
    'other': 1
};

// Define tempo ranges and corresponding hue values

export const tempos = {
    'LARGHISSIMO': { min: 0, max: 24, hue: 0 },
    'ADAGISSIMO': { min: 24, max: 40, hue: 0 },
    'GRAVE': { min: 24, max: 40, hue: 0 },
    'LARGO': { min: 40, max: 66, hue: 120 },
    'ADAGIO': { min: 44, max: 68, hue: 120 },
    'LARGHETTO': { min: 44, max: 66, hue: 120 },
    'ADAGIETTO': { min: 46, max: 80, hue: 120 },
    'LENTO': { min: 52, max: 108, hue: 240 },
    'ANDANTE': { min: 56, max: 108, hue: 240 },
    'ANDANTINO': { min: 80, max: 108, hue: 240 },
    'MARCIA_MODERATO': { min: 66, max: 80, hue: 240 },
    'ANDANTE_MODERATO': { min: 66, max: 112, hue: 240 },
    'MODERATO': { min: 86, max: 126, hue: 120 },
    'ALLEGRETTO': { min: 76, max: 120, hue: 120 },
    'ALLEGRO_MODERATO': { min: 96, max: 120, hue: 120 },
    'ALLEGRO': { min: 100, max: 156, hue: 120 },
    'MOLTO_ALLEGRO': { min: 124, max: 160, hue: 120 },
    'VIVACE': { min: 136, max: 160, hue: 0 },
    'VIVACISSIMO': { min: 160, max: 184, hue: 0 },
    'ALLEGRISIMO': { min: 160, max: 184, hue: 0 },
    'PRESTO': { min: 168, max: 200, hue: 0 },
    'PRESTISSIMO': { min: 200, max: Infinity, hue: 0 },
    'OTHER': { min: 0, max: Infinity, hue: 0 },
};

// const frequencyBandColors = {
        //     bass: ["#ff0000", "#000000", "#ffffff"],
        //     guitar: ["#ff8800", "#ffff00", "#00ffff"],
        //     drums: ["#ffff00", "#00ff00", "#0000ff"],
        //     vocals: ["#00ff00", "#ff00ff", "#ff0000"],
        //     keyboard: ["#ff8800", "#ffff00", "#00ffff"],
        //     brass: ["#ffff00", "#00ff00", "#0000ff"],
        //     other: ["#ffff00", "#00ff00", "#0000ff"]
        // };

//add to db