import { UpdateConfigDto } from 'src/Model/dto/UpdateConfig.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { ConfigDto } from 'src/Model/dto/Config.dto';
import { Config } from 'src/Model/configs.schema';
import { Model } from 'mongoose';

@Injectable()
export class ConfigService {
    constructor(
        // @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Config.name) private configModel: Model<Config>,
        // private musicService: MusicService
    ) { }
    async createConfig(id: string, dto: ConfigDto) { //FORUSER
        //const config = new this.configModel({ name: "mycolors", colors: ["#9684b1", "#bc3f67", "#22223b"] });
        return (await this.configModel.create({ user: id, ...dto }))._id;
    }

    async updateConfig(id: string, dto: UpdateConfigDto) {
        return (await this.configModel.findByIdAndUpdate(id, { ...dto }));
    }

    removeConfig(id: string) {
        return this.configModel.findByIdAndRemove(id);
    }

    async getConfig(id: string) {
        return await this.configModel.findById(id);
    }

    async isExist(id: string): Promise<boolean> {
        const count = await this.configModel.countDocuments({ _id: id }).exec();
        return count > 0;
    }
}
