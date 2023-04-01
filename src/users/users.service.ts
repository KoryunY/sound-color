import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Config } from 'src/Model/configs.schema';
import { User } from 'src/Model/user.schema';
import { MusicService } from 'src/services/music.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Config.name) private configModel: Model<Config>,
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

    async decodeAudio(audio: any) {
        return this.musicService.decodeAudioByType("any", audio);
    }
}
