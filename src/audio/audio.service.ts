import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AllowedMimes } from 'src/Defaults/consts';
import { ConvertingType } from 'src/Defaults/types';
import { AudioDto } from 'src/Model/Dto/Audio.dto';
import { ColorOptionsDto } from 'src/Model/Dto/ColorOptions.dto';
import { Audio } from 'src/Model/audio.schema';
import { Config } from 'src/Model/configs.schema';
import { User } from 'src/Model/user.schema';
import { MusicService } from 'src/services/music.service';

@Injectable()
export class AudioService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Config.name) private configModel: Model<Config>,
        @InjectModel(Audio.name) private audioModel: Model<Audio>,
        private musicService: MusicService
    ) { }

    async create(dto: AudioDto) {
        return (await this.audioModel.create(dto))._id;
    }

    async delete(id: string) {
        return (await this.audioModel.findByIdAndRemove(id))._id;
    }

    async generateBySynesthesia(options: ColorOptionsDto, audio: any) {
        const type: ConvertingType = options.type;
        const intervalCount = options.intervalCount;
        let [frequency, amplitude, duration, intervalDuration] = await this.musicService.generateIntervalData(audio, type);

        return this.musicService.generateBySynesthesia(frequency, amplitude, duration, intervalDuration, intervalCount);

    }

    async generateByGenre(options: ColorOptionsDto, audio: any) {
        const type: ConvertingType = options.type;
        const intervalCount = options.intervalCount;
        let [frequency, amplitude, duration, intervalDuration] = await this.musicService.generateIntervalData(audio, type);

        return this.musicService.generateByGenre(frequency, amplitude, duration, intervalDuration, intervalCount);
    }

    async generateByTempo(options: ColorOptionsDto, audio: any) {
        const type: ConvertingType = options.type;
        const intervalCount = options.intervalCount;
        let [frequency, amplitude, intervalDuration, bpm] = await this.musicService.generateIntervalData(audio, type);

        return this.musicService.generateByTempo(frequency, amplitude, intervalDuration, intervalCount, bpm);
    }

    async generateByInstrument(options: ColorOptionsDto, audio: any) {
        const type: ConvertingType = options.type;
        const intervalCount = options.intervalCount;
        let [amplitude, intervalDuration, pitch] = await this.musicService.generateIntervalData(audio, type);

        return this.musicService.generateByInstrument(amplitude, pitch, intervalDuration, intervalCount);
    }

    async generateByEnergy(options: ColorOptionsDto, audio: any) {
        const type: ConvertingType = options.type;
        const intervalCount = options.intervalCount;
        let [amplitude, intervalDuration] = await this.musicService.generateIntervalData(audio, type);

        return this.musicService.generateByEnergy(amplitude, intervalDuration, intervalCount);
    }

    async generateBySentiment(options: ColorOptionsDto, audio: any) {
        const type: ConvertingType = options.type;
        const intervalCount = options.intervalCount;
        const [sentiment] = (await this.musicService.getMetadata(audio));
        let [frequency, intervalDuration] = await this.musicService.generateIntervalData(audio, type);

        return await this.musicService.generateBySentiment(frequency, sentiment, intervalDuration, intervalCount);
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
}
