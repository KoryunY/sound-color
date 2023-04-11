export const AllowedMimes = ['audio/mp3', 'audio/mpeg'];

export const genreColors = {
    rock: ["#ff0000", "#000000", "#ffffff"], // red, black, white
    pop: ["#ff8800", "#ffff00", "#00ffff"], // orange, yellow, cyan
    electronic: ["#ffff00", "#00ff00", "#0000ff"], // yellow, green, blue
    hipHop: ["#00ff00", "#ff00ff", "#ff0000"], // green, magenta, red
    classical: ["#ff8800", "#ffff00", "#00ffff"],
    other: ["#ffff00", "#00ff00", "#0000ff"],
    jazz: ["#ffff00", "#00ff00", "#0000ff"]
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
    'love': 'romantic',
    'heartbreak': 'sad',
    'politics': 'political',
    'chaos': 'angry'
    // Add more sentiment words and their corresponding sentiment here
};

export const sentimentsColors = {
    romantic: ["#FF1493", "#FF69B4", "#FFC0CB"], // deep pink, hot pink, pink
    sad: ["#6495ED", "#1E90FF", "#4169E1"], // cornflower blue, dodger blue, royal blue
    political: ["#FF8C00", "#FFA500", "#FFD700"], // dark orange, orange, gold
    angry: ["#B22222", "#DC143C", "#FF0000"], // firebrick, crimson, red
    neutral: ["#808080", "#A9A9A9", "#D3D3D3"] // gray, dark gray, light gray
};

export const instrumentPitchRanges = {
    "bass": { min: 21, max: 48 },
    "guitar": { min: 40, max: 88 },
    "drums": { min: 36, max: 84 },
    "keyboard": { min: 21, max: 96 },
    "vocals": { min: 40, max: 88 },
    "brass": { min: 45, max: 84 },
    "strings": { min: 33, max: 84 },
    "woodwinds": { min: 36, max: 84 },
    "synth": { min: 21, max: 96 },
};

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
    'rock': { min: 80, max: 800 },
    'pop': { min: 400, max: 4000 },
    'electronic': { min: 1000, max: 10000 },
    'hipHop': { min: 100, max: 1000 },
    'classical': { min: 40, max: 400 },
    'jazz': { min: 200, max: 2000 },
    'other': { min: 20, max: 200 }
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