import { Injectable } from '@nestjs/common';
import DSP from 'dsp.js';
import axios from 'axios';
import fs from 'fs';

import { instrumentPitchRanges, energyColors, genreColors, instrumentColors, sentimentsColors, sentimentDict, tempoColors, frequencyBandColors, genres, genreWeights, tempos } from 'src/Defaults/consts';
import { ConvertingType, Energy, Genre, Instrument, Tempo } from 'src/Defaults/types';


@Injectable()
export class MusicService {
    //#region MAIN

    //decode audio
    async decodeAudio(audioBuffer: any) {
        const decode = await import('audio-decode');

        return await decode.default(audioBuffer)
    }
    reverseBits(n, numBits) {
        let reversed = 0;
        for (let i = 0; i < numBits; i++) {
            reversed = (reversed << 1) | (n & 1);
            n >>= 1;
        }
        return reversed;
    }

    fft(audioBuffer) {
        let N = 1;
        while (N < audioBuffer.length) {
            N *= 2;
        }

        // Perform the FFT
        const spectrum = new Array(N / 2).fill(0);
        const re = new Array(N).fill(0);
        const im = new Array(N).fill(0);

        // Bit-reversal permutation
        for (let i = 0; i < N; i++) {
            const j = this.reverseBits(i, Math.log2(N));
            re[j] = audioBuffer[i] || 0;
        }

        // FFT butterfly computation
        for (let n = 2; n <= N; n *= 2) {
            const halfN = n / 2;
            const theta = (2 * Math.PI) / n;

            for (let i = 0; i < N; i += n) {
                let wR = 1;
                let wI = 0;

                for (let j = 0; j < halfN; j++) {
                    const tR = wR * re[i + j + halfN] - wI * im[i + j + halfN];
                    const tI = wR * im[i + j + halfN] + wI * re[i + j + halfN];
                    const uR = re[i + j];
                    const uI = im[i + j];

                    re[i + j] = uR + tR;
                    im[i + j] = uI + tI;
                    re[i + j + halfN] = uR - tR;
                    im[i + j + halfN] = uI - tI;

                    const nextWR = Math.cos(theta) * wR - Math.sin(theta) * wI;
                    wI = Math.sin(theta) * wR + Math.cos(theta) * wI;
                    wR = nextWR;
                }
            }
        }

        // Calculate the magnitude spectrum
        for (let k = 0; k < N / 2; k++) {
            const magnitude = Math.sqrt(re[k] ** 2 + im[k] ** 2);
            spectrum[k] = magnitude;
        }

        // Convert the frequency domain to Hz
        const sampleRate = 44100; // Replace with the actual sample rate of your audio file
        const frequencyBins = new Array(N / 2).fill(0);
        for (let k = 0; k < N / 2; k++) {
            frequencyBins[k] = k * (sampleRate / N);
        }

        return { frequencyBins, spectrum };
    }

    // Returns the sum of two complex numbers
    calculateFFT(audioBuffer, sampleRate) {
        const N = audioBuffer.length;

        // Ensure the length of the buffer is a power of 2

        // Perform the FFT
        const spectrum = new Array(N / 2).fill(0);
        const re = new Array(N).fill(0);
        const im = new Array(N).fill(0);

        // Bit-reversal permutation
        for (let i = 0; i < N; i++) {
            const j = this.reverseBits(i, Math.log2(N));
            re[j] = audioBuffer[i];
        }

        // FFT butterfly computation
        for (let n = 2; n <= N; n *= 2) {
            const halfN = n / 2;
            const theta = (2 * Math.PI) / n;

            for (let i = 0; i < N; i += n) {
                let wR = 1;
                let wI = 0;

                for (let j = 0; j < halfN; j++) {
                    const tR = wR * re[i + j + halfN] - wI * im[i + j + halfN];
                    const tI = wR * im[i + j + halfN] + wI * re[i + j + halfN];
                    const uR = re[i + j];
                    const uI = im[i + j];

                    re[i + j] = uR + tR;
                    im[i + j] = uI + tI;
                    re[i + j + halfN] = uR - tR;
                    im[i + j + halfN] = uI - tI;

                    const nextWR = Math.cos(theta) * wR - Math.sin(theta) * wI;
                    wI = Math.sin(theta) * wR + Math.cos(theta) * wI;
                    wR = nextWR;
                }
            }
        }

        // Calculate the magnitude spectrum
        for (let k = 0; k < N / 2; k++) {
            const magnitude = Math.sqrt(re[k] ** 2 + im[k] ** 2);
            spectrum[k] = magnitude;
        }

        // Convert the frequency domain to Hz
        const frequencyBins = new Array(N / 2).fill(0);
        for (let k = 0; k < N / 2; k++) {
            frequencyBins[k] = k * (sampleRate / N);
        }

        return { frequencyBins, spectrum };
    }

