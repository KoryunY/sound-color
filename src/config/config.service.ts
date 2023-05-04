import { UpdateConfigDto } from 'src/Model/dto/UpdateConfig.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { ConfigDto } from 'src/Model/dto/Config.dto';
import { Config } from 'src/Model/configs.schema';
import { Model } from 'mongoose';
import { User } from 'src/Model/user.schema';

@Injectable()
export class ConfigService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Config.name) private configModel: Model<Config>,
    ) { }
    async createConfig(id: string, dto: ConfigDto) {
        try {
            const createdId = (await this.configModel.create({ user: id, ...dto }))._id;
            const userModel = await this.userModel.findById(id);
            userModel.configs.push(createdId);
            await userModel.save();
            return createdId;
        } catch (err) {
            return err.message;
        }
    }

    async updateConfig(id: string, dto: UpdateConfigDto) {
        try {
            return await this.configModel.findByIdAndUpdate(id, { ...dto });
        } catch (err) {
            return err.message;
        }
    }

    async removeConfig(id: string) {
        try {
            return await this.configModel.findByIdAndRemove(id);
        } catch (err) {
            return err.message;
        }
    }

    async getConfig(id: string) {
        try {
            return await this.configModel.findById(id);
        } catch (err) {
            return err.message;
        }
    }

    async isExist(id: string): Promise<boolean> {
        const count = await this.configModel.countDocuments({ _id: id }).exec();
        return count > 0;
    }
}
