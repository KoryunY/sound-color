import { Genre } from "./types";

export const AllowedMimes = ['audio/mp3', 'audio/mpeg', 'audio/wave', 'audio/wav'];
export const AllowedFileAttributes = ['mp3', 'wav'];
export const defaultIntervalCOunt = 256;

export const genreColors = {
    'ROCK': ['#ff0000', '#000000', '#ffffff'], // red, black, white
    'POP': ['#ff8800', '#ffff00', '#00ffff'], // orange, yellow, cyan
    'ELECTRONIC': ['#ffff00', '#00ff00', '#0000ff'], // yellow, green, blue
    'HIP_HOP': ['#00ff00', '#ff00ff', '#ff0000'], // green, magenta, red
    'JAZZ': ['#6600cc', '#006600', '#ffff00'], // purple, green, yellow
    'BLUES': ['#0000ff', '#ff8800', '#ffffff'], // blue, orange, white
    'COUNTRY': ['#ff8800', '#ffff00', '#ffffff'], // orange, yellow, white
    'CLASSICAL': ['#ff8800', '#ffff00', '#00ffff'], // orange, yellow, cyan
    'REGGAE': ['#ff8800', '#000000', '#ffffff'], // orange, black, white
    'FOLK': ['#ff8800', '#6600cc', '#ffffff'], // orange, purple, white
    'WORLD': ['#ff8800', '#6600cc', '#ffffff'], // orange, purple, white
    'LATIN': ['#ff8800', '#ffff00', '#ffffff'], // orange, yellow, white
    'RNB': ['#ff8800', '#6600cc', '#ffffff'], // orange, purple, white
    'METAL': ['#ff0000', '#000000', '#ffffff'], // red, black, white
    'PUNK': ['#ff0000', '#000000', '#ffffff'], // red, black, white
    'FUNK': ['#ff8800', '#ffff00', '#ffffff'], // orange, yellow, white
    'SOUL': ['#ff8800', '#ffff00', '#ffffff'], // orange, yellow, white
    'DISCO': ['#ff8800', '#ffff00', '#ffffff'], // orange, yellow, white
    'GOSPEL': ['#ff8800', '#6600cc', '#ffffff'], // orange, purple, white
    'OTHER': ['#ffff00', '#00ff00', '#0000ff'] // yellow, green, blue
};

export const tempoColors = {
    'LARGHISSIMO': ['#ff0000', '#000000', '#ffffff'], // red, black, white
    'ADAGISSIMO': ['#ff5050', '#000000', '#ffffff'], // red-orange, black, white
    'GRAVE': ['#ff5050', '#000000', '#ffffff'], // red-orange, black, white
    'LARGO': ['#ff9933', '#000000', '#ffffff'], // orange, black, white
    'ADAGIO': ['#ffcc66', '#000000', '#000000'], // light orange, black
    'LARGHETTO': ['#ffcc66', '#000000', '#000000'], // light orange, black
    'ADAGIETTO': ['#ffe0b3', '#000000', '#000000'], // lightest orange, black
    'LENTO': ['#ccffcc', '#000000', '#000000'], // light green, black
    'ANDANTE': ['#66ff66', '#000000', '#000000'], // green, black
    'ANDANTINO': ['#66ff66', '#000000', '#000000'], // green, black
    'MARCIA_MODERATO': ['#00cc99', '#ffffff', '#ffffff'], // teal, white
    'ANDANTE_MODERATO': ['#00cc99', '#ffffff', '#ffffff'], // teal, white
    'MODERATO': ['#0099cc', '#ffffff', '#ffff00'], // blue, white
    'ALLEGRETTO': ['#6666ff', '#ffffff', '#ffffff'], // dark blue, white
    'ALLEGRO_MODERATO': ['#6666ff', '#ffffff', '#ffffff'], // dark blue, white
    'ALLEGRO': ['#3333ff', '#ffffff', '#ffffff'], // indigo, white
    'MOLTO_ALLEGRO': ['#0000ff', '#ffffff', '#ffffff'], // blue, white
    'VIVACE': ['#ff00ff', '#ffffff', '#ffffff'], // magenta, white
    'VIVACISSIMO': ['#ff33cc', '#ffffff', '#ffffff'], // pink, white
    'ALLEGRISIMO': ['#ff33cc', '#ffffff', '#ffffff'], // pink, white
    'PRESTO': ['#ff0066', '#ffffff', '#ffffff'], // red, white
    'PRESTISSIMO': ['#ff0000', '#ff5050', '#ffffff'], // red, white
    'OTHER': ['#000000', '#ffffff', '#ffffff'], // black, white
};

export const energyColors = {
    high: ['#ff0000', 'ff33cc', '3333ff'],// red
    mid: ['#ffff00', '#ff5050', '#ffffff'],// yellow
    low: ['#00ff00', '#000000', '#ffffff']  // green
};