    //getIntervals
    async generateIntervalData(audio: any, type: ConvertingType, intervalCount?: number) { //xary count logic
        const decodedAudio = await this.decodeAudio(audio);
        let fft = this.getFft(decodedAudio);
        return fft
        let duration = this.getDuration(decodedAudio);
        let frequency = this.getFrequencyData(fft, decodedAudio._channelData[0].length, intervalCount);

        let bpm = this.calculateBPM(decodedAudio, intervalCount);
        const originalLength = decodedAudio._channelData[0].length;
        const paddedLength = Math.pow(2, Math.ceil(Math.log2(originalLength)));
        const intervalAudioLength = Math.floor(originalLength / intervalCount);
        const pitch = this.getPitchArray(frequency);
        let amplitude = this.getAmplitudeData(fft, decodedAudio._channelData[0].length / 2, paddedLength, intervalCount, intervalAudioLength);

        let intervalDuration = duration / intervalCount;

        switch (type) {
            case ConvertingType.SYNESTHESIA:
                return [frequency, amplitude, duration, intervalDuration];
            case ConvertingType.GENRE:
                return [frequency, amplitude, duration, intervalDuration];
            case ConvertingType.TEMPO:
                return [frequency, amplitude, intervalDuration, bpm];
            case ConvertingType.INSTRUMENT:
                return [amplitude, intervalDuration, pitch];
            case ConvertingType.ENERGY:
                return [amplitude, intervalDuration];
            case ConvertingType.SPEECH:
                return [amplitude, intervalDuration];

        }

    }

    generateBySynesthesia(frequencyArray, amplitudeArray, duration = null, intervalDuration = null, intervalCount = null, gradientSplitCount = null) {
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
            const intensity = Math.sqrt(amplitude) * 10;
            const color = this.getColorFromFrequency(frequency);
            const interval = { start: intervalStart, end: intervalEnd, intensity, color };
            intervalData.push(interval);
        }

        if (gradientSplitCount) {
            let newIntervalData = [];
            for (let i = 0; i < intervalData.length - 1; i++) {
                const { start: start1, end: end1, color: color1, intensity: intensity1 } = intervalData[i];
                const { color: color2, intensity: intensity2 } = intervalData[i + 1];
                const match1 = color1.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
                const match2 = color2.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
                const r1 = parseInt(match1[1], 10);
                const g1 = parseInt(match1[2], 10);
                const b1 = parseInt(match1[3], 10);
                const r2 = parseInt(match2[1], 10);
                const g2 = parseInt(match2[2], 10);
                const b2 = parseInt(match2[3], 10);
                const colorObj1 = { r: r1, g: g1, b: b1 };
                const colorObj2 = { r: r2, g: g2, b: b2 };
                const gradient = this.getGradientRgbArray(colorObj1, colorObj2, gradientSplitCount + 1);

                const intervalLength = (end1 - start1) / (gradientSplitCount + 1);

                for (let j = 0; j < gradientSplitCount + 1; j++) {
                    const intervalStart = start1 + j * intervalLength;
                    const intervalEnd = intervalStart + intervalLength;
                    const [red, green, blue] = gradient[j];
                    const color = `rgb(${red}, ${green}, ${blue})`
                    const intensity = (intensity1 + intensity2) / 2;
                    newIntervalData.push({ start: intervalStart, end: intervalEnd, intensity, color });
                }
            }

            return newIntervalData;
        }

