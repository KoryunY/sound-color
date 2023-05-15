import { Injectable } from '@nestjs/common';

import { energyColors, genreColors, instrumentColors, sentimentsColors, tempoColors } from 'src/defaults/consts';
import { ConvertingType, Energy, Genre, Instrument, Tempo } from 'src/defaults/types';
import { AudioProcessingService } from './audio.service';
import { OtherProcessingService } from './other.service';
import { ColorrocessingService as ColorProcessingService } from './colors.service';


@Injectable()
export class MusicService {
    constructor(private audioService: AudioProcessingService, private otherService: OtherProcessingService, private colorService: ColorProcessingService) { }

    //getIntervals
    async generateIntervalData(audio: any, type: ConvertingType, intervalCount?: number, useCustomFft?: boolean) { //xary count logic
        const decodedAudio = await this.audioService.decodeAudio(audio);
        let fft;
        if (useCustomFft)
            fft = this.audioService.fft(decodedAudio._channelData[0]);
        else
            fft = this.audioService.getFft(decodedAudio);

        let duration = this.audioService.getDuration(decodedAudio);
        let frequency = this.audioService.getFrequencyData(fft, decodedAudio._channelData[0].length, intervalCount);

        let bpm = this.audioService.calculateBPM(decodedAudio, intervalCount);
        const originalLength = decodedAudio._channelData[0].length;
        const paddedLength = Math.pow(2, Math.ceil(Math.log2(originalLength)));
        const intervalAudioLength = Math.round(originalLength / intervalCount);
        const pitch = this.audioService.getPitchArray(frequency);
        let amplitude = this.audioService.getAmplitudeData(fft, decodedAudio._channelData[0].length / 2, paddedLength, intervalCount, intervalAudioLength);
        let intervalDuration = duration / intervalCount;

        switch (type) {
            case ConvertingType.FREQUENCY:
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
            case ConvertingType.AIO:
                return [frequency, amplitude, duration, intervalDuration, bpm, pitch]
            default:
                throw new Error("Unhandled Converting Type");
        }
    }

    generateByFrequency(frequencyArray, amplitudeArray, duration = null, intervalDuration = null, intervalCount = null, gradientSplitCount = null) {
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
            const color = this.otherService.getColorFromFrequency(frequency);
            const interval = { start: intervalStart, end: intervalEnd, intensity, color };
            intervalData.push(interval);
        }

        if (gradientSplitCount) {
            return this.transfromIntervalsToGradients(intervalData, gradientSplitCount);
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
        //let sumAmplitude = 0;

        // calculate interval duration if not provided
        if (!intervalDuration && duration) {
            intervalDuration = (length > 0) ? (duration / length) : 0;
        } else if (!duration && intervalDuration && length) {
            duration = intervalDuration * length;
        }

        for (let i = 0; i < length; i++) {
            const frequency = frequencyArray[i];
            const amplitude = amplitudeArray[i];
            //sumAmplitude += amplitude;
            const intervalStart = i * intervalDuration;
            const intervalEnd = (i + 1) * intervalDuration;
            const intensity = Math.sqrt(amplitude);

            // Map frequency to hue value using genreColors object
            const genre = inputGenre ? inputGenre : this.otherService.getGenreFromFrequency(frequency);
            const colors = inputColors ? inputColors : genreColors[genre];
            const colorIndex = Math.floor(Math.random() * colors.length);
            const [red, green, blue] = this.colorService.hexToRgb(colors[colorIndex])
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
        const tempo = inputTempo ? inputTempo : this.audioService.getTempoFromBpm(bpm[0]);
        const colorr = inputColors ? inputColors : tempoColors[tempo];

        for (let i = 0; i < intervalCount; i++) {
            const amplitude = amplitudeArray[i];
            const intervalStart = i * intervalDuration;
            const intervalEnd = (i + 1) * intervalDuration;
            const intensity = Math.sqrt(amplitude);

            const colorrr = this.otherService.getMatchingColor(bpm[0], frequency[i], colorr)
            // Map tempo to hue value using tempoColors object
            const [red, green, blue] = this.colorService.hexToRgb(colorrr);

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
            const instrument = inputInstrument ? inputInstrument : this.otherService.mapInstrument(pitchArray[i]);

            const intervalStart = i * intervalDuration;
            const intervalEnd = (i + 1) * intervalDuration;
            const intensity = Math.sqrt(amplitude);

            const instrumentColor = inputColors ? inputColors : instrumentColors[instrument];
            const colorIndex = Math.floor(Math.random() * instrumentColor.length);

            const [red, green, blue] = this.colorService.hexToRgb(instrumentColor[colorIndex]);

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
                energyLevel = this.otherService.mapEnergy(amplitude);
            const intervalStart = i * intervalDuration;
            const intervalEnd = (i + 1) * intervalDuration;
            const intensity = Math.sqrt(amplitude);

            const energyColorss = inputColors ? inputColors : energyColors[energyLevel];
            const colorIndex = Math.floor(Math.random() * energyColorss.length);
            const [red, green, blue] = this.colorService.hexToRgb(energyColorss[colorIndex]);

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
                colorFamily.push(...this.colorService.getColorFamily(sentimentColors[i], familyCount))
            }
            sentimentColors = colorFamily;
        }

        for (let i = 0; i < intervalCount; i++) {
            const amplitude = amplitudeArray[i];

            const intervalStart = i * intervalDuration;
            const intervalEnd = (i + 1) * intervalDuration;
            const intensity = Math.sqrt(amplitude);

            const colorIndex = Math.floor(Math.random() * sentimentColors.length);

            const [red, green, blue] = this.colorService.hexToRgb(sentimentColors[colorIndex]);

            const color = `rgb(${red}, ${green}, ${blue})`;
            const interval = { start: intervalStart, end: intervalEnd, intensity, color };
            intervalData.push(interval);
        }
        return intervalData;
    }

