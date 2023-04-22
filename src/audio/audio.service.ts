import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { AllowedMimes, defaultIntervalCOunt as defaultIntervalCount } from 'src/Defaults/consts';
import { ConvertingType, Genre, Instrument, SaveAndReturnOption, Tempo } from 'src/Defaults/types';
import { AudioDto } from 'src/Model/Dto/Audio.dto';
import { EnergyOptionsDto } from 'src/Model/Dto/EnergyOptions.dto';
import { GenreOptionsDto } from 'src/Model/Dto/GenreOptions.dto';
import { InstrumentOptionsDto } from 'src/Model/Dto/InstrumentOptions.dto';
import { SynesthesiaOptionsDto } from 'src/Model/Dto/SynesthesiaOptions.dto';
import { TempoOptionsDto } from 'src/Model/Dto/TempoOptions.dto';
import { Audio } from 'src/Model/audio.schema';
import { Config } from 'src/Model/configs.schema';
import { User } from 'src/Model/user.schema';
import { ConfigService } from 'src/config/config.service';
import { MusicService } from 'src/services/music.service';
import fs from 'fs';
import { SentimentOptionsDto } from 'src/Model/Dto/SentimentOptions.dto';
import { AioOptionsDto } from 'src/Model/Dto/AioOptions.dto';
import { MetadataProcessingService } from 'src/services/metadata.service';

