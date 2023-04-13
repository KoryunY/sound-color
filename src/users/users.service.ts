import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConvertingType } from 'src/Defaults/types';
import { ColorOptionsDto } from 'src/Model/Dto/ColorOptions.dto';
import { ConfigDto } from 'src/Model/Dto/Config.dto';
import { UpdateConfigDto } from 'src/Model/Dto/UpdateConfig.dto';
import { Audio } from 'src/Model/audio.schema';
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

    async createUser(name: string) {
        return (await this.userModel.create({ name }))._id;
    }

    async deleteUser(id: string) {
        return (await this.userModel.findByIdAndRemove(id))._id;
    }

    async getUserConfig(id: string) {
        return await this.userModel
            .findById(id)
            .populate('configs')
            .exec();
    }

    async getUserAudios(id: string) {
        return await this.userModel
            .findById(id)
            .populate('audios')
            .exec();
    }

    async createConfig(id:string,dto: ConfigDto) { //FORUSER
        //const config = new this.configModel({ name: "mycolors", colors: ["#9684b1", "#bc3f67", "#22223b"] });

        return (await this.configModel.create({ user:id,...dto }))._id;
    }

    async updateConfig(id: string, dto: UpdateConfigDto) {
        return (await this.configModel.findByIdAndUpdate(id, { ...dto }));
    }

    removeConfig(id: string) {
        return this.configModel.findByIdAndRemove(id);
    }

    async shazamAudio(audio: any) {
        return await this.musicService.getMetadata(audio);
    }

    async shazamText(text: string) {
        return await this.musicService.getMetadata(null, text);
    }

    async metadata(audio: any) {
        return await this.musicService.parseMetadata(audio);
    }

}
