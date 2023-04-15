import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { AllowedMimes } from 'src/Defaults/consts';
import { ConvertingType, Energy, Genre, Instrument, Tempo } from 'src/Defaults/types';
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

    async generateByGenre(options: GenreOptionsDto, audio: any) {
        let name: string = options.name;
        const type: ConvertingType = options.type;
        let useIntervals: boolean = options.useIntervals;
        let user: ObjectId = options.user;
        let intervalCount: number;
        let configId: string = options.config;
        let genre: Genre = options.genre;
        // let saturation: number = options.saturation;
        // let ligthness: number = options.ligthness;

        if (useIntervals) {
            intervalCount = options.intervalCount;
        }

        let config;

        if (configId) {
            config = this.configService.getConfig(configId);
        }

        //if()

        let [frequency, amplitude, duration, intervalDuration] = await this.musicService.generateIntervalData(audio, type, intervalCount);
        const data = this.musicService.generateByGenre(config, genre, frequency, amplitude, duration, intervalDuration, intervalCount);

        return (await this.audioModel.create({ name, data, user }))._id;
    }

    async generateByTempo(options: TempoOptionsDto, audio: any) {
        let name: string = options.name;
        const type: ConvertingType = options.type;
        let intervalCount: number;
        let useIntervals: boolean = options.useIntervals;
        // let saturation: number = options.saturation;
        // let ligthness: number = options.ligthness;
        let configId: string = options.config;
        let tempo: Tempo = options.tempo;
        let user: ObjectId = options.user;

        if (useIntervals) {
            intervalCount = options.intervalCount;
        }

        let config;

        if (configId) {
            config = this.configService.getConfig(configId);
        }

        let [frequency, amplitude, intervalDuration, bpm] = await this.musicService.generateIntervalData(audio, type, intervalCount);
        const data = this.musicService.generateByTempo(config, tempo, frequency, amplitude, intervalDuration, intervalCount, bpm);

        return (await this.audioModel.create({ name, data, user }))._id;
    }

    async generateByInstrument(options: InstrumentOptionsDto, audio: any) {
        let name: string = options.name;
        const type: ConvertingType = options.type;
        let intervalCount: number;
        let useIntervals: boolean = options.useIntervals;
        // let saturation: number = options.saturation;
        // let ligthness: number = options.ligthness;
        let configId: string = options.config;
        let user: ObjectId = options.user;
        let instrument: Instrument = options.instrument;

        if (useIntervals) {
            intervalCount = options.intervalCount;
        }

        let config;

        if (configId) {
            config = this.configService.getConfig(configId);
        }

        let [amplitude, intervalDuration, pitch] = await this.musicService.generateIntervalData(audio, type, intervalCount);
        const data = this.musicService.generateByInstrument(config, instrument, amplitude, pitch, intervalDuration, intervalCount);

        return (await this.audioModel.create({ name, data, user }))._id;
    }

    async generateByEnergy(options: EnergyOptionsDto, audio: any) {
        let name: string = options.name;
        const type: ConvertingType = options.type;
        let intervalCount: number;
        let useIntervals: boolean = options.useIntervals;
        // let saturation: number = options.saturation;
        //  let ligthness: number = options.ligthness;
        let configId: string = options.config;
        let user: ObjectId = options.user;
        let energyLevel: Energy = options.energyLevel;

        if (useIntervals) {
            intervalCount = options.intervalCount;
        }

        let config;

        if (configId) {
            config = this.configService.getConfig(configId);
        }

        let [amplitude, intervalDuration] = await this.musicService.generateIntervalData(audio, type, intervalCount);
        const data = this.musicService.generateByEnergy(config, energyLevel, amplitude, intervalDuration, intervalCount);

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
