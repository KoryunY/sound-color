import { Injectable } from '@nestjs/common';

import { instrumentPitchRanges, sentimentDict, genres, genreWeights } from 'src/defaults/consts';
import { ColorrocessingService } from './colors.service';


@Injectable()
export class OtherProcessingService {
    constructor(private colorService: ColorrocessingService) {
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

    getMatchingColor(bpm, frequency, colors) {
        let bestColor = '';
        let bestMatchScore = Number.MAX_VALUE;

        for (let i = 0; i < colors.length; i++) {
            const color = colors[i];
            const [r, g, b] = this.colorService.hexToRgb(color);
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

    getColorFromFrequency(frequency, returnObject = false) {
        const hue = Math.round(frequency) % 360;
        const saturation = Math.max(30, Math.min(70, frequency * 2.5));
        const lightness = Math.max(10, Math.min(90, frequency * 1.5));
        const [red, green, blue] = this.colorService.hslToRgb(hue, saturation, lightness); // convert HSL to RGB values
        if (returnObject)
            return [red, green, blue];
        return `rgb(${red}, ${green}, ${blue})`;
    }
}