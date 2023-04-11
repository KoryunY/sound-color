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

    async shazamAudio(audio: any) {
        return await this.musicService.getMetadata(audio);
    }

    async shazamText(text: string) {
        return await this.musicService.getMetadata(null,text);
    }

    async metadata(audio: any) {
        return await this.musicService.parseMetadata(audio);
    }

}
