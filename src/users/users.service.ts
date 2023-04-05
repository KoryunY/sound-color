import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Audio } from 'src/Model/audio.schema';
import { Config } from 'src/Model/configs.schema';
import { User } from 'src/Model/user.schema';
import { MusicService } from 'src/services/music.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Config.name) private configModel: Model<Config>,
        @InjectModel("Audio") private audioModel: Model<Audio>,
        private musicService: MusicService
    ) { }

    async init() {
        // const user = new this.userModel({ name: "Vzgo" });
        // const config = new this.configModel({ name: "mycolors", colors: ["#9684b1", "#bc3f67", "#22223b"] });
        // user.userConfigs.push(config.id);
        // config.userConfigs.push(user.id);
        // await user.save();
        // await config.save();

        //init default colors;
    }

    async getBySynesthesia(audio: any) {
        let decodedAudio = await this.musicService.decodeAudioByType(audio);
        let fft = this.musicService.getFft(decodedAudio);
        let duration = this.musicService.getDuration(decodedAudio);
        let frequency = this.musicService.getFrequencyData(fft, decodedAudio._channelData[0].length);
        let peaks = this.musicService.getPeaks(decodedAudio);
        let bpm = this.musicService.calculateBPM(decodedAudio);
        let amplitude = this.musicService.getPeaks(decodedAudio);
        let intervalCount = 64;
        let intervalDuration = duration / intervalCount;
        let colors = this.musicService.generateIntervalData(frequency, amplitude, intervalDuration, intervalCount);
        const audioEntity = new this.audioModel({ data: colors });

        return `id: ${(await audioEntity.save())._id}`;

    }

    async GetByGenre(audio: any) {
        let decodedAudio = await this.musicService.decodeAudioByType(audio);
        let fft = this.musicService.getFft(decodedAudio);
        let duration = this.musicService.getDuration(decodedAudio);
        let frequency = this.musicService.getFrequencyData(fft, decodedAudio._channelData[0].length);

        let amplitude = this.musicService.getPeaks(decodedAudio);
        let intervalCount = 64;
        let intervalDuration = duration / intervalCount;
        let colors = this.musicService.generateIntervalDataByGenre(frequency, amplitude, intervalDuration, intervalCount);
        return colors;
        //const audioEntity = new this.audioModel({ data: colors });

        //return `id: ${(await audioEntity.save())._id}`;

    }

    async GetByTempo(audio: any) {



        let decodedAudio = await this.musicService.decodeAudioByType(audio);
        let duration = this.musicService.getDuration(decodedAudio);

        let bpm = this.musicService.calculateBPM(decodedAudio);
        let amplitude = this.musicService.getPeaks(decodedAudio);
        let intervalCount = 64;
        let intervalDuration = duration / intervalCount;

        let colors = this.musicService.generateIntervalDataByTempo(amplitude, intervalDuration, intervalCount, bpm);
        return colors;
    }

    async Get(audio: any) {


        let decodedAudio = await this.musicService.decodeAudioByType(audio);
        let duration = this.musicService.getDuration(decodedAudio);

        let bpm = this.musicService.calculateBPM(decodedAudio);
        let amplitude = this.musicService.getPeaks(decodedAudio);
        let intervalCount = 64;
        let intervalDuration = duration / intervalCount;

        let colors = this.musicService.generateIntervalDataByTempo(amplitude, intervalDuration, intervalCount, bpm);

    }
}
