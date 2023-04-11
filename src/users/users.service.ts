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
        @InjectModel(Audio.name) private audioModel: Model<Audio>,
        private musicService: MusicService
    ) { }

    async createUser(name: string) {
        return (await this.userModel.create({ name }))._id;
    }

    async deleteUser(id: string) {
        return (await this.userModel.findByIdAndRemove(id))._id;
    }

    createConfig(id: string) { //FORUSER
        // 
        // const config = new this.configModel({ name: "mycolors", colors: ["#9684b1", "#bc3f67", "#22223b"] });
        // user.userConfigs.push(config.id);
        // config.userConfigs.push(user.id);
        // 
        // await config.save();

        //init default colors;
    }



    async test2(audio: any) {
        return await this.musicService.parseMetadata(audio);
    }

    async test(audio: any) {
        // const decodedAudio = await this.musicService.decodeAudio(audio);
        let intervalCount = 123;
        const [fft, frequency, amplitude, bpm, duration, intervalDuration, originalLength, paddedLength, pitch] = await this.musicService.generateIntervalData(audio, intervalCount);
        const sentiment = (await this.musicService.testSpeech(audio)).sentiment;
        // return await this.musicService.generateBySentiment(frequency,amplitude, intervalDuration, intervalCount, sentiment);
        return await this.musicService.generateBySentiment(frequency, sentiment, intervalDuration, intervalCount);

        //return frequency
        //let colors = this.musicService.generateByGenre(frequency, amplitude, intervalDuration, intervalCount, bpm[0]);
        //return pitch
        //  return this.musicService.generateByInstrument(amplitude, pitch, intervalDuration, intervalCount);

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


}