    generateByAio(intervalCount, intervalDuration, frequencyArray, amplitudeArray, pitchArray, bpm, sentiment) {

        let intervalData = [];
        let colors = [];
        const tempo = this.audioService.getTempoFromBpm(bpm[0]);
        const tempoColorsByBpm = tempoColors[tempo];
        let sentimentColors = sentimentsColors[sentiment];
        if (!sentimentColors) {
            throw new Error("Invalid sentiment");
        }
        for (let i = 0; i < intervalCount; i++) {
            const intervalStart = i * intervalDuration;
            const intervalEnd = (i + 1) * intervalDuration;
            const amplitude = amplitudeArray[i];
            const intensity = Math.sqrt(amplitude) * 10;

            const frequency = frequencyArray[i];
            const frequencyColor = this.otherService.getColorFromFrequency(frequency, true);
            const hexFrequencyColor = this.colorService.rgbToHex(frequencyColor);
            if (hexFrequencyColor !== null)
                colors.push(hexFrequencyColor);

            const genre = this.otherService.getGenreFromFrequency(frequency);
            const colorIndex = Math.floor(Math.random() * colors.length);
            const hexGenreColor = genreColors[genre][colorIndex]
            if (hexGenreColor !== null)
                colors.push(hexGenreColor);

            const hexTempoColor = this.otherService.getMatchingColor(bpm[0], frequency, tempoColorsByBpm)
            if (hexTempoColor !== null)
                colors.push(hexTempoColor);

            const pitch = pitchArray[i];
            const instrument = this.otherService.mapInstrument(pitch);
            const instrumentColorsHex = instrumentColors[instrument];
            const instrumentColorIndex = Math.floor(Math.random() * instrumentColorsHex.length);
            const instrumentColorHex = instrumentColorsHex[instrumentColorIndex];
            if (instrumentColorHex !== null)
                colors.push(instrumentColorHex);

            const energyLevel = this.otherService.mapEnergy(amplitude);
            const energyColorsHex = energyColors[energyLevel];
            const energyColorIndex = Math.floor(Math.random() * energyColorsHex.length);
            const energyColorHex = energyColorsHex[energyColorIndex];
            if (energyColorHex !== null)
                colors.push(energyColorHex);

            const sentimentColorIndex = Math.floor(Math.random() * sentimentColors.length);
            const sentimentColorHex = sentimentColors[sentimentColorIndex];
            if (sentimentColorHex !== null)
                colors.push(sentimentColorHex);
            const colorHex = this.colorService.combineColors(colors);
            const [red, green, blue] = this.colorService.hexToRgb(colorHex)
            const color = `rgb(${red}, ${green}, ${blue})`;

            const interval = { start: intervalStart, end: intervalEnd, intensity, color };
            intervalData.push(interval);

            colors = [];
        }

        return intervalData;
    }

    transfromIntervalsToGradients(intervalData, gradientSplitCount) {
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
            const gradient = this.colorService.getGradientRgbArray(colorObj1, colorObj2, gradientSplitCount + 1);

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


}
