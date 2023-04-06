const fs = require('fs');
const wav = require('node-wav');
const DSP = require('dsp.js');
const axios = require('axios');

// read audio file
const audioData = fs.readFileSync('C:\\Users\\Koryu\\Downloads\\file_example_WAV_1MG.wav');

// parse audio data
const audio = wav.decode(audioData);
const sampleRate = audio.sampleRate;

// pad audio data to a power of 2 length
const originalLength = audio.channelData[0].length;
const paddedLength = Math.pow(2, Math.ceil(Math.log2(originalLength)));
const audioPadded = new Float32Array(paddedLength);
audioPadded.set(audio.channelData[0]);
// create FFT object
const fft = new DSP.FFT(paddedLength, audio.sampleRate);

// perform FFT on audio data
fft.forward(audioPadded);

// get frequency data
const frequencyData = new Float32Array(audio.channelData[0].length / 2);
for (let i = 0; i < frequencyData.length; i++) {
    const real = fft.real[i];
    const imag = fft.imag[i];
    frequencyData[i] = Math.sqrt(real * real + imag * imag);
}

//console.log(frequencyData); // array of frequency data

// get amplitude data
const amplitudeData = new Float32Array(audio.channelData[0].length / 2);
for (let i = 0; i < amplitudeData.length; i++) {
    const real = fft.real[i];
    const imag = fft.imag[i];
    amplitudeData[i] = Math.sqrt(real * real + imag * imag) / (paddedLength / 2);
}

//console.log(amplitudeData); // array of amplitude data

// calculate pitch data using autocorrelation method
// const correlation = new Float32Array(paddedLength);
// const pitchData = new Float32Array(audio.channelData[0].length / 2);
// for (let i = 0; i < correlation.length; i++) {
//     let sum = 0;
//     for (let j = 0; j < paddedLength - i; j++) {
//         sum += audioPadded[j] * audioPadded[j + i];
//     }
//     correlation[i] = sum;
// }
// for (let i = 0; i < pitchData.length; i++) {
//     let maxIndex = 0;
//     let maxValue = 0;
//     let startIndex = i * 10;
//     let endIndex = i * 10 + 10;
//     if (endIndex > correlation.length) {
//         endIndex = correlation.length;
//     }
//     for (let j = startIndex; j < endIndex; j++) {
//         if (correlation[j] > maxValue) {
//             maxIndex = j;
//             maxValue = correlation[j];
//         }
//     }
//     pitchData[i] = audio.sampleRate / maxIndex;
// }

// console.log(pitchData); // array of pitch data

//
const duration = audio.channelData[0].length / sampleRate;
//console.log('Duration:', duration, 'seconds');
// calculate the time interval between each sample
const timeInterval = 1 / audio.sampleRate;

// find the peaks in the time data
const peaks = [];
for (let i = 0; i < audio.channelData[0].length; i++) {
    const currentValue = audio.channelData[0][i];
    const prevValue = audio.channelData[0][i - 1];
    const nextValue = audio.channelData[0][i + 1];

    if (currentValue > prevValue && currentValue > nextValue) {
        peaks.push(i);
    }
}

// calculate the time interval between each peak
const intervals = [];
for (let i = 0; i < peaks.length - 1; i++) {
    const interval = (peaks[i + 1] - peaks[i]) * timeInterval;
    intervals.push(interval);
}
// calculate the average time interval between the peaks
const avgInterval = intervals.reduce((acc, curr) => acc + curr, 0) / intervals.length;

// calculate the BPM
const bpm = 60 / avgInterval;
//console.log('BPM:', bpm);

const mm = import('music-metadata');

mm.then(mm => mm.parseFile("C:\\Users\\Koryu\\Downloads\\Telegram Desktop\\Physical Level - Droplex.m4a").then(metadata => {
    // console.log(metadata.common.title); // Title
    // console.log(metadata.common.artist); // Artist
    // console.log(metadata.common.album); // Album
    //  console.log(metadata.common.year); // Year
    //  console.log(metadata.format.duration); // Duration in seconds
}).catch(error => {
    console.error(error.message);
}));


const { spawn } = require('child_process');

const inputFile = 'C:\\Users\\Koryu\\Downloads\\Nothing But Thieves - Itch [TubeRipper (mp3cut.net).m4a'; // replace with your input audio file path
const outputFile = 'output.raw'; // temporary output file path

// Convert input audio file to raw PCM format using ffmpeg
const ffmpeg = spawn('ffmpeg', [
    '-i', inputFile,
    '-vn', '-acodec', 'pcm_s16le',
    '-ar', '44100', '-ac', '1',
    '-f', 's16le', outputFile
]);

ffmpeg.stderr.on('data', (data) => {
    //console.error(`ffmpeg error: ${data}`);
});

