import { UpdateConfigDto } from 'src/Model/dto/UpdateConfig.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { ConfigDto } from 'src/Model/dto/Config.dto';
import { Config } from 'src/Model/configs.schema';
import { Model, Types } from 'mongoose';
import { User } from 'src/Model/user.schema';

@Injectable()
export class ConfigService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Config.name) private configModel: Model<Config>,
    ) { }
    async createConfig(id: string, dto: ConfigDto) {
        if (!Types.ObjectId.isValid(id))
            return 'invalid object id type';

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
        if (!Types.ObjectId.isValid(id))
            return 'invalid object id type';

        try {
            await this.configModel.findByIdAndUpdate(id, { ...dto });
        } catch (err) {
            return err.message;
        }
    }

    async removeConfig(id: string) {
        if (!Types.ObjectId.isValid(id))
            return 'invalid object id type';

        const removedConfig = await this.configModel.findByIdAndRemove(id);
        if (removedConfig) {
            // Remove the config ID from the user's config array
            await this.userModel.updateOne(
                { _id: removedConfig.user },
                { $pull: { configs: removedConfig._id } },
            ).exec();
        }
    }

    async getConfig(id: string) {
        if (!Types.ObjectId.isValid(id))
            return 'invalid object id type';

        return await this.configModel.findById(id);
    }

    async isExist(id: string) {
        if (!Types.ObjectId.isValid(id))
            return 'invalid object id type';

        const count = await this.configModel.countDocuments({ _id: id }).exec();
        return count > 0;
    }
}
