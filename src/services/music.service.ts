import { Injectable } from '@nestjs/common';
import DSP from 'dsp.js';

// const { SpeechClient } = require('@google-cloud/speech');
// const client = new SpeechClient({
//     projectId: 'YOUR_PROJECT_ID',
//     credentials: require('./path/to/serviceAccountKey.json')
// });
//import { parseStream } from 'music-metadata';

@Injectable()
export class MusicService {
    //delete after and store other place
    genreColors = {
        rock: ["#ff0000", "#000000", "#ffffff"], // red, black, white
        pop: ["#ff8800", "#ffff00", "#00ffff"], // orange, yellow, cyan
        electronic: ["#ffff00", "#00ff00", "#0000ff"], // yellow, green, blue
        hipHop: ["#00ff00", "#ff00ff", "#ff0000"], // green, magenta, red
        classical: ["#ff8800", "#ffff00", "#00ffff"],
        other: ["#ffff00", "#00ff00", "#0000ff"],
        jazz: ["#ffff00", "#00ff00", "#0000ff"]
    };

    tempoColors = {
        'slow': ["#00ff00", "#ff00ff", "#ff0000"],
        'medium': ["#ff8800", "#ffff00", "#00ffff"],
        'fast': ["#ff8800", "#ffff00", "#00ffff"],
        'other': ["#ff0000", "#000000", "#ffffff"]
    };

    //optimize all functions

    //decode audio
    async decodeAudio(audioBuffer: any) {
        const decode = await import('audio-decode');

        return await decode.default(audioBuffer)
    }


    //getIntervals
    generateIntervalData(decodedAudio: any, intervalCount?: number) { //xary count logic
        let fft = this.getFft(decodedAudio);
        let duration = this.getDuration(decodedAudio);
        let frequency = this.getFrequencyData(fft, decodedAudio._channelData[0].length, intervalCount);
        let bpm = this.calculateBPM(decodedAudio, intervalCount);
        const originalLength = decodedAudio._channelData[0].length;
        const paddedLength = Math.pow(2, Math.ceil(Math.log2(originalLength)));
        const intervalAudioLength = Math.floor(originalLength / intervalCount);

        let amplitude = this.getAmplitudeData(fft, decodedAudio._channelData[0].length / 2, paddedLength, intervalCount, intervalAudioLength);

        let intervalDuration = duration / intervalCount;

        return [fft, frequency, amplitude, bpm, duration, intervalDuration, originalLength, paddedLength];
    }