        return intervalData;
    }

    generateByGenre(config, type, frequencyArray, amplitudeArray, duration = null, intervalDuration = null, intervalCount = null) {
        let inputColors: string[], inputGenre: Genre;

        if (config) {
            if (type && config.type !== type) {
                throw new Error("Invalid input parameters");
            }
            inputColors = config.colors;
            inputGenre = config.type
        } else if (type) {
            inputGenre = type;
        }

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
        }

        const intervalData = [];
        let sumAmplitude = 0;

        // calculate interval duration if not provided
        if (!intervalDuration && duration) {
            intervalDuration = (length > 0) ? (duration / length) : 0;
        } else if (!duration && intervalDuration && length) {
            duration = intervalDuration * length;
        }

        for (let i = 0; i < length; i++) {
            const frequency = frequencyArray[i];
            const amplitude = amplitudeArray[i];
            sumAmplitude += amplitude;
            const intervalStart = i * intervalDuration;
            const intervalEnd = (i + 1) * intervalDuration;
            const intensity = Math.sqrt(amplitude);

            // Map frequency to hue value using genreColors object
            const genre = inputGenre ? inputGenre : this.getGenreFromFrequency(frequency);
            const colors = inputColors ? inputColors : genreColors[genre];
            const colorIndex = Math.floor(Math.random() * colors.length);
            const [red, green, blue] = this.hexToRgb(colors[colorIndex])
            const color = `rgb(${red}, ${green}, ${blue})`;

            const interval = { start: intervalStart, end: intervalEnd, intensity, color };
            intervalData.push(interval);
        }
        return intervalData;
    }

    generateByTempo(config, type, frequency, amplitudeArray, intervalDuration, intervalCount, bpm) {
        let inputColors: string[], inputTempo: Tempo;

        if (config) {
            inputColors = config.colors;
            inputTempo = config.type
        } else if (type) {
            inputTempo = type;
        }

        const intervalData = [];
        const tempo = inputTempo ? inputTempo : this.getTempoFromBpm(bpm[0]);
        const colorr = inputColors ? inputColors : tempoColors[tempo];

        for (let i = 0; i < intervalCount; i++) {
            const amplitude = amplitudeArray[i];
            const intervalStart = i * intervalDuration;
            const intervalEnd = (i + 1) * intervalDuration;
            const intensity = Math.sqrt(amplitude);
            const colorrr = this.getMatchingColor(bpm[0], frequency[i], colorr)
            // Map tempo to hue value using tempoColors object
            const [red, green, blue] = this.hexToRgb(colorrr);

            const color = `rgb(${red}, ${green}, ${blue})`;
            const interval = { start: intervalStart, end: intervalEnd, intensity, color };
            intervalData.push(interval);
        }
        return intervalData;
    }

    generateByInstrument(config, type, amplitudeArray, pitchArray, intervalDuration, intervalCount) {
        let inputColors: string[], inputInstrument: Instrument;

        if (config) {
            inputColors = config.colors;
            inputInstrument = config.type
        } else if (type) {
            inputInstrument = type;
        }

        const intervalData = [];
        // Iterate through intervals
        for (let i = 0; i < intervalCount; i++) {
            const amplitude = amplitudeArray[i];
            const instrument = inputInstrument ? inputInstrument : this.mapInstrument(pitchArray[i]);

            const intervalStart = i * intervalDuration;
            const intervalEnd = (i + 1) * intervalDuration;
            const intensity = Math.sqrt(amplitude);

            const instrumentColor = inputColors ? inputColors : instrumentColors[instrument];
            const colorIndex = Math.floor(Math.random() * instrumentColor.length);

            const [red, green, blue] = this.hexToRgb(instrumentColor[colorIndex]);

            const color = `rgb(${red}, ${green}, ${blue})`;
            const interval = { start: intervalStart, end: intervalEnd, intensity, color };
            intervalData.push(interval);
        }

        return intervalData;
    }

    async generateByEnergy(config, amplitudeArray, intervalDuration, intervalCount) {
        let inputColors: string[], inputEnergy: Energy;
        //fixconfig
        if (config) {
            inputColors = config.colors;
            inputEnergy = config.type
        }
        const intervalData = [];

        for (let i = 0; i < intervalCount; i++) {
            const amplitude = amplitudeArray[i];
            let energyLevel;
            if (!inputEnergy)
                energyLevel = this.mapEnergy(amplitude);
            const intervalStart = i * intervalDuration;
            const intervalEnd = (i + 1) * intervalDuration;
            const intensity = Math.sqrt(amplitude);

            const energyColorss = inputColors ? inputColors : energyColors[energyLevel];
            const colorIndex = Math.floor(Math.random() * energyColorss.length);
            const [red, green, blue] = this.hexToRgb(energyColorss[colorIndex]);

            const color = `rgb(${red}, ${green}, ${blue})`;
            const interval = { start: intervalStart, end: intervalEnd, intensity, color };
            intervalData.push(interval);
        }
        return intervalData;
    }

    async generateBySentiment(config, sentiment, amplitudeArray, intervalDuration, intervalCount, familyCount) {
        let inputColors: string[], inputSentiment: Energy;
        if (config) {
            inputColors = config.colors;
            inputSentiment = config.type
        }

        const intervalData = [];
        let sentimentColors = inputColors ? inputColors : sentimentsColors[sentiment];
        if (familyCount && familyCount > 1) {
            let colorFamily = [];
            for (let i = 0; i < sentimentColors.length; i++) {
                colorFamily.push(...this.getColorFamily(sentimentColors[i], familyCount))
            }
            sentimentColors = colorFamily;
        }

        for (let i = 0; i < intervalCount; i++) {
            const amplitude = amplitudeArray[i];

            const intervalStart = i * intervalDuration;
            const intervalEnd = (i + 1) * intervalDuration;
            const intensity = Math.sqrt(amplitude);

            const colorIndex = Math.floor(Math.random() * sentimentColors.length);

            const [red, green, blue] = this.hexToRgb(sentimentColors[colorIndex]);

            const color = `rgb(${red}, ${green}, ${blue})`;
            const interval = { start: intervalStart, end: intervalEnd, intensity, color };
            intervalData.push(interval);
        }
        return intervalData;
    }
    //#endregion

    //#region helpers

    getGradientRgbArray(rgbColor1, rgbColor2, count) {
        let stepR = (rgbColor2.r - rgbColor1.r) / (count - 1);
        let stepG = (rgbColor2.g - rgbColor1.g) / (count - 1);
        let stepB = (rgbColor2.b - rgbColor1.b) / (count - 1);
        let gradient = [];

        for (let i = 0; i < count; i++) {
            let r = Math.round(rgbColor1.r + stepR * i);
            let g = Math.round(rgbColor1.g + stepG * i);
            let b = Math.round(rgbColor1.b + stepB * i);
            gradient.push([r, g, b]);
        }

        return gradient;
    }

    getMatchingColor(bpm, frequency, colors) {
        let bestColor = '';
        let bestMatchScore = Number.MAX_VALUE;

        for (let i = 0; i < colors.length; i++) {
            const color = colors[i];
            const [r, g, b] = this.hexToRgb(color);
            const matchScore = this.calculateMatchScore(bpm, frequency, r, g, b);
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
        const frequencyDiff = Math.abs(frequency - g) + (Math.random() * 1000 - 500);

        // Calculate a weighted score based on the differences
        const matchScore = Math.sqrt((bpmDiff * bpmDiff) + (frequencyDiff * frequencyDiff) - b);

        return matchScore;

    }


    getColorFromFrequency(frequency) {
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
        let localGenreWeights = { ...genreWeights };

        let bestMatch = null;
        let bestMatchDistance = Infinity;
        let totalWeight = 0;


        // Check if the frequency falls within a range of any genre
        for (let genre in genres) {
            const range = genres[genre];
            if (frequency >= range.min && frequency <= range.max) {
                const rangeCenter = (range.max + range.min) / 2;
                const distance = Math.sqrt(Math.pow(rangeCenter - frequency, 2));
                const weightedDistance = distance / localGenreWeights[genre];
                if (weightedDistance < bestMatchDistance) {
                    bestMatch = genre;
                    bestMatchDistance = weightedDistance;
                }
                totalWeight += localGenreWeights[genre];
            }
        }

        // Normalize the genre weights so that they add up to 1
        for (let genre in localGenreWeights) {
            localGenreWeights[genre] /= totalWeight;
        }

        // Calculate the final genre based on the weighted distance
        let weightedGenres = {};
        for (let genre in genres) {
            const range = genres[genre];
            const rangeCenter = (range.max + range.min) / 2;
            const distance = Math.sqrt(Math.pow(rangeCenter - frequency, 2));
            const weightedDistance = distance / localGenreWeights[genre];
            weightedGenres[genre] = weightedDistance;
        }
        // Sort the genres by their weighted distance
        let genreArray = Object.entries(weightedGenres).sort((a, b) => (a[1] as number) - (b[1] as number));

        // Check if the best match is 'rock', and if so, check if it's a better match than 'other'
        if (bestMatch === 'rock') {
            const rockWeight = localGenreWeights['rock'];
            const otherWeight = localGenreWeights['other'];
            if (rockWeight > otherWeight) {
                return bestMatch;
            }
        }

        // Return the genre with the smallest weighted distance
        return genreArray[0][0] || 'other';
    }

    //changeForOne
    calculateBPM(audioBuffer, intervalCount) {
        //if (!intervalCount) {
        intervalCount = 1;
        // }

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
        //return intervalBeats
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
        // Loop through tempos object and return matching tempo for given bpm
        for (let tempo in tempos) {
            const range = tempos[tempo];
            if (bpm >= range.min && bpm <= range.max) {
                return tempo;
            }
        }

        // If no tempo is matched, return 'other'
        return 'OTHER';
    }

    mapInstrument(pitch) {
        let bestInstrument = null;
        let smallestDifference = Infinity;

        for (const [instrument, range] of Object.entries(instrumentPitchRanges)) {
            const midpoint = (range.min + range.max) / 2;
            const difference = Math.abs(pitch - midpoint);

            if (difference < smallestDifference) {
                bestInstrument = instrument;
                smallestDifference = difference;
            }
        }
        if (!bestInstrument)
            return 'OTHER';
        return bestInstrument
    }

    mapEnergy(amplitude) {
        // Map to energy level
        const highEnergyThreshold = 0.1;
        const lowEnergyThreshold = 0.05;
        let avgEnergy = Array.isArray(amplitude) ? amplitude.reduce((acc, val) => acc + val) / amplitude.length : amplitude;
        avgEnergy *= 1000;
        const energyLevel = avgEnergy >= highEnergyThreshold ? 'high' : (avgEnergy >= lowEnergyThreshold ? 'mid' : 'low');
        return energyLevel;
    }


    sentimentFromWords(words) {

        let sentiment = 'neutral';
        const wordCount = words.length;
        let maxMatch = 0; //minimum match percentege

        // Check each sentiment word
        for (const [sentimentWord, sentimentValue] of Object.entries(sentimentDict)) {
            const matchCount = words.filter(word => word.includes(sentimentWord)).length;

            // If more than 50% of words match the sentiment word, set the sentiment
            if (matchCount / wordCount > maxMatch) {
                sentiment = sentimentValue;
                maxMatch = matchCount / wordCount
            }
        }

        return { sentiment, maxMatch };
    }

    //other

    rgbToHex(rgb) {
        // Convert the red, green, and blue values to hex strings
        const rHex = rgb[0].toString(16).padStart(2, '0');
        const gHex = rgb[1].toString(16).padStart(2, '0');
        const bHex = rgb[2].toString(16).padStart(2, '0');
        // Combine the hex strings and return the result
        return `#${rHex}${gHex}${bHex}`;
    }

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


    // calculate pitch data using autocorrelation method
    getPitchArray(frequencyData) {
        const pitchArray = [];
        const minFrequency = 27.5;
        const maxFrequency = 4186;
        const numBins = frequencyData.length;

        for (let i = 0; i < numBins; i++) {
            const frequency = frequencyData[i];
            if (frequency > 0 && frequency >= minFrequency && frequency <= maxFrequency) {
                const pitch = 69 + 12 * Math.log2(frequency / 440);
                pitchArray.push(pitch);
            } else {
                pitchArray.push(null);
            }
        }

        return pitchArray;
    }

    async convertAudioBufferToRawPcm(inputBuffer) {
        const { spawn } = require('child_process');

        const inputFilePath = './temp-input-file.m4a';
        const outputFilePath = './temp-output-file.raw';

        // Write input buffer to temporary input file
        fs.writeFileSync(inputFilePath, inputBuffer);

        // Convert temporary input file to raw PCM format using ffmpeg
        const command = spawn('ffmpeg', [
            '-i', inputFilePath,
            '-vn', '-acodec', 'pcm_s16le',
            '-ar', '44100', '-ac', '1',
            '-f', 's16le', outputFilePath
        ]);

        // Handle command errors
        command.on('error', (error) => {
            console.error(`Error running ffmpeg: ${error}`);
        });

        // Wait for the command to exit
        await new Promise((resolve, reject) => {
            command.on('exit', (code) => {
                if (code === 0) {
                    resolve(code);
                } else {
                    reject(new Error(`ffmpeg process exited with code ${code}`));
                }
            });
        });

        // Read raw PCM data from temporary output file
        const rawData = fs.readFileSync(outputFilePath);

        // Delete temporary files
        fs.unlinkSync(inputFilePath);
        fs.unlinkSync(outputFilePath);

        return rawData;
    }

    extractUniqueWords(arr) {
        const uniqueWords = new Set(); // create a new Set to store unique words
        arr.forEach((str) => { // loop through each string in the array
            const words = str.split(' '); // split the string into an array of words
            words.forEach((word) => { // loop through each word in the array
                uniqueWords.add(word); // add the word to the Set
            });
        });
        return Array.from(uniqueWords); // convert the Set to an array and return it
    }

    calculateAverageFrequency(amplitudes, frequencies) {
        let sum = 0;
        let count = 0;

        for (let i = 0; i < frequencies.length; i++) {
            const frequency = frequencies[i];
            const amplitude = amplitudes[i];
            if (frequency >= 20 && frequency <= 20000) {
                sum += frequency * amplitude;
                count += amplitude;
            }
        }

        return sum / count;
    }

    getColorFamily(color, count) {
        // Parse the input color from hex to RGB format
        const r = parseInt(color.substring(1, 3), 16);
        const g = parseInt(color.substring(3, 5), 16);
        const b = parseInt(color.substring(5, 7), 16);
        // Define a function to interpolate between two colors
        function interpolateColor(color1, color2, factor) {
            const r1 = parseInt(color1.substring(1, 3), 16);
            const g1 = parseInt(color1.substring(3, 5), 16);
            const b1 = parseInt(color1.substring(5, 7), 16);
            const r2 = parseInt(color2.substring(1, 3), 16);
            const g2 = parseInt(color2.substring(3, 5), 16);
            const b2 = parseInt(color2.substring(5, 7), 16);
            const r = Math.round(r1 + factor * (r2 - r1));
            const g = Math.round(g1 + factor * (g2 - g1));
            const b = Math.round(b1 + factor * (b2 - b1));
            return "#" + r.toString(16).padStart(2, "0") +
                g.toString(16).padStart(2, "0") +
                b.toString(16).padStart(2, "0");
        }
        // Define the parent colors as slightly darker versions of the input color
        const parents = [];
        for (let i = 0; i < count / 2; i++) {
            const factor = (i + 1) / (count / 2 + 1);
            const parent = interpolateColor("#000000", color, factor);
            parents.push(parent);
        }
        // Define the child colors as slightly lighter versions of the input color
        const children = [];
        for (let i = 0; i < count / 2; i++) {
            const factor = (i + 1) / (count / 2 + 1);
            const child = interpolateColor(color, "#ffffff", factor);
            children.push(child);
        }
        // Return the combined array of parent and child colors
        return parents.concat(children);
    }
    //#endregion

    //#region metadata
    //metadata
    async requestToShazam(decodeAudio: any) {
        const rawData = await this.convertAudioBufferToRawPcm(decodeAudio.buffer);

        const sampleSize = 2; // 16-bit signed PCM (2 bytes per sample)
        const maxDuration = 5; // in seconds
        const maxSamples = 44100 * maxDuration;
        const truncatedData = rawData.slice(0, maxSamples * sampleSize);
        const base64Data = Buffer.from(truncatedData).toString('base64');

        const config = {
            headers: {
                'Content-Type': `text/plain`,
                'x-rapidapi-key': '5f8d6921d7msh800b18be09dd89ap1b7a42jsn1adb7f318889',//process.env.API_KEY,
                'x-rapidapi-host': 'shazam.p.rapidapi.com',
            },
            method: 'post',
            url: 'https://shazam.p.rapidapi.com/songs/detect',
            data: base64Data
        };

        const response = await axios(config);

        return response.data;
    }

    async getMetadata(decodeAudio?: any, text?: string) {
        let data
        if (text == null || text.length == 0)
            data = await this.requestToShazam(decodeAudio);
        else data = await this.searchMetadataBytext(text);

        if (!data)
            return;

        const genres = data.track.genres;
        const words = data.track.sections[1].text
        const sentiment = this.sentimentFromWords(this.extractUniqueWords(words)).sentiment;
        const name = data.track.share.subject;

        return [name, genres, sentiment];
    }

    async searchMetadataBytext(text: string) {
        const options = {
            method: 'GET',
            url: 'https://shazam.p.rapidapi.com/search',
            params: { term: text, locale: 'en-US', offset: '0', limit: '5' },
            headers: {
                'X-RapidAPI-Key': '5f8d6921d7msh800b18be09dd89ap1b7a42jsn1adb7f318889',
                'X-RapidAPI-Host': 'shazam.p.rapidapi.com'
            }
        };

        const response = await axios(options);

        return response.data;
    }

    async parseMetadata(audio): Promise<any> {
        const mm = await import('music-metadata');

        const metadata = await mm.parseBuffer(audio.buffer, 'audio/mpeg')
        const genre = metadata.common.genre;
        const name = metadata.common.title + ' - ' + metadata.common.artist;

        return [name, genre];
    }

    //#endregion

}

//#region todo
    //addShazam maybe others to

    //generateByCoverColors
    //real-timeprocessing
    //generateByMood//kindaDOne

    //test context==true?2 options:1 for now
    //one function to do all,
    //endpoints//above parts

    //dto passing param using
    //defaults creating and update add delete to for others
    //audio-metadata getting from shazam and others

    //genreWeights
    //energyLevel

    //add postman test fix,fix clean all code create front
    //color family
    //gradient
    //#endregion