@Injectable()
export class AudioService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Config.name) private configModel: Model<Config>,
        @InjectModel(Audio.name) private audioModel: Model<Audio>,
        private musicService: MusicService,
        private configService: ConfigService,
        private metaDataService: MetadataProcessingService,

    ) { }

    async create(dto: AudioDto) {
        return (await this.audioModel.create(dto))._id;
    }

    async delete(id: string) {
        return (await this.audioModel.findByIdAndRemove(id))._id;
    }

    async generateBySynesthesia(options: SynesthesiaOptionsDto, audio: any) {
        let name: string = options.name;
        const type: ConvertingType = options.type;
        const saveAndReturnOption: SaveAndReturnOption = options.saveAndReturnOption;
        let user: ObjectId = options.user;
        let useIntervals: boolean = options.useIntervals;
        let intervalCount: number;
        let gradientSplitCount: number = options.gradientSplitCount;
        let useCustomFft: boolean = options.useCustomFft;

        if (useIntervals) {
            intervalCount = options.intervalCount;
            if (!intervalCount)
                intervalCount = defaultIntervalCount
        }

        let [frequency, amplitude, duration, intervalDuration] = await this.musicService.generateIntervalData(audio, type, intervalCount, useCustomFft);

        const data = this.musicService.generateBySynesthesia(frequency, amplitude, duration, intervalDuration, intervalCount, gradientSplitCount);

        const replaceData = JSON.stringify(data);
        const html = fs.readFileSync('./src/public/index.html', 'utf-8');
        const audioBuffer = audio.buffer.toString('base64');
        const audioMimeType = audio.mimetype;
        const audioSrc = `data:${audioMimeType};base64,${audioBuffer}`;

        let replacedhtml = html.replace('<script id="data">', `<script id="data">\n        const data = ${replaceData};`);
        const replacedHtml = replacedhtml.replace('audio.src = URL.createObjectURL(audioFile);', `audio.src = "${audioSrc}";`);

        switch (saveAndReturnOption) {
            case SaveAndReturnOption.SAVE_AND_RETURN_ID:
                return (await this.audioModel.create({ name, data, user }))._id;
            case SaveAndReturnOption.SAVE_AND_RETURN_DEMO:
                await this.audioModel.create({ name, data, user })
                return replacedHtml;
            case SaveAndReturnOption.RETURN_DEMO:
                return replacedHtml;
        }
    }

    async generateByGenre(options: GenreOptionsDto, audio: any) {
        let name: string = options.name;
        const type: ConvertingType = options.type;
        const saveAndReturnOption: SaveAndReturnOption = options.saveAndReturnOption;
        let user: ObjectId = options.user;
        let configId: string = options.config;
        let genre: Genre = options.genre;
        let useCustomFft: boolean = options.useCustomFft;

        let useIntervals: boolean = options.useIntervals;
        let intervalCount: number;

        if (useIntervals) {
            intervalCount = options.intervalCount;
            if (!intervalCount)
                intervalCount = defaultIntervalCount
        }

        let config;

        if (configId) {
            config = await this.configService.getConfig(configId);
        }

        //nullcheck
        let [frequency, amplitude, duration, intervalDuration] = await this.musicService.generateIntervalData(audio, type, intervalCount, useCustomFft);
        const data = this.musicService.generateByGenre(config, genre, frequency, amplitude, duration, intervalDuration, intervalCount);

        const replaceData = JSON.stringify(data);
        const html = fs.readFileSync('./src/public/index.html', 'utf-8');
        const audioBuffer = audio.buffer.toString('base64');
        const audioMimeType = audio.mimetype;
        const audioSrc = `data:${audioMimeType};base64,${audioBuffer}`;

        let replacedhtml = html.replace('<script id="data">', `<script id="data">\n        const data = ${replaceData};`);
        const replacedHtml = replacedhtml.replace('audio.src = URL.createObjectURL(audioFile);', `audio.src = "${audioSrc}";`);

        switch (saveAndReturnOption) {
            case SaveAndReturnOption.SAVE_AND_RETURN_ID:
                return (await this.audioModel.create({ name, data, user }))._id;
            case SaveAndReturnOption.SAVE_AND_RETURN_DEMO:
                await this.audioModel.create({ name, data, user })
                return replacedHtml;
            case SaveAndReturnOption.RETURN_DEMO:
                return replacedHtml;
        }
    }

    async generateByTempo(options: TempoOptionsDto, audio: any) {
        let name: string = options.name;
        const type: ConvertingType = options.type;
        const saveAndReturnOption: SaveAndReturnOption = options.saveAndReturnOption;
        let configId: string = options.config;
        let tempo: Tempo = options.tempo;
        let user: ObjectId = options.user;
        let useCustomFft: boolean = options.useCustomFft;

        let intervalCount: number = options.intervalCount;

        let config;

        if (configId) {
            config = await this.configService.getConfig(configId);
        }

        let [frequency, amplitude, intervalDuration, bpm] = await this.musicService.generateIntervalData(audio, type, intervalCount, useCustomFft);
        const data = this.musicService.generateByTempo(config, tempo, frequency, amplitude, intervalDuration, intervalCount, bpm);

        const replaceData = JSON.stringify(data);
        const html = fs.readFileSync('./src/public/index.html', 'utf-8');
        const audioBuffer = audio.buffer.toString('base64');
        const audioMimeType = audio.mimetype;
        const audioSrc = `data:${audioMimeType};base64,${audioBuffer}`;

        let replacedhtml = html.replace('<script id="data">', `<script id="data">\n        const data = ${replaceData};`);
        const replacedHtml = replacedhtml.replace('audio.src = URL.createObjectURL(audioFile);', `audio.src = "${audioSrc}";`);

        switch (saveAndReturnOption) {
            case SaveAndReturnOption.SAVE_AND_RETURN_ID:
                return (await this.audioModel.create({ name, data, user }))._id;
            case SaveAndReturnOption.SAVE_AND_RETURN_DEMO:
                await this.audioModel.create({ name, data, user })
                return replacedHtml;
            case SaveAndReturnOption.RETURN_DEMO:
                return replacedHtml;
        }
    }

    async generateByInstrument(options: InstrumentOptionsDto, audio: any) {
        let name: string = options.name;
        const type: ConvertingType = options.type;
        const saveAndReturnOption: SaveAndReturnOption = options.saveAndReturnOption;
        let useCustomFft: boolean = options.useCustomFft;

        let intervalCount: number = options.intervalCount;
        // let saturation: number = options.saturation;
        // let ligthness: number = options.ligthness;
        let configId: string = options.config;
        let user: ObjectId = options.user;
        let instrument: Instrument = options.instrument;

        let config;

        if (configId) {
            config = await this.configService.getConfig(configId);
        }

        let [amplitude, intervalDuration, pitch] = await this.musicService.generateIntervalData(audio, type, intervalCount, useCustomFft);
        const data = this.musicService.generateByInstrument(config, instrument, amplitude, pitch, intervalDuration, intervalCount);

        const replaceData = JSON.stringify(data);
        const html = fs.readFileSync('./src/public/index.html', 'utf-8');
        const audioBuffer = audio.buffer.toString('base64');
        const audioMimeType = audio.mimetype;
        const audioSrc = `data:${audioMimeType};base64,${audioBuffer}`;

        let replacedhtml = html.replace('<script id="data">', `<script id="data">\n        const data = ${replaceData};`);
        const replacedHtml = replacedhtml.replace('audio.src = URL.createObjectURL(audioFile);', `audio.src = "${audioSrc}";`);

        switch (saveAndReturnOption) {
            case SaveAndReturnOption.SAVE_AND_RETURN_ID:
                return (await this.audioModel.create({ name, data, user }))._id;
            case SaveAndReturnOption.SAVE_AND_RETURN_DEMO:
                await this.audioModel.create({ name, data, user })
                return replacedHtml;
            case SaveAndReturnOption.RETURN_DEMO:
                return replacedHtml;
        }
    }

    async generateByEnergy(options: EnergyOptionsDto, audio: any) {
        let name: string = options.name;
        const type: ConvertingType = options.type;
        let intervalCount: number = options.intervalCount;
        const saveAndReturnOption: SaveAndReturnOption = options.saveAndReturnOption;
        let useCustomFft: boolean = options.useCustomFft;

        let configId: string = options.config;
        let user: ObjectId = options.user;
        let config;

        if (configId) {
            config = await this.configService.getConfig(configId);
        }

        let [amplitude, intervalDuration] = await this.musicService.generateIntervalData(audio, type, intervalCount, useCustomFft);
        const data = await this.musicService.generateByEnergy(config, amplitude, intervalDuration, intervalCount);
        const replaceData = JSON.stringify(data);
        const html = fs.readFileSync('./src/public/index.html', 'utf-8');
        const audioBuffer = audio.buffer.toString('base64');
        const audioMimeType = audio.mimetype;
        const audioSrc = `data:${audioMimeType};base64,${audioBuffer}`;

        let replacedhtml = html.replace('<script id="data">', `<script id="data">\n        const data = ${replaceData};`);
        const replacedHtml = replacedhtml.replace('audio.src = URL.createObjectURL(audioFile);', `audio.src = "${audioSrc}";`);

        switch (saveAndReturnOption) {
            case SaveAndReturnOption.SAVE_AND_RETURN_ID:
                return (await this.audioModel.create({ name, data, user }))._id;
            case SaveAndReturnOption.SAVE_AND_RETURN_DEMO:
                await this.audioModel.create({ name, data, user })
                return replacedHtml;
            case SaveAndReturnOption.RETURN_DEMO:
                return replacedHtml;
        }
    }

    async generateBySentiment(options: SentimentOptionsDto, audio: any) {
        let name: string = options.name;
        const type: ConvertingType = options.type;
        let intervalCount: number = options.intervalCount;
        let familyCount: number = options.familyCount;
        let configId: string = options.config;
        const saveAndReturnOption: SaveAndReturnOption = options.saveAndReturnOption;
        let useCustomFft: boolean = options.useCustomFft;

        let user: ObjectId = options.user;
        let sentiment = options.sentiment;
        let config;

        if (configId) {
            config = await this.configService.getConfig(configId);
        }

        if (!sentiment && !config)
            [, , sentiment] = (await this.metaDataService.getMetadata(audio));

        let [amplitude, intervalDuration] = await this.musicService.generateIntervalData(audio, type, intervalCount, useCustomFft);

        const data = await this.musicService.generateBySentiment(config, sentiment, amplitude, intervalDuration, intervalCount, familyCount);
        const replaceData = JSON.stringify(data);
        const html = fs.readFileSync('./src/public/index.html', 'utf-8');
        const audioBuffer = audio.buffer.toString('base64');
        const audioMimeType = audio.mimetype;
        const audioSrc = `data:${audioMimeType};base64,${audioBuffer}`;

        let replacedhtml = html.replace('<script id="data">', `<script id="data">\n        const data = ${replaceData};`);
        const replacedHtml = replacedhtml.replace('audio.src = URL.createObjectURL(audioFile);', `audio.src = "${audioSrc}";`);

        switch (saveAndReturnOption) {
            case SaveAndReturnOption.SAVE_AND_RETURN_ID:
                return (await this.audioModel.create({ name, data, user }))._id;
            case SaveAndReturnOption.SAVE_AND_RETURN_DEMO:
                await this.audioModel.create({ name, data, user })
                return replacedHtml;
            case SaveAndReturnOption.RETURN_DEMO:
                return replacedHtml;
        }
    }

    async generateByAio(options: AioOptionsDto, audio: any) {
        let name: string = options.name;
        const type: ConvertingType = options.type;
        const saveAndReturnOption: SaveAndReturnOption = options.saveAndReturnOption;
        let user: ObjectId = options.user;
        let configId: string = options.config;
        let useIntervals: boolean = options.useIntervals;
        let intervalCount: number = options.intervalCount;
        let familyCount: number = options.familyCount;
        let gradientSplitCount: number = options.gradientSplitCount;
        let genre = options.genre;
        let instrument = options.instrument;
        let tempo = options.tempo;
        let sentiment = options.sentiment;
        let useCustomFft: boolean = options.useCustomFft;

        // let config;

        // if (configId) {
        //     config = await this.configService.getConfig(configId);
        // }

        if (!sentiment)//&& !config)
            [, , sentiment] = (await this.metaDataService.getMetadata(audio));

        let [frequency, amplitude, duration, intervalDuration, bpm, pitch] = await this.musicService.generateIntervalData(audio, type, intervalCount, useCustomFft);

        const data = this.musicService.generateByAio(intervalCount, intervalDuration, frequency, amplitude, pitch, bpm, sentiment);
        //        console.log(data)
        const replaceData = JSON.stringify(data);
        const html = fs.readFileSync('./src/public/index.html', 'utf-8');
        const audioBuffer = audio.buffer.toString('base64');
        const audioMimeType = audio.mimetype;
        const audioSrc = `data:${audioMimeType};base64,${audioBuffer}`;

        let replacedhtml = html.replace('<script id="data">', `<script id="data">\n        const data = ${replaceData};`);
        const replacedHtml = replacedhtml.replace('audio.src = URL.createObjectURL(audioFile);', `audio.src = "${audioSrc}";`);

        switch (saveAndReturnOption) {
            case SaveAndReturnOption.SAVE_AND_RETURN_ID:
                return (await this.audioModel.create({ name, data, user }))._id;
            case SaveAndReturnOption.SAVE_AND_RETURN_DEMO:
                await this.audioModel.create({ name, data, user })
                return replacedHtml;
            case SaveAndReturnOption.RETURN_DEMO:
                return replacedHtml;
        }
    }

    checkAttr(mimetype, originalname) {
        if (!AllowedMimes.includes(mimetype)) {
            return `pls send me audio,you send:${mimetype}`;
        }
        let fileAttributes = originalname.split('.');
        let fileAttribute = fileAttributes[fileAttributes.length - 1];
        if (fileAttribute != 'mp3') {
            return `invalid file type:${fileAttribute}`;
        }

        return 'isOk';
    }

    async isExist(id: string): Promise<boolean> {
        const count = await this.audioModel.countDocuments({ _id: id }).exec();
        return count > 0;
    }

    // async test(audio: any) {
    //     let decoded = await this.audioProcessingService.decodeAudio(audio)
    //     // const N = decoded.length;
    //     // const real = new Float64Array(N);
    //     // const imag = new Float64Array(N);

    //     // // calculate the real and imaginary parts of the signal's frequency domain representation
    //     // for (let k = 0; k < N; k++) {
    //     //     let re = 0;
    //     //     let im = 0;
    //     //     for (let n = 0; n < N; n++) {
    //     //         const theta = 2 * Math.PI * k * n / N;
    //     //         re += decoded[n] * Math.cos(theta);
    //     //         im -= decoded[n] * Math.sin(theta);
    //     //     }
    //     //     //return { re, im };
    //     //     real[k] = re;
    //     //     imag[k] = im;
    //     // }

    //     // return { real, imag };
    //     const asd = this.audioProcessingService.fft(decoded._channelData[0])
    //     //, decoded.sampleRate);
    //     return asd.real.length
    // }


    // async test2(audio: any) {
    //     let decoded = await this.audioProcessingService.decodeAudio(audio);

    //     const fft = this.audioProcessingService.getFft(decoded);

    //     //console.log(fft)

    //     return
    // }

}