ffmpeg.on('close', (code) => {
    if (code !== 0) {
        //console.error(`ffmpeg process exited with code ${code}`);
        return;
    }

    // Read raw PCM data from temporary file
    const rawData = fs.readFileSync(outputFile);

    // Truncate raw PCM data to 3-5 seconds (44100 samples per second)
    const sampleSize = 2; // 16-bit signed PCM (2 bytes per sample)
    const maxDuration = 5; // in seconds
    const maxSamples = 44100 * maxDuration;
    const truncatedData = rawData.slice(0, maxSamples * sampleSize);

    // Convert raw PCM data to base64 string
    const base64Data = truncatedData.toString('base64');

    // Check if base64 string is less than 500KB in size
    const sizeInBytes = Buffer.byteLength(base64Data, 'base64');
    const sizeInKB = sizeInBytes / 1000;
    //console.log(`Base64 string size: ${sizeInKB} KB`);
    //console.log(base64Data);

    // Delete temporary output file
    fs.unlinkSync(outputFile);

    // Your Shazam API credentials
    const API_KEY = '5f8d6921d7msh800b18be09dd89ap1b7a42jsn1adb7f318889';
    const API_SECRET = 'YOUR_API_SECRET';

    // Audio file to recognize
    //const audioFilePath = 'C:\\Users\\Koryu\\Downloads\\Nothing But Thieves - Itch [TubeRipper (mp3cut.net) (1).m4a';
    //const audioFile = fs.readFileSync(audioFilePath);
    //const base64Audio = Buffer.from(audioFile).toString("base64");
    // Set up the request data
    //const formData = new FormData();
    //formData.append('audio', audioData);
    const config = {
        headers: {
            'Content-Type': `text/plain`,
            'x-rapidapi-key': API_KEY,
            'x-rapidapi-host': 'shazam.p.rapidapi.com',
        },
        method: 'post',
        url: 'https://shazam.p.rapidapi.com/songs/detect',
        data: base64Data
    };


    // Send the request to the Shazam API
    axios(config)
        .then((response) => {
            //const song = response.data.matches[0].track;
            //  console.log(response.data);
            // console.log(`Song Title: ${song}`);
        })
        .catch((error) => {
            //    console.log(error);
        });
});

const colorPalette = ['#FF5733', '#FFC300', '#DAF7A6', '#C70039', '#900C3F'];
const intervalData = [
    { start: 0, end: 1, value: 0.2 },
    { start: 1, end: 2, value: 0.6 },
    { start: 2, end: 3, value: 0.8 },
    { start: 3, end: 4, value: 0.4 },
    { start: 4, end: 5, value: 0.1 },
];
function mapIntervalColors(colorPalette, intervalData) {
    const newIntervalData = [];
    intervalData.forEach(element => {
        newObj = { ...element };
        newObj.color = colorPalette[Math.floor(Math.random() * 5)]
        newIntervalData.push(newObj);
    });
    return newIntervalData;
}

//console.log(mapIntervalColors(colorPalette, intervalData));

//test this shit
function generateIntervalData(bpm, frequencyArray, amplitudeArray, intervalCount) {
    const intervalDuration = 60 / bpm / intervalCount;
    const intervalData = [];

    for (let i = 0; i < frequencyArray.length; i++) {
        const frequency = frequencyArray[i];
        const amplitude = amplitudeArray[i];
        const intervalStart = i * intervalDuration;
        const intervalEnd = (i + 1) * intervalDuration;
        const intensity = Math.sqrt(amplitude);
        const color = getColorFromFrequency(frequency);
        const interval = { start: intervalStart, end: intervalEnd, intensity, color };
        intervalData.push(interval);
    }

    return intervalData;
}

function getColorFromFrequency(frequency) {
    const hue = Math.round(frequency) % 360; // map frequency to hue value in the range [0, 360)
    const saturation = 100;
    const lightness = 50;
    const [red, green, blue] = hslToRgb(hue, saturation, lightness); // convert HSL to RGB values
    return `rgb(${red}, ${green}, ${blue})`;
}

function hslToRgb(h, s, l) {
    // Convert HSL color values to RGB color values
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;
    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function calculateColor(intensity) {
    // Add your custom color calculation logic here
    // This example just maps intensity to a grayscale color
    const grayscale = Math.floor((intensity + 1) * 128);
    return `rgb(${grayscale}, ${grayscale}, ${grayscale})`;
}

// Example usage
// const BPM = 120;
// const frequency = 440; // A4 note frequency
// const amplitude = 0.5;
const intervalCount = 8;
const intervalDataa = generateIntervalData(bpm, frequencyData, amplitudeData, intervalCount);
const data = JSON.stringify(intervalDataa);
// fs.writeFile('data.json', data, (err) => {
//     if (err) throw err;
//     console.log('Data written to file');
// });
const http = require('http');
const server = http.createServer((req, res) => {
    // Serve the index.html file
    if (req.url === '/') {
        fs.readFile('index.html', 'utf-8', (err, content) => {
            if (err) {
                console.error(err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                // Inject the data into the HTML template
                //             content = content.replace(
                //                 `<script id="data">
                // const data = '';`,
                //                 `<script id="data">const data = ${data};`);
                content = content.replace('<script id="data">', `<script id="data">\n        const data = ${data};`);

                res.end(content);
            }
        });
    }
});

// Listen on port 3000
server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
//console.log(intervalDataa);