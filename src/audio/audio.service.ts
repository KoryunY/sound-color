import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types, isValidObjectId } from 'mongoose';
import { AllowedFileAttributes, AllowedMimes, defaultIntervalCOunt as defaultIntervalCount } from 'src/defaults/consts';
import { ConvertingType, Genre, Instrument, SaveAndReturnOption, Tempo } from '../defaults/types';
import { AudioDto } from 'src/Model/dto/Audio.dto';
import { EnergyOptionsDto } from 'src/Model/dto/EnergyOptions.dto';
import { GenreOptionsDto } from 'src/Model/dto/GenreOptions.dto';
import { InstrumentOptionsDto } from 'src/Model/dto/InstrumentOptions.dto';
import { FrequencyOptionsDto } from 'src/Model/Dto/FrequencyOptions.dto';
import { TempoOptionsDto } from 'src/Model/dto/TempoOptions.dto';
import { Audio } from 'src/Model/audio.schema';
import { Config } from 'src/Model/configs.schema';
import { User } from 'src/Model/user.schema';
import { ConfigService } from 'src/config/config.service';
import { MusicService } from 'src/services/music.service';
import fs from 'fs';
import { SentimentOptionsDto } from 'src/Model/dto/SentimentOptions.dto';
import { AioOptionsDto } from 'src/Model/dto/AioOptions.dto';
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
        try {
            const audio = await this.audioModel.create(dto);
            return audio ? audio._id : "Somethign Went wrong";
        } catch (error) { return error.message; }
    }

    async delete(id: string) {
        if (!Types.ObjectId.isValid(id))
            return 'invalid object id type';
        try {
            const removeAudio = await this.audioModel.findByIdAndRemove(id);
            if (removeAudio) {
                // Remove the config ID from the user's config array
                await this.userModel.updateOne(
                    { _id: removeAudio.user },
                    { $pull: { configs: removeAudio._id } },
                ).exec();
            }
        } catch (error) { return error.message; }
    }

    async find(id: string) {
        if (!Types.ObjectId.isValid(id))
            return 'invalid object id type';

        return await this.audioModel.findById(id);
    }

    async generateByFrequency(options: FrequencyOptionsDto, audio: any) {
        try {
            let name: string = options.name;
            const type: ConvertingType = options.type;
            const saveAndReturnOption: SaveAndReturnOption = options.saveAndReturnOption;
            let user: ObjectId = options.user;
            let useIntervals: boolean = options.useIntervals;
            let intervalCount: number;
            let gradientSplitCount: number = options.gradientSplitCount;
            let useCustomFft: boolean = options.useCustomFft;
            let id;

            if (useIntervals) {
                intervalCount = options.intervalCount;
                if (!intervalCount)
                    intervalCount = defaultIntervalCount
            }

            let [frequency, amplitude, duration, intervalDuration] = await this.musicService.generateIntervalData(audio, type, intervalCount, useCustomFft);

            const data = this.musicService.generateByFrequency(frequency, amplitude, duration, intervalDuration, intervalCount, gradientSplitCount);

            const replaceData = JSON.stringify(data);
            const html = fs.readFileSync('./src/public/index.html', 'utf-8');

            const audioBuffer = audio.buffer.toString('base64');
            const audioMimeType = audio.mimetype == 'audio/wave' ? 'audio/wav' : audio.mimetype;
            const audioSrc = `data:${audioMimeType};base64,${audioBuffer}`;

            let replacedhtml = html.replace('<script id="data">', `<script id="data">\n        const data = ${replaceData};`);
            const replacedHtml = replacedhtml.replace('audio.src = URL.createObjectURL(audioFile);', `audio.src = "${audioSrc}";`);

            const averageObjectSizeInBytes = 100; // Set an average size for each object in bytes
            const dataSizeInBytes = data.length * averageObjectSizeInBytes;
            const dataSizeInMB = (dataSizeInBytes / 1048576).toFixed(2);
            const averageCharacterSizeInBytes = 0.5; // Adjust this value as needed
            const htmlSizeInBytes = replacedHtml.length * averageCharacterSizeInBytes;
            const htmlSizeInMB = (htmlSizeInBytes / (1024 * 1024)).toFixed(2);

            let userModel;
            switch (saveAndReturnOption) {
                case SaveAndReturnOption.SAVE_AND_RETURN_ID:
                    if (parseInt(dataSizeInMB) > 10) throw new Error("maximum size reached");
                    id = (await this.audioModel.create({ name, data, user }))._id;
                    userModel = await this.userModel.findById(user);
                    userModel.audios.push(id)
                    await userModel.save();
                    return id;
                case SaveAndReturnOption.SAVE_AND_RETURN_DEMO:
                    if (parseInt(dataSizeInMB) > 10) throw new Error("maximum size reached");
                    id = (await this.audioModel.create({ name, data, user }))._id;
                    userModel = await this.userModel.findById(user);
                    userModel.audios.push(id)
                    await userModel.save();
                    return replacedHtml;
                case SaveAndReturnOption.RETURN_DEMO:
                    if (parseInt(htmlSizeInMB) >= 50) throw new Error("maximum size reached");
                    return replacedHtml;
                default:
                    throw new Error("Unhandled Return Type");
            }
        } catch (err) {
            return err.message;
        }
    }

    async generateByGenre(options: GenreOptionsDto, audio: any) {
        try {
            let name: string = options.name;
            const type: ConvertingType = options.type;
            const saveAndReturnOption: SaveAndReturnOption = options.saveAndReturnOption;
            let user: ObjectId = options.user;
            let configId: string = options.config;
            let genre: Genre = options.genre;
            let useCustomFft: boolean = options.useCustomFft;
            let id;

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

            let [frequency, amplitude, duration, intervalDuration] = await this.musicService.generateIntervalData(audio, type, intervalCount, useCustomFft);
            const data = this.musicService.generateByGenre(config, genre, frequency, amplitude, duration, intervalDuration, intervalCount);

            const replaceData = JSON.stringify(data);
            const html = fs.readFileSync('./src/public/index.html', 'utf-8');
            const audioBuffer = audio.buffer.toString('base64');
            const audioMimeType = audio.mimetype == 'audio/wave' ? 'audio/wav' : audio.mimetype;
            const audioSrc = `data:${audioMimeType};base64,${audioBuffer}`;

            let replacedhtml = html.replace('<script id="data">', `<script id="data">\n        const data = ${replaceData};`);
            const replacedHtml = replacedhtml.replace('audio.src = URL.createObjectURL(audioFile);', `audio.src = "${audioSrc}";`);

            const averageObjectSizeInBytes = 100; // Set an average size for each object in bytes
            const dataSizeInBytes = data.length * averageObjectSizeInBytes;
            const dataSizeInMB = (dataSizeInBytes / 1048576).toFixed(2);
            const averageCharacterSizeInBytes = 0.5; // Adjust this value as needed
            const htmlSizeInBytes = replacedHtml.length * averageCharacterSizeInBytes;
            const htmlSizeInMB = (htmlSizeInBytes / (1024 * 1024)).toFixed(2);

            let userModel;
            switch (saveAndReturnOption) {
                case SaveAndReturnOption.SAVE_AND_RETURN_ID:
                    if (parseInt(dataSizeInMB) > 10) throw new Error("maximum size reached");
                    id = (await this.audioModel.create({ name, data, user }))._id;
                    userModel = await this.userModel.findById(user);
                    userModel.audios.push(id)
                    await userModel.save();
                    return id;
                case SaveAndReturnOption.SAVE_AND_RETURN_DEMO:
                    if (parseInt(dataSizeInMB) > 10) throw new Error("maximum size reached");
                    id = (await this.audioModel.create({ name, data, user }))._id;
                    userModel = await this.userModel.findById(user);
                    userModel.audios.push(id)
                    await userModel.save();
                    return replacedHtml;
                case SaveAndReturnOption.RETURN_DEMO:
                    if (parseInt(htmlSizeInMB) >= 50) throw new Error("maximum size reached");
                    return replacedHtml;
                default:
                    throw new Error("Unhandled Return Type");
            }
        } catch (err) {
            return err.message;
        }
    }

    async generateByTempo(options: TempoOptionsDto, audio: any) {
        try {
            let name: string = options.name;
            const type: ConvertingType = options.type;
            const saveAndReturnOption: SaveAndReturnOption = options.saveAndReturnOption;
            let configId: string = options.config;
            let tempo: Tempo = options.tempo;
            let user: ObjectId = options.user;
            let useCustomFft: boolean = options.useCustomFft;
            let id;

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
            const audioMimeType = audio.mimetype == 'audio/wave' ? 'audio/wav' : audio.mimetype;
            const audioSrc = `data:${audioMimeType};base64,${audioBuffer}`;

            let replacedhtml = html.replace('<script id="data">', `<script id="data">\n        const data = ${replaceData};`);
            const replacedHtml = replacedhtml.replace('audio.src = URL.createObjectURL(audioFile);', `audio.src = "${audioSrc}";`);

            const averageObjectSizeInBytes = 100; // Set an average size for each object in bytes
            const dataSizeInBytes = data.length * averageObjectSizeInBytes;
            const dataSizeInMB = (dataSizeInBytes / 1048576).toFixed(2);
            const averageCharacterSizeInBytes = 0.5; // Adjust this value as needed
            const htmlSizeInBytes = replacedHtml.length * averageCharacterSizeInBytes;
            const htmlSizeInMB = (htmlSizeInBytes / (1024 * 1024)).toFixed(2);

            let userModel;
            switch (saveAndReturnOption) {
                case SaveAndReturnOption.SAVE_AND_RETURN_ID:
                    if (parseInt(dataSizeInMB) > 10) throw new Error("maximum size reached");
                    id = (await this.audioModel.create({ name, data, user }))._id;
                    userModel = await this.userModel.findById(user);
                    userModel.audios.push(id)
                    await userModel.save();
                    return id;
                case SaveAndReturnOption.SAVE_AND_RETURN_DEMO:
                    if (parseInt(dataSizeInMB) > 10) throw new Error("maximum size reached");
                    id = (await this.audioModel.create({ name, data, user }))._id;
                    userModel = await this.userModel.findById(user);
                    userModel.audios.push(id)
                    await userModel.save();
                    return replacedHtml;
                case SaveAndReturnOption.RETURN_DEMO:
                    if (parseInt(htmlSizeInMB) >= 50) throw new Error("maximum size reached");
                    return replacedHtml;
                default:
                    throw new Error("Unhandled Return Type");
            }
        } catch (err) {
            return err.message;
        }
    }

    async generateByInstrument(options: InstrumentOptionsDto, audio: any) {
        try {
            let name: string = options.name;
            const type: ConvertingType = options.type;
            const saveAndReturnOption: SaveAndReturnOption = options.saveAndReturnOption;
            let useCustomFft: boolean = options.useCustomFft;

            let intervalCount: number = options.intervalCount;
            let configId: string = options.config;
            let user: ObjectId = options.user;
            let instrument: Instrument = options.instrument;
            let id;

            let config;

            if (configId) {
                config = await this.configService.getConfig(configId);
            }

            let [amplitude, intervalDuration, pitch] = await this.musicService.generateIntervalData(audio, type, intervalCount, useCustomFft);
            const data = this.musicService.generateByInstrument(config, instrument, amplitude, pitch, intervalDuration, intervalCount);

            const replaceData = JSON.stringify(data);
            const html = fs.readFileSync('./src/public/index.html', 'utf-8');
            const audioBuffer = audio.buffer.toString('base64');
            const audioMimeType = audio.mimetype == 'audio/wave' ? 'audio/wav' : audio.mimetype;
            const audioSrc = `data:${audioMimeType};base64,${audioBuffer}`;

            let replacedhtml = html.replace('<script id="data">', `<script id="data">\n        const data = ${replaceData};`);
            const replacedHtml = replacedhtml.replace('audio.src = URL.createObjectURL(audioFile);', `audio.src = "${audioSrc}";`);

            const averageObjectSizeInBytes = 100; // Set an average size for each object in bytes
            const dataSizeInBytes = data.length * averageObjectSizeInBytes;
            const dataSizeInMB = (dataSizeInBytes / 1048576).toFixed(2);
            const averageCharacterSizeInBytes = 0.5; // Adjust this value as needed
            const htmlSizeInBytes = replacedHtml.length * averageCharacterSizeInBytes;
            const htmlSizeInMB = (htmlSizeInBytes / (1024 * 1024)).toFixed(2);

            let userModel;
            switch (saveAndReturnOption) {
                case SaveAndReturnOption.SAVE_AND_RETURN_ID:
                    if (parseInt(dataSizeInMB) > 10) throw new Error("maximum size reached");
                    id = (await this.audioModel.create({ name, data, user }))._id;
                    userModel = await this.userModel.findById(user);
                    userModel.audios.push(id)
                    await userModel.save();
                    return id;
                case SaveAndReturnOption.SAVE_AND_RETURN_DEMO:
                    if (parseInt(dataSizeInMB) > 10) throw new Error("maximum size reached");
                    id = (await this.audioModel.create({ name, data, user }))._id;
                    userModel = await this.userModel.findById(user);
                    userModel.audios.push(id)
                    await userModel.save();
                    return replacedHtml;
                case SaveAndReturnOption.RETURN_DEMO:
                    if (parseInt(htmlSizeInMB) >= 50) throw new Error("maximum size reached");
                    return replacedHtml;
                default:
                    throw new Error("Unhandled Return Type");
            }
        } catch (err) {
            return err.message;
        }
    }

    async generateByEnergy(options: EnergyOptionsDto, audio: any) {
        try {
            let name: string = options.name;
            const type: ConvertingType = options.type;
            let intervalCount: number = options.intervalCount;
            const saveAndReturnOption: SaveAndReturnOption = options.saveAndReturnOption;
            let useCustomFft: boolean = options.useCustomFft;

            let configId: string = options.config;
            let user: ObjectId = options.user;
            let config;
            let id;

            if (configId) {
                config = await this.configService.getConfig(configId);
            }

            let [amplitude, intervalDuration] = await this.musicService.generateIntervalData(audio, type, intervalCount, useCustomFft);
            const data = await this.musicService.generateByEnergy(config, amplitude, intervalDuration, intervalCount);
            const replaceData = JSON.stringify(data);
            const html = fs.readFileSync('./src/public/index.html', 'utf-8');
            const audioBuffer = audio.buffer.toString('base64');
            const audioMimeType = audio.mimetype == 'audio/wave' ? 'audio/wav' : audio.mimetype;
            const audioSrc = `data:${audioMimeType};base64,${audioBuffer}`;

            let replacedhtml = html.replace('<script id="data">', `<script id="data">\n        const data = ${replaceData};`);
            const replacedHtml = replacedhtml.replace('audio.src = URL.createObjectURL(audioFile);', `audio.src = "${audioSrc}";`);

            const averageObjectSizeInBytes = 100; // Set an average size for each object in bytes
            const dataSizeInBytes = data.length * averageObjectSizeInBytes;
            const dataSizeInMB = (dataSizeInBytes / 1048576).toFixed(2);
            const averageCharacterSizeInBytes = 0.5; // Adjust this value as needed
            const htmlSizeInBytes = replacedHtml.length * averageCharacterSizeInBytes;
            const htmlSizeInMB = (htmlSizeInBytes / (1024 * 1024)).toFixed(2);

            let userModel;
            switch (saveAndReturnOption) {
                case SaveAndReturnOption.SAVE_AND_RETURN_ID:
                    if (parseInt(dataSizeInMB) > 10) throw new Error("maximum size reached");
                    id = (await this.audioModel.create({ name, data, user }))._id;
                    userModel = await this.userModel.findById(user);
                    userModel.audios.push(id)
                    await userModel.save();
                    return id;
                case SaveAndReturnOption.SAVE_AND_RETURN_DEMO:
                    if (parseInt(dataSizeInMB) > 10) throw new Error("maximum size reached");
                    id = (await this.audioModel.create({ name, data, user }))._id;
                    userModel = await this.userModel.findById(user);
                    userModel.audios.push(id)
                    await userModel.save();
                    return replacedHtml;
                case SaveAndReturnOption.RETURN_DEMO:
                    if (parseInt(htmlSizeInMB) >= 50) throw new Error("maximum size reached");
                    return replacedHtml;
                default:
                    throw new Error("Unhandled Return Type");
            }
        } catch (err) {
            return err.message;
        }
    }

    async generateBySentiment(options: SentimentOptionsDto, audio: any) {
        try {
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
            let id;

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
            const audioMimeType = audio.mimetype == 'audio/wave' ? 'audio/wav' : audio.mimetype;
            const audioSrc = `data:${audioMimeType};base64,${audioBuffer}`;

            let replacedhtml = html.replace('<script id="data">', `<script id="data">\n        const data = ${replaceData};`);
            const replacedHtml = replacedhtml.replace('audio.src = URL.createObjectURL(audioFile);', `audio.src = "${audioSrc}";`);

            const averageObjectSizeInBytes = 100; // Set an average size for each object in bytes
            const dataSizeInBytes = data.length * averageObjectSizeInBytes;
            const dataSizeInMB = (dataSizeInBytes / 1048576).toFixed(2);
            const averageCharacterSizeInBytes = 0.5; // Adjust this value as needed
            const htmlSizeInBytes = replacedHtml.length * averageCharacterSizeInBytes;
            const htmlSizeInMB = (htmlSizeInBytes / (1024 * 1024)).toFixed(2);

            let userModel;
            switch (saveAndReturnOption) {
                case SaveAndReturnOption.SAVE_AND_RETURN_ID:
                    if (parseInt(dataSizeInMB) > 10) throw new Error("maximum size reached");
                    id = (await this.audioModel.create({ name, data, user }))._id;
                    userModel = await this.userModel.findById(user);
                    userModel.audios.push(id)
                    await userModel.save();
                    return id;
                case SaveAndReturnOption.SAVE_AND_RETURN_DEMO:
                    if (parseInt(dataSizeInMB) > 10) throw new Error("maximum size reached");
                    id = (await this.audioModel.create({ name, data, user }))._id;
                    userModel = await this.userModel.findById(user);
                    userModel.audios.push(id)
                    await userModel.save();
                    return replacedHtml;
                case SaveAndReturnOption.RETURN_DEMO:
                    if (parseInt(htmlSizeInMB) >= 50) throw new Error("maximum size reached");
                    return replacedHtml;
                default:
                    throw new Error("Unhandled Return Type");
            }
        } catch (err) {
            return err.message;
        }
    }

    async generateByAio(options: AioOptionsDto, audio: any) {
        try {
            let name: string = options.name;
            const type: ConvertingType = options.type;
            const saveAndReturnOption: SaveAndReturnOption = options.saveAndReturnOption;
            let user: ObjectId = options.user;
            let intervalCount: number = options.intervalCount;
            let sentiment = options.sentiment;
            let useCustomFft: boolean = options.useCustomFft;
            let id;

            if (!sentiment)
                [, , sentiment] = (await this.metaDataService.getMetadata(audio));

            let [frequency, amplitude, duration, intervalDuration, bpm, pitch] = await this.musicService.generateIntervalData(audio, type, intervalCount, useCustomFft);
            const data = this.musicService.generateByAio(intervalCount, intervalDuration, frequency, amplitude, pitch, bpm, sentiment);
            const replaceData = JSON.stringify(data);

            const html = fs.readFileSync('./src/public/index.html', 'utf-8');
            const audioBuffer = audio.buffer.toString('base64');
            const audioMimeType = audio.mimetype == 'audio/wave' ? 'audio/wav' : audio.mimetype;
            const audioSrc = `data:${audioMimeType};base64,${audioBuffer}`;

            let replacedhtml = html.replace('<script id="data">', `<script id="data">\n        const data = ${replaceData};`);
            const replacedHtml = replacedhtml.replace('audio.src = URL.createObjectURL(audioFile);', `audio.src = "${audioSrc}";`);

            const averageObjectSizeInBytes = 100; // Set an average size for each object in bytes
            const dataSizeInBytes = data.length * averageObjectSizeInBytes;
            const dataSizeInMB = (dataSizeInBytes / 1048576).toFixed(2);
            const averageCharacterSizeInBytes = 0.5; // Adjust this value as needed
            const htmlSizeInBytes = replacedHtml.length * averageCharacterSizeInBytes;
            const htmlSizeInMB = (htmlSizeInBytes / (1024 * 1024)).toFixed(2);

            let userModel;
            switch (saveAndReturnOption) {
                case SaveAndReturnOption.SAVE_AND_RETURN_ID:
                    if (parseInt(dataSizeInMB) > 10) throw new Error("maximum size reached");
                    id = (await this.audioModel.create({ name, data, user }))._id;
                    userModel = await this.userModel.findById(user);
                    userModel.audios.push(id)
                    await userModel.save();
                    return id;
                case SaveAndReturnOption.SAVE_AND_RETURN_DEMO:
                    if (parseInt(dataSizeInMB) > 10) throw new Error("maximum size reached");
                    id = (await this.audioModel.create({ name, data, user }))._id;
                    userModel = await this.userModel.findById(user);
                    userModel.audios.push(id)
                    await userModel.save();
                    return replacedHtml;
                case SaveAndReturnOption.RETURN_DEMO:
                    if (parseInt(htmlSizeInMB) >= 50) throw new Error("maximum size reached");
                    return replacedHtml;
                default:
                    throw new Error("Unhandled Return Type");
            }
        } catch (err) {
            return err.message;
        }
    }

    checkAttr(mimetype, originalname) {
        if (!AllowedMimes.includes(mimetype)) {
            return `pls send me audio,you send:${mimetype}`;
        }
        let fileAttributes = originalname.split('.');
        let fileAttribute = fileAttributes[fileAttributes.length - 1];
        if (!AllowedFileAttributes.includes(fileAttribute)) {
            return `invalid file type:${fileAttribute}`;
        }

        return 'isOk';
    }
    async generateHtml(data: any, audio: any) {
        try {
            const html = fs.readFileSync('./src/public/index.html', 'utf-8');
            const audioBuffer = audio.buffer.toString('base64');
            const audioMimeType = audio.mimetype == 'audio/wave' ? 'audio/wav' : audio.mimetype;
            const audioSrc = `data:${audioMimeType};base64,${audioBuffer}`;

            let replacedhtml = html.replace('<script id="data">', `<script id="data">\n        const data = ${data};`);
            const replacedHtml = replacedhtml.replace('audio.src = URL.createObjectURL(audioFile);', `audio.src = "${audioSrc}";`);

            return replacedHtml;
        }
        catch (err) {
            return err.message
        }
    }


    async isExist(id: string) {
        if (!Types.ObjectId.isValid(id))
            return 'invalid object id type';

        const count = await this.audioModel.countDocuments({ _id: id }).exec();
        return count > 0;
    }
}