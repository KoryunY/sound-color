import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/Model/user.schema';
import { MetadataProcessingService } from 'src/services/metadata.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private metadataService: MetadataProcessingService
    ) { }

    async createUser(name: string) {
        if (!name || name.length < 3)
            return 'provide valid name:length>3'
        return (await this.userModel.create({ name }))._id;
    }

    async deleteUser(id: string) {
        return this.userModel.findByIdAndRemove(id)//)._id;
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

    async getUser(id: string) {
        return await this.userModel
            .findById(id);
    }

    async shazamAudio(audio: any) {
        return await this.metadataService.getMetadata(audio);
    }

    async shazamText(text: string) {
        return await this.metadataService.getMetadata(null, text);
    }

    async metadata(audio: any) {
        return await this.metadataService.parseMetadata(audio);
    }

    async isExist(id: string): Promise<boolean> {
        const count = await this.userModel.countDocuments({ _id: id }).exec();
        return count > 0;
    }
}
