import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { AllowedMimes } from 'src/Defaults/consts';
import { ConvertingType, Genre } from 'src/Defaults/types';
import { AudioDto } from 'src/Model/Dto/Audio.dto';
import { SynesthesiaOptionsDto } from 'src/Model/Dto/SynesthesiaOptions.dto';
import { Audio } from 'src/Model/audio.schema';
import { Config } from 'src/Model/configs.schema';
import { User } from 'src/Model/user.schema';
import { ConfigService } from 'src/config/config.service';
import { MusicService } from 'src/services/music.service';

@Injectable()
export class AudioService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Config.name) private configModel: Model<Config>,
        @InjectModel(Audio.name) private audioModel: Model<Audio>,
        private musicService: MusicService,
        private configService: ConfigService

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
        let intervalCount: number;
        let useIntervals: boolean = options.useIntervals;
        let user: ObjectId = options.user;

        if (useIntervals) {
            intervalCount = options.intervalCount;
        }

        let [frequency, amplitude, duration, intervalDuration] = await this.musicService.generateIntervalData(audio, type, intervalCount);

        const data = this.musicService.generateBySynesthesia(frequency, amplitude, duration, intervalDuration, intervalCount);

        return (await this.audioModel.create({ name, data, user }))._id;

    }

    async generateByGenre(options: SynesthesiaOptionsDto, audio: any) {
        let name: string = options.name;
        const type: ConvertingType = options.type;
        let useIntervals: boolean = options.useIntervals;
        let user: ObjectId = options.user;
        let intervalCount: number;
        let configId: ObjectId = options.config;
        let genre: Genre;
        // let saturation: number = options.saturation;
        // let ligthness: number = options.ligthness;

        if (useIntervals) {
            intervalCount = options.intervalCount;
        }

        let config;

        if (configId) {
            config = this.configService.getConfig(configId);
        }

        let [frequency, amplitude, duration, intervalDuration] = await this.musicService.generateIntervalData(audio, type, intervalCount);
        const data = this.musicService.generateByGenre(config, genre, frequency, amplitude, duration, intervalDuration, intervalCount);

        return (await this.audioModel.create({ name, data, user }))._id;
    }

    async generateByTempo(options: SynesthesiaOptionsDto, audio: any) {
        let name: string = options.name;
        const type: ConvertingType = options.type;
        let intervalCount: number;
        let useIntervals: boolean = options.useIntervals;
        // let saturation: number = options.saturation;
        // let ligthness: number = options.ligthness;
        let config: ObjectId = options.config;
        let user: ObjectId = options.user;

        if (useIntervals) {
            intervalCount = options.intervalCount;
        }

        let [frequency, amplitude, intervalDuration, bpm] = await this.musicService.generateIntervalData(audio, type, intervalCount);
        const data = this.musicService.generateByTempo(frequency, amplitude, intervalDuration, intervalCount, bpm);

        return (await this.audioModel.create({ name, data, user }))._id;
    }

    async generateByInstrument(options: SynesthesiaOptionsDto, audio: any) {
        let name: string = options.name;
        const type: ConvertingType = options.type;
        let intervalCount: number;
        let useIntervals: boolean = options.useIntervals;
        // let saturation: number = options.saturation;
        // let ligthness: number = options.ligthness;
        let config: ObjectId = options.config;
        let user: ObjectId = options.user;

        if (useIntervals) {
            intervalCount = options.intervalCount;
        }

        let [amplitude, intervalDuration, pitch] = await this.musicService.generateIntervalData(audio, type, intervalCount);
        const data = this.musicService.generateByInstrument(amplitude, pitch, intervalDuration, intervalCount);

        return (await this.audioModel.create({ name, data, user }))._id;
    }

    async generateByEnergy(options: SynesthesiaOptionsDto, audio: any) {
        let name: string = options.name;
        const type: ConvertingType = options.type;
        let intervalCount: number;
        let useIntervals: boolean = options.useIntervals;
        // let saturation: number = options.saturation;
        //  let ligthness: number = options.ligthness;
        let config: ObjectId = options.config;
        let user: ObjectId = options.user;

        if (useIntervals) {
            intervalCount = options.intervalCount;
        }

        let [amplitude, intervalDuration] = await this.musicService.generateIntervalData(audio, type, intervalCount);
        const data = this.musicService.generateByEnergy(amplitude, intervalDuration, intervalCount);

        return (await this.audioModel.create({ name, data, user }))._id;
    }

    async generateBySentiment(options: SynesthesiaOptionsDto, audio: any) {
        let name: string = options.name;
        const type: ConvertingType = options.type;
        let intervalCount: number;
        let useIntervals: boolean = options.useIntervals;
        // let saturation: number = options.saturation;
        // let ligthness: number = options.ligthness;
        let config: ObjectId = options.config;
        let user: ObjectId = options.user;

        if (useIntervals) {
            intervalCount = options.intervalCount;
        }

        const [sentiment] = (await this.musicService.getMetadata(audio));
        let [frequency, intervalDuration] = await this.musicService.generateIntervalData(audio, type, intervalCount);

        const data = this.musicService.generateBySentiment(frequency, sentiment, intervalDuration, intervalCount);

        return (await this.audioModel.create({ name, data, user }))._id;
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
}