export const instrumentColors = {
    ACOUSTIC_BASS: ["#ff0000", "#000000", "#ffffff"], // red, black, white
    ACOUSTIC_GUITAR: ["#008000", "#ffffff", "#000000"], // green, white, black
    ALTO_SAXOPHONE: ["#ffa500", "#000000", "#ffffff"], // orange, black, white
    BACKING_VOCALS: ["#808080", "#ffffff", "#000000"], // gray, white, black
    BANJO: ["#8b4513", "#ffffff", "#000000"], // saddlebrown, white, black
    BARITONE_SAXOPHONE: ["#8b008b", "#ffffff", "#000000"], // darkmagenta, white, black
    BASS: ["#0000ff", "#ffffff", "#000000"], // blue, white, black
    BASS_CLARINET: ["#000080", "#ffffff", "#000000"], // navy, white, black
    BASS_GUITAR: ["#8b0000", "#ffffff", "#000000"], // darkred, white, black
    BASS_SYNTH: ["#9932cc", "#ffffff", "#000000"], // darkorchid, white, black
    CELLO: ["#800000", "#ffffff", "#000000"], // maroon, white, black
    CHURCH_ORGAN: ["#ff69b4", "#000000", "#ffffff"], // hotpink, black, white
    CLARINET: ["#1e90ff", "#ffffff", "#000000"], // dodgerblue, white, black
    CLASSICAL_GUITAR: ["#ffe4c4", "#000000", "#ffffff"], // bisque, black, white
    CONTRABASS: ["#8b0000", "#ffffff", "#000000"], // darkred, white, black
    COWBELL: ["#d3d3d3", "#000000", "#ffffff"], // lightgray, black, white
    DRUMS: ["#808080", "#ffffff", "#000000"], // gray, white, black
    ELECTRIC_BASS: ["#0000ff", "#ffffff", "#000000"], // blue, white, black
    ELECTRIC_GUITAR: ["#ff8c00", "#ffffff", "#000000"], // darkorange, white, black
    ELECTRIC_PIANO: ["#ff1493", "#000000", "#ffffff"], // deeppink, black, white
    FLUTE: ["#00ff7f", "#000000", "#ffffff"], // springgreen, black, white
    FRENCH_HORN: ["#daa520", "#000000", "#ffffff"], // goldenrod, black, white
    GRAND_PIANO: ["#000000", "#ffffff", "#000000"], // black, white, black
    HAMMOND_ORGAN: ["#7cfc00", "#000000", "#ffffff"], // lawngreen, black, white
    HARP: ["#ff69b4", "#000000", "#ffffff"], // hotpink, black, white
    HARPSICHORD: ["#ffd700", "#000000", "#ffffff"], // gold, black, white
    HORN_SECTION: ["#4b0082", "#ffffff", "#000000"], // indigo, white, black
    KEYBOARD: ["#ffff00", "#000000", "#ffffff"], // yellow, black, white
    LEAD_GUITAR: ["#ff6600", "#000000", "#ffffff"], // orange, black, white
    LEAD_SYNTH: ["#800080", "#000000", "#ffffff"], // purple, black, white
    MARACAS: ["#ff9900", "#000000", "#ffffff"], // orange, black, white
    MARIMBA: ["#00ff00", "#000000", "#ffffff"], // green, black, white
    MIXING_DESK: ["#808080", "#000000", "#ffffff"], // gray, black, white
    OBOE: ["#ffff99", "#000000", "#ffffff"], // light yellow, black, white
    ORCHESTRA_HIT: ["#800000", "#000000", "#ffffff"], // maroon, black, white
    ORGAN: ["#800080", "#000000", "#ffffff"], // purple, black, white
    OTHER: ["#c0c0c0", "#000000", "#ffffff"], // silver, black, white
    OUD: ["#ffff99", "#000000", "#ffffff"], // light yellow, black, white
    OVERDRIVEN_GUITAR: ["#ff6600", "#000000", "#ffffff"], // orange, black, white
    PAD_SYNTH: ["#ff00ff", "#000000", "#ffffff"], // magenta, black, white
    PERCUSSION: ["#808080", "#000000", "#ffffff"], // gray, black, white
    PIANO: ["#ffff00", "#000000", "#ffffff"], // yellow, black, white
    RHYTHM_GUITAR: ["#ff6600", "#000000", "#ffffff"], // orange, black, white
    SAXOPHONE: ["#ff9999", "#000000", "#ffffff"], // pink, black, white
    SHAKER: ["#ff9900", "#000000", "#ffffff"], // orange, black, white
    SLIDE_GUITAR: ["#ff6600", "#000000", "#ffffff"], // orange, black, white
    SOPRANO_SAXOPHONE: ["#ff9999", "#000000", "#ffffff"], // pink, black, white
    STEEL_DRUMS: ["#00ff00", "#000000", "#ffffff"], // green, black, white
    STRINGS: ["#00ff00", "#000000", "#ffffff"], // green, black, white
    SYNTH_BASS: ["#ff00ff", "#000000", "#ffffff"], // magenta, black, white
    SYNTH_BRASS: ["#ff00ff", "#000000", "#ffffff"], // magenta, black, white
    SYNTH_CHOIR: ["#ff00ff", "#000000", "#ffffff"], // magenta, black, white
    SYNTH_DRUMS: ["#ff00ff", "#000000", "#ffffff"], // magenta, black, white
    SYNTH_GUITAR: ["#ff00ff", "#000000", "#ffffff"], // magenta, black, white
    SYNTH_KEYS: ["#ff00ff", "#000000", "#ffffff"], // magenta, black, white
    SYNTH_LEAD: ["#ff00ff", "#000000", "#ffffff"], // magenta, black, white
    SYNTH_ORCHESTRA: ["#336699", "#ffffff", "#000000"], // blue, white, black
    SYNTH_PAD: ["#99ccff", "#003366", "#ffffff"], // light blue, dark blue, white
    SYNTH_PLUCK: ["#ff9933", "#000000", "#ffffff"], // orange, black, white
    TALKING_DRUM: ["#996633", "#ffffff", "#000000"], // brown, white, black
    TAMBORA: ["#663300", "#ffffff", "#000000"], // dark brown, white, black
    TAMBOURINE: ["#cc33ff", "#ffffff", "#000000"], // purple, white, black
    TENOR_SAXOPHONE: ["#cc0000", "#ffffff", "#000000"], // red, white, black
    TIMBALES: ["#99ff33", "#000000", "#ffffff"], // lime green, black, white
    TIMPANI: ["#666666", "#ffffff", "#cc9900"], // gray, white, gold
    TRUMPET: ["#ffcc00", "#000000", "#ffffff"], // yellow, black, white
    TROMBONE: ["#ff99cc", "#000000", "#ffffff"], // pink, black, white
    TUBA: ["#0000cc", "#ffffff", "#ffcc00"], // blue, white, gold
    UKULELE: ["#ffcc99", "#000000", "#ffffff"], // peach, black, white
    VIOLA: ["#9966cc", "#ffffff", "#000000"], // purple, white, black
    VIOLIN: ["#ff0066", "#000000", "#ffffff"], // magenta, black, white
    VOCALS: ["#660000", "#ffffff", "#ccff99"], // maroon, white, light green
    WHISTLE: ["#ff6600", "#000000", "#ffffff"], // orange, black, white
    WURLITZER_PIANO: ["#cccccc", "#000000", "#ffffff"], // light gray, black, white
    XYLOPHONE: ["#33cc33", "#ffffff", "#000000"] // green, white, black
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
    LOVE: ["#FF1493", "#FF69B4", "#FFC0CB"], // deep pink, hot pink, pink
    JOY: ["#FFFF00", "#FFD700", "#F0E68C"], // yellow, gold, khaki
    ANGER: ["#FF0000", "#FF6347", "#8B0000"], // red, tomato, dark red
    SADNESS: ["#00BFFF", "#1E90FF", "#ADD8E6"], // deep sky blue, dodger blue, light blue
    FEAR: ["#708090", "#2F4F4F", "#778899"], // slate gray, dark slate gray, light slate gray
    SURPRISE: ["#FFA07A", "#FA8072", "#FF7F50"], // light salmon, salmon, coral
    TRUST: ["#00FF7F", "#00FA9A", "#98FB98"], // spring green, medium spring green, pale green
    DISGUST: ["#800080", "#BA55D3", "#DA70D6"], // purple, medium orchid, orchid
    NEUTRAL: ["#808080", "#A9A9A9", "#D3D3D3"] // gray, dark gray, light gray
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
    'angry': {
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
    [Genre.ROCK]: 3,
    [Genre.POP]: 3,
    [Genre.ELECTRONIC]: 2,
    [Genre.HIP_HOP]: 1,
    [Genre.CLASSICAL]: 1,
    [Genre.JAZZ]: 1,
    [Genre.BLUES]: 1,
    [Genre.COUNTRY]: 1,
    [Genre.REGGAE]: 1,
    [Genre.FOLK]: 1,
    [Genre.WORLD]: 1,
    [Genre.LATIN]: 1,
    [Genre.RNB]: 1,
    [Genre.METAL]: 1,
    [Genre.PUNK]: 1,
    [Genre.FUNK]: 1,
    [Genre.SOUL]: 1,
    [Genre.DISCO]: 1,
    [Genre.GOSPEL]: 1,
    [Genre.OTHER]: 1
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