import { Injectable } from '@nestjs/common';
import DSP from 'dsp.js';

const { SpeechClient } = require('@google-cloud/speech');
const client = new SpeechClient({
    projectId: 'YOUR_PROJECT_ID',
    credentials: require('./path/to/serviceAccountKey.json')
});
//import { parseStream } from 'music-metadata';

@Injectable()
export class MusicService {
    //delete after
    genreColors = {
        rock: ["#ff0000", "#000000", "#ffffff"], // red, black, white
        pop: ["#ff8800", "#ffff00", "#00ffff"], // orange, yellow, cyan
        electronic: ["#ffff00", "#00ff00", "#0000ff"], // yellow, green, blue
        hipHop: ["#00ff00", "#ff00ff", "#ff0000"], // green, magenta, red
        other: ["#ffff00", "#00ff00", "#0000ff"]
    };

    tempoColors = {
        'slow': "#ff8800",
        'medium': "#00ff00",
        'fast': "#ffff00",
    };

    //decode audio
    async decodeAudioByType(audioBuffer: any) {
        const decode = await import('audio-decode');

        return await decode.default(audioBuffer)
    }


    //getIntervals

    generateIntervalDataByType(audio, type) {

    }

    generateIntervalData(frequencyArray, amplitudeArray, intervalDuration, intervalCount) {
        const intervalData = [];

        for (let i = 0; i < intervalCount; i++) {
            const frequency = frequencyArray[i];
            const amplitude = amplitudeArray[i];
            const intervalStart = i * intervalDuration;
            const intervalEnd = (i + 1) * intervalDuration;
            const intensity = Math.sqrt(amplitude);
            const color = this.getColorFromFrequency(frequency);
            const interval = { start: intervalStart, end: intervalEnd, intensity, color };
            intervalData.push(interval);
        }
        return intervalData;
    }

    generateIntervalDataByGenre(frequencyArray, amplitudeArray, intervalDuration, intervalCount) {
        const intervalData = [];
        let sumAmplitude = 0;

        for (let i = 0; i < intervalCount; i++) {
            const frequency = frequencyArray[i];
            const amplitude = amplitudeArray[i];
            sumAmplitude += amplitude;
            const intervalStart = i * intervalDuration;
            const intervalEnd = (i + 1) * intervalDuration;
            const intensity = Math.sqrt(amplitude);

            // Map frequency to hue value using genreColors object
            const genre = this.getGenreFromFrequency(frequency);//, sumAmplitude / intervalCount);
            const hue = this.genreColors[genre];

            const saturation = 100;
            const lightness = 50;
            const [red, green, blue] = this.hslToRgb(hue, saturation, lightness);
            const color = `rgb(${red}, ${green}, ${blue})`;
            const interval = { start: intervalStart, end: intervalEnd, intensity, color };
            intervalData.push(interval);
        }
        return intervalData;
    }

    generateIntervalDataByTempo(amplitudeArray, intervalDuration, intervalCount, bpm) {
        const intervalData = [];

        for (let i = 0; i < intervalCount; i++) {
            const amplitude = amplitudeArray[i];
            const intervalStart = i * intervalDuration;
            const intervalEnd = (i + 1) * intervalDuration;
            const intensity = Math.sqrt(amplitude);

            // Map tempo to hue value using tempoColors object
            const tempo = this.getTempoFromBpm(bpm);
            const hue = this.tempoColors[tempo];

            const saturation = 100;
            const lightness = 50;
            const [red, green, blue] = this.hslToRgb(hue, saturation, lightness);
            const color = `rgb(${red}, ${green}, ${blue})`;
            const interval = { start: intervalStart, end: intervalEnd, intensity, color };
            intervalData.push(interval);
        }
        return intervalData;
    }

    generateIntervalDataByInstrument(amplitudeArray, intervalDuration, intervalCount, bpm) {
        const intervalData = [];

        for (let i = 0; i < intervalCount; i++) {
            const amplitude = amplitudeArray[i];
            const intervalStart = i * intervalDuration;
            const intervalEnd = (i + 1) * intervalDuration;
            const intensity = Math.sqrt(amplitude);

            // Map tempo to hue value using tempoColors object
            const tempo = this.getTempoFromBpm(bpm);
            const hue = this.tempoColors[tempo];

            const saturation = 100;
            const lightness = 50;
            const [red, green, blue] = this.hslToRgb(hue, saturation, lightness);
            const color = `rgb(${red}, ${green}, ${blue})`;
            const interval = { start: intervalStart, end: intervalEnd, intensity, color };
            intervalData.push(interval);
        }
        return intervalData;
    }

    generateIntervalDataByEnergy(amplitudeArray, intervalDuration, intervalCount, bpm) {
        const intervalData = [];
    }

