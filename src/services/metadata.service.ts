import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { OtherProcessingService } from './other.service';
import { AudioProcessingService } from './audio.service';


@Injectable()
export class MetadataProcessingService {
    constructor(
        private audioService: AudioProcessingService,
        private other: OtherProcessingService

    ) {

    }
    async requestToShazam(decodeAudio: any) {

        const rawData = await this.audioService.convertAudioBufferToRawPcm(decodeAudio.buffer);

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
        let data;
        if (text == null || text.length == 0)
            data = await this.requestToShazam(decodeAudio);
        else return await this.searchMetadataBytext(text);
        if (!data)
            return;

        const genres = data.track ? data.track?.genres : "OTHER";
        const words = data.track?.sections[1].text;
        const sentiment = words ? this.other.sentimentFromWords(this.other.extractUniqueWords(words)).sentiment : "OTHER";
        const name = data.track ? data.track?.share.subject : "OTHER";

        return [name, genres, sentiment.toUpperCase()];
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
}