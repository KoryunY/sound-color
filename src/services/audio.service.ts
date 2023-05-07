import { Injectable } from '@nestjs/common';
import DSP from 'dsp.js';
import fs from 'fs';

import { tempos } from 'src/defaults/consts';


@Injectable()
export class AudioProcessingService {
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

        return { real: re, imag: im, spectrum, frequencyBins };
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
            const intervalSize = Math.floor(length / intervalCount);
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


}