    generateIntervalDataBySpeech(amplitudeArray, intervalDuration, intervalCount, bpm) {
        const intervalData = [];
    }

    //helpers

    getColorFromFrequency(frequency) {
        const hue = Math.round(frequency) % 360; // map frequency to hue value in the range [0, 360)
        const saturation = 100;
        const lightness = 50;
        const [red, green, blue] = this.hslToRgb(hue, saturation, lightness); // convert HSL to RGB values
        return `rgb(${red}, ${green}, ${blue})`;
    }

    hslToRgb(h, s, l) {
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

    getFrequencyData(fft: any, length: any) {
        const frequencyData = new Float32Array(length / 2);
        for (let i = 0; i < frequencyData.length; i++) {
            const real = fft.real[i];
            const imag = fft.imag[i];
            frequencyData[i] = Math.sqrt(real * real + imag * imag);
        }
        return frequencyData;
    }

    getAmplitudeData(fft: any, audio: any, paddedLength: any) {
        const amplitudeData = new Float32Array(audio.channelData[0].length / 2);
        for (let i = 0; i < amplitudeData.length; i++) {
            const real = fft.real[i];
            const imag = fft.imag[i];
            amplitudeData[i] = Math.sqrt(real * real + imag * imag) / (paddedLength / 2);
        }
        return amplitudeData;
    }

    getFft(audio: any) {
        // pad audio data to a power of 2 length
        const originalLength = audio.length; //audio.channelData[0].length;
        const paddedLength = Math.pow(2, Math.ceil(Math.log2(originalLength)));
        const audioPadded = new Float32Array(paddedLength);
        audioPadded.set(audio._channelData[0]);
        // create FFT object
        const fft = new DSP.FFT(paddedLength, audio.sampleRate);

        // perform FFT on audio data
        fft.forward(audioPadded);
        return fft;
    }

    getDuration(audio: any) {
        return audio.length / audio.sampleRate;
    }

    getPeaks(audio: any) {
        const peaks = [];
        for (let i = 0; i < audio._channelData[0].length; i++) {
            const currentValue = audio._channelData[0][i];
            const prevValue = audio._channelData[0][i - 1];
            const nextValue = audio._channelData[0][i + 1];

            if (currentValue > prevValue && currentValue > nextValue) {
                peaks.push(i);
            }
        }
        return peaks;
    }

    getBpm(peaks: any, audio: any) {
        const timeInterval = 1 / audio.sampleRate
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

        return bpm;
    }

    calculateBPM(audioBuffer) {
        // Get the audio data from the first channel
        const audioData = audioBuffer._channelData[0];

        // Calculate the length of one audio frame
        const frameLength = audioBuffer.sampleRate / 60; // 60 seconds in a minute

        // Create an array to store the beats
        const beats = [];

        // Loop through the audio data, checking for beats
        for (let i = 0; i < audioData.length - frameLength; i += frameLength) {
            // Calculate the average amplitude of this frame
            let sum = 0;
            for (let j = i; j < i + frameLength; j++) {
                sum += Math.abs(audioData[j]);
            }
            const avgAmplitude = sum / frameLength;

            // Check if this frame contains a beat
            if (avgAmplitude > 0.1) {
                beats.push(i);
            }
        }

        // Calculate the time difference between each beat
        const timeDiffs = [];
        for (let i = 1; i < beats.length; i++) {
            timeDiffs.push(beats[i] - beats[i - 1]);
        }

        // Calculate the average time difference and convert to BPM
        const avgTimeDiff = timeDiffs.reduce((a, b) => a + b, 0) / timeDiffs.length;
        const bpm = audioBuffer.sampleRate / avgTimeDiff * 60;

        return bpm;
    }

    getGenreFromFrequency(frequency) {
        // Define frequency ranges for each genre
        const genres = {
            'rock': { min: 50, max: 5000 },
            'classical': { min: 20, max: 2000 },
            'jazz': { min: 40, max: 4000 },
            // add other genres and their frequency ranges here
        };

        let bestMatch = null;
        let bestMatchWidth = Infinity;
        let bestMatchCenter = Infinity;

        // Check if the frequency falls within a range of any genre
        for (let genre in genres) {
            const range = genres[genre];
            if (frequency >= range.min && frequency <= range.max) {
                // Compare the average amplitude of the frequency data for each genre
                // if (averageAmplitude >= 0.8) {
                //     // Check if the frequency is consistently in the range of the genre
                //     const frequencyRange = range.max - range.min;
                //     const frequencyThreshold = frequencyRange * 0.2;
                // const isInRange = frequency >= range.min + frequencyThreshold && frequency <= range.max - frequencyThreshold;
                const rangeWidth = range.max - range.min;
                const rangeCenter = (range.max + range.min) / 2;
                if (rangeWidth < bestMatchWidth) {
                    bestMatch = genre;
                    bestMatchWidth = rangeWidth;
                    bestMatchCenter = rangeCenter;
                } else if (rangeWidth === bestMatchWidth) {
                    const centerDist = Math.abs(bestMatchCenter - frequency);
                    const newCenterDist = Math.abs(rangeCenter - frequency);
                    if (newCenterDist < centerDist) {
                        bestMatch = genre;
                        bestMatchWidth = rangeWidth;
                        bestMatchCenter = rangeCenter;
                    }
                }
            }
        }

        return bestMatch || 'other';
    }
    getTempoFromBpm(bpm) {
        // Define tempo ranges and corresponding hue values
        const tempos = {
            'slow': { min: 0, max: 80, hue: 0 },
            'medium': { min: 80, max: 140, hue: 120 },
            'fast': { min: 140, max: 220, hue: 240 },
        };

        // Loop through tempos object and return matching tempo for given bpm
        for (let tempo in tempos) {
            const range = tempos[tempo];
            if (bpm >= range.min && bpm <= range.max) {
                return tempo;
            }
        }

        // If no tempo is matched, return 'other'
        return 'other';
    }

    async mapInstrument(audioData) {
        const audioContext = new AudioContext();
        const source = audioContext.createBufferSource();
        const buffer = audioContext.createBuffer(1, audioData.length, audioContext.sampleRate);
        buffer.getChannelData(0).set(audioData);
        source.buffer = buffer;
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        source.start();

        // Map to instrumentation
        const frequencies = new Float32Array(analyser.frequencyBinCount);
        analyser.getFloatFrequencyData(frequencies);
        const guitarRange = [80, 1000];
        const pianoRange = [500, 4000];
        const drumsRange = [200, 600];
        const instrumentData = [];
        for (let i = 0; i < frequencies.length; i++) {
            const frequency = i * audioContext.sampleRate / analyser.fftSize;
            const amplitude = Math.abs(frequencies[i]);
            let instrument = 'other';
            if (frequency >= guitarRange[0] && frequency <= guitarRange[1]) {
                instrument = 'guitar';
            } else if (frequency >= pianoRange[0] && frequency <= pianoRange[1]) {
                instrument = 'piano';
            } else if (frequency >= drumsRange[0] && frequency <= drumsRange[1]) {
                instrument = 'drums';
            }
            instrumentData.push({ frequency, amplitude, instrument });
        }
    }



    async mapByEnergy(audioData) {
        const audioContext = new AudioContext();
        const source = audioContext.createBufferSource();
        const buffer = audioContext.createBuffer(1, audioData.length, audioContext.sampleRate);
        buffer.getChannelData(0).set(audioData);
        source.buffer = buffer;
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        source.start();

        // Map to energy level
        const energyData = [];
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(dataArray);
        let totalEnergy = 0;
        for (let i = 0; i < bufferLength; i++) {
            const amplitude = Math.abs(dataArray[i] - 128);
            totalEnergy += amplitude;
        }
        const avgEnergy = totalEnergy / bufferLength;
        const highEnergyThreshold = 128;
        const energyLevel = avgEnergy >= highEnergyThreshold ? 'high' : 'low'; //mid
        energyData.push({ energyLevel });
    }

    async mapAudioDataBy(audioData) {
        const audioContext = new AudioContext();
        const source = audioContext.createBufferSource();
        const buffer = audioContext.createBuffer(1, audioData.length, audioContext.sampleRate);
        buffer.getChannelData(0).set(audioData);
        source.buffer = buffer;
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        source.start();

        const [response] = await client.recognize({
            config: {
                encoding: 'LINEAR16',
                sampleRateHertz: 16000,
                languageCode: 'en-US',
            },
            audio: {
                content: audioData.toString('base64'),
            },
        });
        const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join('\n');
        console.log(`Transcription: ${transcription}`);


        let sentiment = 'neutral';
        if (transcription.includes('love')) {
            sentiment = 'romantic';
        } else if (transcription.includes('heartbreak')) {
            sentiment = 'sad';
        } else if (transcription.includes('politics')) {
            sentiment = 'political';
        }
        const lyricsData = [{ sentiment }];
        console.log(lyricsData);

    }

    //others

    // parseMetadata(someReadStream: ReadStream) {
    //     (async () => {
    //         try {
    //             const metadata = await parseStream(someReadStream, { mimeType: 'audio/mpeg', size: 26838 });
    //             return metadata;
    //         } catch (error) {
    //             return error.message;
    //         }
    //     })();
    // }

    //addShazam maybe others to

    //generateByCoverColors
    //generateByMood

    //test context==true?2 options:1 for now
    //one function to do all,
    //endpoints//above parts
}