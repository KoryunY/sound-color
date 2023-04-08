import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConvertingType } from 'src/Defaults/types';
import { ColorOptionsDto } from 'src/Model/Dto/ColorOptions.dto';
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

    create(name: string) {

    }

    init(_id: string) { //FORUSER
        // const user = new this.userModel({ name: "Vzgo" });
        // const config = new this.configModel({ name: "mycolors", colors: ["#9684b1", "#bc3f67", "#22223b"] });
        // user.userConfigs.push(config.id);
        // config.userConfigs.push(user.id);
        // await user.save();
        // await config.save();

        //init default colors;
    }

    async generateColors(options: ColorOptionsDto, audio: any) {
        const decodedAudio = await this.musicService.decodeAudio(audio);
        const type: ConvertingType = options.type;
        const intervalCount = options.intervalCount;
        const [fft, frequency, amplitude, bpm, duration, intervalDuration, originalLength, paddedLength] = this.musicService.generateIntervalData(decodedAudio, intervalCount);

        switch (type) {
            case ConvertingType.SYNESTHESIA:
                return this.musicService.generateBySynesthesia(frequency, amplitude, null, intervalDuration, intervalCount);
            case ConvertingType.GENRE:
                return this.musicService.generateByGenre(frequency, amplitude, null, intervalDuration, intervalCount);
            case ConvertingType.TEMPO:
                return this.musicService.generateByTempo(frequency, amplitude, intervalDuration, intervalCount, bpm);
            case ConvertingType.INSTRUMENT:
                return this.musicService.generateByInstrument(amplitude, intervalDuration, intervalCount, bpm);
            case ConvertingType.ENERGY:
                return this.musicService.generateByEnergy(amplitude, intervalDuration, intervalCount, bpm);
            case ConvertingType.SPEECH:
                return this.musicService.generateBySpeech(amplitude, intervalDuration, intervalCount, bpm);
        }
    }

    async test(audio: any) {
        const decodedAudio = await this.musicService.decodeAudio(audio);
        let intervalCount = 123;
        const [fft, frequency, amplitude, bpm, duration, intervalDuration, originalLength, paddedLength] = this.musicService.generateIntervalData(decodedAudio, intervalCount);
       // return frequency
        //let colors = this.musicService.generateByGenre(frequency, amplitude, intervalDuration, intervalCount, bpm[0]);
        return this.musicService.generateByGenre(frequency, amplitude, null, intervalDuration, intervalCount);

        //return colors;
        //const audioEntity = new this.audioModel({ data: colors });
        // let fft = this.musicService.getFft(decodedAudio);
        // const originalLength = decodedAudio.length;
        // const paddedLength = Math.pow(2, Math.ceil(Math.log2(originalLength)));

        // let frequency = this.musicService.getFrequencyData(fft, decodedAudio._channelData[0].length);

        // let amplitude = this.musicService.getAmplitudeData(fft, decodedAudio._channelData[0].length / 2, paddedLength);
        // // console.log(decodedAudio)
        // // return
        // return this.musicService.mapInstrument(amplitude, decodedAudio.sampleRate);
    }


    // async generateBySynesthesia(audio: any) {
    //     let decodedAudio = await this.musicService.decodeAudio(audio);
    //     let fft = this.musicService.getFft(decodedAudio);
    //     let duration = this.musicService.getDuration(decodedAudio);
    //     let frequency = this.musicService.getFrequencyData(fft, decodedAudio._channelData[0].length);
    //     let peaks = this.musicService.getPeaks(decodedAudio);
    //     let bpm = this.musicService.calculateBPM(decodedAudio);
    //     let amplitude = this.musicService.getPeaks(decodedAudio);
    //     let intervalCount = 64;
    //     let intervalDuration = duration / intervalCount;
    //     let colors = this.musicService.generateIntervalData(frequency, amplitude, intervalDuration, intervalCount);
    //     const audioEntity = new this.audioModel({ data: colors });

    //     return `id: ${(await audioEntity.save())._id}`;

    // }

    // async GetByGenre(audio: any) {
    //     let decodedAudio = await this.musicService.decodeAudio(audio);
    //     let fft = this.musicService.getFft(decodedAudio);
    //     let duration = this.musicService.getDuration(decodedAudio);
    //     let frequency = this.musicService.getFrequencyData(fft, decodedAudio._channelData[0].length);

    //     let amplitude = this.musicService.getPeaks(decodedAudio);
    //     let intervalCount = 64;
    //     let intervalDuration = duration / intervalCount;
    //     let colors = this.musicService.generateIntervalDataByGenre(frequency, amplitude, intervalDuration, intervalCount);
    //     return colors;
    //     //const audioEntity = new this.audioModel({ data: colors });

    //     //return `id: ${(await audioEntity.save())._id}`;

    // }

    // async GetByTempo(audio: any) {



    //     let decodedAudio = await this.musicService.decodeAudio(audio);
    //     let duration = this.musicService.getDuration(decodedAudio);

    //     let bpm = this.musicService.calculateBPM(decodedAudio);
    //     let amplitude = this.musicService.getPeaks(decodedAudio);
    //     let intervalCount = 64;
    //     let intervalDuration = duration / intervalCount;

    //     let colors = this.musicService.generateIntervalDataByTempo(amplitude, intervalDuration, intervalCount, bpm);
    //     return colors;
    // }

    // async Get(audio: any) {


    //     let decodedAudio = await this.musicService.decodeAudio(audio);
    //     let duration = this.musicService.getDuration(decodedAudio);

    //     let bpm = this.musicService.calculateBPM(decodedAudio);
    //     let amplitude = this.musicService.getPeaks(decodedAudio);
    //     let intervalCount = 64;
    //     let intervalDuration = duration / intervalCount;

    //     let colors = this.musicService.generateIntervalDataByTempo(amplitude, intervalDuration, intervalCount, bpm);

    // }
}