    generateBySynesthesia(frequencyArray, amplitudeArray, duration = null, intervalDuration = null, intervalCount = null) {
        let length;

        // check for valid inputs
        if (intervalDuration && intervalCount) {
            length = intervalCount;
        } else if (frequencyArray && amplitudeArray) {
            length = Math.min(frequencyArray.length, amplitudeArray.length);
        } else if (frequencyArray) {
            length = frequencyArray.length;
        } else if (amplitudeArray) {
            length = amplitudeArray.length;
        } else {
            throw new Error("Invalid input parameters");
        }

        const intervalData = [];

        // calculate interval duration if not provided
        if (!intervalDuration && duration) {
            intervalDuration = (length > 0) ? (duration / length) : 0;
        }

        for (let i = 0; i < length; i++) {
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

    generateByGenre(frequencyArray, amplitudeArray, duration = null, intervalDuration = null, intervalCount = null) {
        let length;

        // check for valid inputs
        if (intervalDuration && intervalCount) {
            length = intervalCount;
        } else if (frequencyArray && amplitudeArray) {
            length = Math.min(frequencyArray.length, amplitudeArray.length);
        } else if (frequencyArray) {
            length = frequencyArray.length;
        } else if (amplitudeArray) {
            length = amplitudeArray.length;
        } else {
            throw new Error("Invalid input parameters");
        }

        const intervalData = [];
        let sumAmplitude = 0;

        // calculate interval duration if not provided
        if (!intervalDuration && duration) {
            intervalDuration = (length > 0) ? (duration / length) : 0;
        } else if (!duration && intervalDuration && length) {
            duration = intervalDuration * length;
        } else {
            throw new Error("Invalid input parameters");
        }

        for (let i = 0; i < length; i++) {
            const frequency = frequencyArray[i];
            const amplitude = amplitudeArray[i];
            sumAmplitude += amplitude;
            const intervalStart = i * intervalDuration;
            const intervalEnd = (i + 1) * intervalDuration;
            const intensity = Math.sqrt(amplitude);

            // Map frequency to hue value using genreColors object
            const genre = this.getGenreFromFrequency(frequency);//, sumAmplitude / intervalCount);
            console.log(genre);
            const colors = this.genreColors[genre];
            const colorIndex = Math.floor(Math.random() * colors.length);
            const [red, green, blue] = this.hexToRgb(colors[colorIndex])
            const color = `rgb(${red}, ${green}, ${blue})`;

            const interval = { start: intervalStart, end: intervalEnd, intensity, color };
            intervalData.push(interval);
        }
        return intervalData;
    }

    generateByTempo(frequency, amplitudeArray, intervalDuration, intervalCount, bpm) {
        const intervalData = [];
        const tempo = this.getTempoFromBpm(bpm);
        console.log(tempo)
        const colorr = this.tempoColors[tempo];
        console.log(colorr)
        for (let i = 0; i < intervalCount; i++) {
            const amplitude = amplitudeArray[i];
            const intervalStart = i * intervalDuration;
            const intervalEnd = (i + 1) * intervalDuration;
            const intensity = Math.sqrt(amplitude);
            const colorrr = this.getMatchingColor(bpm, frequency[i], colorr)
            // Map tempo to hue value using tempoColors object
            // const colorIndex = Math.floor(Math.random() * colors.length);
            const [red, green, blue] = this.hexToRgb(colorrr)//colors[colorIndex])

            const color = `rgb(${red}, ${green}, ${blue})`;
            const interval = { start: intervalStart, end: intervalEnd, intensity, color };
            intervalData.push(interval);
        }
        return intervalData;
    }

    getMatchingColor(bpm, frequency, colors) {
        let bestColor = '';
        let bestMatchScore = Number.MAX_VALUE;

        for (let i = 0; i < colors.length; i++) {
            const color = colors[i];
            const [r, g, b] = this.hexToRgb(color);
            const matchScore = this.calculateMatchScore(bpm, frequency, r, g, b);
            console.log(matchScore)
            if (matchScore < bestMatchScore) {
                bestMatchScore = matchScore;
                bestColor = color;
            }
        }

        return bestColor;
    }

    calculateMatchScore(bpm, frequency, r, g, b) {
        // Calculate the difference between the given BPM and frequency and the color components
        const bpmDiff = Math.abs(bpm - r);
        const frequencyDiff = Math.abs(frequency - g);

        // Calculate a weighted score based on the differences
        const matchScore = Math.sqrt((bpmDiff * bpmDiff) + (frequencyDiff * frequencyDiff)) + b;

        return matchScore;
    }

    generateByInstrument(amplitudeArray, intervalDuration, intervalCount, bpm) {
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

    generateByEnergy(amplitudeArray, intervalDuration, intervalCount, bpm) {
        const intervalData = [];
    }

    generateBySpeech(amplitudeArray, intervalDuration, intervalCount, bpm) {
        const intervalData = [];
    }

    //helpers

    getColorFromFrequency(frequency) {
        //let shiftedFrequency = frequency;
        // if (shiftedFrequency < 20) {
        //     shiftedFrequency = 20;
        // }
        //shiftedFrequency -= 20;
        const hue = Math.round(frequency) % 360;
        const saturation = Math.max(30, Math.min(70, frequency * 2.5));
        const lightness = Math.max(10, Math.min(90, frequency * 1.5));
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


    getFrequencyData(fft: any, length: any, intervalCount = null) {
        const frequencyData = new Float32Array(length / 2);

        for (let i = 0; i < frequencyData.length; i++) {
            const real = fft.real[i];
            const imag = fft.imag[i];
            frequencyData[i] = Math.sqrt(real * real + imag * imag);
        }

        if (intervalCount !== null) {
            const intervalSize = Math.floor(frequencyData.length / intervalCount);
            const intervalFrequencyData = new Array(intervalCount).fill(0);
            const intervalDataCount = new Array(intervalCount).fill(0);

            for (let i = 0; i < frequencyData.length; i++) {
                const intervalIndex = Math.floor(i / intervalSize);
                intervalFrequencyData[intervalIndex] += frequencyData[i];
                intervalDataCount[intervalIndex]++;
            }

            for (let i = 0; i < intervalCount; i++) {
                intervalFrequencyData[i] /= intervalDataCount[i];
            }

            return intervalFrequencyData;
        }

        return frequencyData;
    }

    getAmplitudeData(fft, length, paddedLength, intervalCount = null, intervalAudioLength = null) {
        const amplitudeData = new Float32Array(length);
        for (let i = 0; i < amplitudeData.length; i++) {
            const real = fft.real[i];
            const imag = fft.imag[i];
            amplitudeData[i] = Math.sqrt(real * real + imag * imag) / (paddedLength / 2);
        }

        if (intervalCount !== null && intervalAudioLength !== null) {
            const intervalSize = Math.ceil(length / intervalCount);
            const intervalAmplitudeData = new Array(intervalCount).fill(0);
            const intervalDataCount = new Array(intervalCount).fill(0);

            for (let i = 0; i < amplitudeData.length; i++) {
                const intervalIndex = Math.floor(i / intervalSize);
                intervalAmplitudeData[intervalIndex] += amplitudeData[i];
                intervalDataCount[intervalIndex]++;
            }

            for (let i = 0; i < intervalCount; i++) {
                intervalAmplitudeData[i] /= intervalDataCount[i];
            }

            return intervalAmplitudeData;
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
    getGenreFromFrequency(frequency) {
        // Define frequency ranges for each genre
        const genres = {
            'rock': { min: 80, max: 800 },
            'pop': { min: 400, max: 4000 },
            'electronic': { min: 1000, max: 10000 },
            'hipHop': { min: 100, max: 1000 },
            'classical': { min: 40, max: 400 },
            'jazz': { min: 200, max: 2000 },
            'other': { min: 20, max: 200 }
        };

        let bestMatch = null;
        let bestMatchDistance = Infinity;
        let totalWeight = 0;
        let genreWeights = {
            'rock': 3,
            'pop': 3,
            'electronic': 2,
            'hipHop': 1,
            'classical': 1,
            'jazz': 1,
            'other': 1
        };

        // Check if the frequency falls within a range of any genre
        for (let genre in genres) {
            const range = genres[genre];
            if (frequency >= range.min && frequency <= range.max) {
                const rangeCenter = (range.max + range.min) / 2;
                const distance = Math.sqrt(Math.pow(rangeCenter - frequency, 2));
                const weightedDistance = distance / genreWeights[genre];
                if (weightedDistance < bestMatchDistance) {
                    bestMatch = genre;
                    bestMatchDistance = weightedDistance;
                }
                totalWeight += genreWeights[genre];
            }
        }

        // Normalize the genre weights so that they add up to 1
        for (let genre in genreWeights) {
            genreWeights[genre] /= totalWeight;
        }

        // Calculate the final genre based on the weighted distance
        let weightedGenres = {};
        for (let genre in genres) {
            const range = genres[genre];
            const rangeCenter = (range.max + range.min) / 2;
            const distance = Math.sqrt(Math.pow(rangeCenter - frequency, 2));
            const weightedDistance = distance / genreWeights[genre];
            weightedGenres[genre] = weightedDistance;
        }
        // Sort the genres by their weighted distance
        let genreArray = Object.entries(weightedGenres).sort((a, b) => (a[1] as number) - (b[1] as number));

        // Check if the best match is 'rock', and if so, check if it's a better match than 'other'
        if (bestMatch === 'rock') {
            const rockWeight = genreWeights['rock'];
            const otherWeight = genreWeights['other'];
            if (rockWeight > otherWeight) {
                return bestMatch;
            }
        }

        // Return the genre with the smallest weighted distance
        return genreArray[0][0] || 'other';
    }
    // getGenreFromFrequency(frequency) {
    //     // Define frequency ranges for each genre
    //     const genres = {
    //         'rock': { min: 640, max: 7680 },
    //         'pop': { min: 588.8, max: 7065.6 },
    //         'electronic': { min: 352, max: 4224 },
    //         'hipHop': { min: 384, max: 4608 },
    //         'classical': { min: 224, max: 2688 },
    //         'jazz': { min: 256, max: 3072 },
    //         'other': { min: 200, max: 2400 }
    //     };

    //     let bestMatch = null;
    //     let bestMatchWidth = Infinity;
    //     let bestMatchCenter = Infinity;

    //     // Check if the frequency falls within a range of any genre
    //     for (let genre in genres) {
    //         const range = genres[genre];
    //         if (frequency >= range.min && frequency <= range.max) {
    //             // Compare the average amplitude of the frequency data for each genre
    //             // if (averageAmplitude >= 0.8) {
    //             //     // Check if the frequency is consistently in the range of the genre
    //             //     const frequencyRange = range.max - range.min;
    //             //     const frequencyThreshold = frequencyRange * 0.2;
    //             // const isInRange = frequency >= range.min + frequencyThreshold && frequency <= range.max - frequencyThreshold;
    //             const rangeWidth = range.max - range.min;
    //             const rangeCenter = (range.max + range.min) / 2;
    //             if (rangeWidth < bestMatchWidth) {
    //                 bestMatch = genre;
    //                 bestMatchWidth = rangeWidth;
    //                 bestMatchCenter = rangeCenter;
    //             } else if (rangeWidth === bestMatchWidth) {
    //                 const centerDist = Math.abs(bestMatchCenter - frequency);
    //                 const newCenterDist = Math.abs(rangeCenter - frequency);
    //                 if (newCenterDist < centerDist) {
    //                     bestMatch = genre;
    //                     bestMatchWidth = rangeWidth;
    //                     bestMatchCenter = rangeCenter;
    //                 }
    //             }
    //         }
    //     }

    //     return bestMatch || 'other';
    // }

    //changeForOne
    calculateBPM(audioBuffer, intervalCount) {
        // Get the audio data from the first channel
        const audioData = audioBuffer._channelData[0];

        // Calculate the length of one audio frame
        const frameLength = audioBuffer.sampleRate / 60; // 60 seconds in a minute

        // Calculate the interval size
        const intervalSize = Math.floor(audioData.length / intervalCount);

        // Create an array to store the beats for each interval
        const intervalBeats = new Array(intervalCount).fill(0).map(() => []);

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
                const intervalIndex = Math.floor(i / intervalSize);
                intervalBeats[intervalIndex].push(i);
            }
        }

        // Calculate the BPM for each interval
        const bpms = intervalBeats.map((interval) => {
            // Calculate the time difference between each beat
            const timeDiffs = [];
            for (let i = 1; i < interval.length; i++) {
                timeDiffs.push(interval[i] - interval[i - 1]);
            }

            // Calculate the average time difference and convert to BPM
            const avgTimeDiff = timeDiffs.reduce((a, b) => a + b, 0) / timeDiffs.length;
            const bpm = audioBuffer.sampleRate / avgTimeDiff * 60;

            return bpm;
        });

        return bpms;
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

    mapInstrument(amplitudeData, sampleRate) {
        const fftSize = 2048;
        const numBins = fftSize / 2;
        const binWidth = sampleRate / fftSize;
        const maxFrequency = sampleRate / 2;

        const energy = amplitudeData.reduce((total, current) => total + current, 0);

        if (energy < 1) {
            return null;
        }

        const normalizedEnergy = amplitudeData.map((a) => a / energy);

        const frequencyRanges = [
            { min: 27.5, max: 55, name: "sub-bass" },
            { min: 55, max: 110, name: "bass" },
            { min: 110, max: 220, name: "low midrange" },
            { min: 220, max: 440, name: "midrange" },
            { min: 440, max: 880, name: "upper midrange" },
            { min: 880, max: 1760, name: "presence" },
            { min: 1760, max: 3520, name: "brilliance" },
            { min: 3520, max: 7040, name: "upper brilliance" },
            { min: 7040, max: maxFrequency, name: "air" },
        ];

        let bestMatch = null;
        let bestMatchWidth = Infinity;
        let bestMatchCenter = 0;

        for (const range of frequencyRanges) {
            const rangeWidth = range.max - range.min;
            const rangeCenter = (range.max + range.min) / 2;

            for (let i = 0; i < numBins; i++) {
                const frequency = i * binWidth;

                if (frequency < range.min || frequency > range.max) {
                    continue;
                }

                const normalizedBinValue = normalizedEnergy[i];

                if (normalizedBinValue < 0.001) {
                    continue;
                }

                if (rangeWidth < bestMatchWidth) {
                    bestMatch = range.name;
                    bestMatchWidth = rangeWidth;
                    bestMatchCenter = rangeCenter;
                } else if (rangeWidth === bestMatchWidth) {
                    const centerDist = Math.abs(bestMatchCenter - frequency);
                    const newCenterDist = Math.abs(rangeCenter - frequency);

                    if (newCenterDist < centerDist) {
                        bestMatch = range.name;
                        bestMatchWidth = rangeWidth;
                        bestMatchCenter = rangeCenter;
                    }
                }
            }
        }

        return bestMatch;
    }

    async mapEnergy(amplitudeData) {
        // Map to energy level
        //const energyData = [];
        const highEnergyThreshold = 0.1;
        const lowEnergyThreshold = 0.05;
        const avgEnergy = amplitudeData.reduce((acc, val) => acc + val) / amplitudeData.length;
        const energyLevel = avgEnergy >= highEnergyThreshold ? 'high' : (avgEnergy >= lowEnergyThreshold ? 'mid' : 'low');
        //energyData.push({ energyLevel });

        return energyLevel;
    }

    // async mapAudioDataBy(audioData) {
    //     const audioContext = new AudioContext();
    //     const source = audioContext.createBufferSource();
    //     const buffer = audioContext.createBuffer(1, audioData.length, audioContext.sampleRate);
    //     buffer.getChannelData(0).set(audioData);
    //     source.buffer = buffer;
    //     const analyser = audioContext.createAnalyser();
    //     analyser.fftSize = 2048;
    //     source.connect(analyser);
    //     analyser.connect(audioContext.destination);
    //     source.start();

    //     const [response] = await client.recognize({
    //         config: {
    //             encoding: 'LINEAR16',
    //             sampleRateHertz: 16000,
    //             languageCode: 'en-US',
    //         },
    //         audio: {
    //             content: audioData.toString('base64'),
    //         },
    //     });
    //     const transcription = response.results
    //         .map(result => result.alternatives[0].transcript)
    //         .join('\n');
    //     console.log(`Transcription: ${transcription}`);


    //     let sentiment = 'neutral';
    //     if (transcription.includes('love')) {
    //         sentiment = 'romantic';
    //     } else if (transcription.includes('heartbreak')) {
    //         sentiment = 'sad';
    //     } else if (transcription.includes('politics')) {
    //         sentiment = 'political';
    //     }
    //     const lyricsData = [{ sentiment }];
    //     console.log(lyricsData);

    // }

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
    hexToRgb(hex) {
        // Convert hex string to integer value
        const intVal = parseInt(hex.substring(1), 16);

        // Extract red, green, and blue values using bit-shifting and bitwise AND operations
        const r = (intVal >> 16) & 255;
        const g = (intVal >> 8) & 255;
        const b = intVal & 255;

        // Return an object with r, g, and b properties
        return [r, g, b];
    }
}