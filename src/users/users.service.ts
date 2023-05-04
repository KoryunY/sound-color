import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/Model/user.schema';
import { AllowedFileAttributes, AllowedMimes } from 'src/defaults/consts';
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
        try {
            return await this.userModel.findByIdAndRemove(id);
        } catch (err) {
            return err.message;
        }
    }

    async getUserConfig(id: string) {
        try {
            return await this.userModel
                .findById(id)
                .populate('configs')
                .exec();
        } catch (err) {
            return err.message;
        }
    }

    async getUserAudios(id: string) {
        try {
            return await this.userModel
                .findById(id)
                .populate('audios')
                .exec();
        } catch (err) {
            return err.message;
        }
    }

    async getUser(id: string) {
        try {
            return await this.userModel
                .findById(id);
        } catch (err) {
            return err.message;
        }
    }

    async shazamAudio(audio: any) {
        return await this.metadataService.getMetadata(audio);
    }

    async shazamText(text: string) {
        if (!text || text.length < 2)
            return 'provide valid text:length>3'
        return await this.metadataService.getMetadata(null, text);
    }

    async metadata(audio: any) {
        return await this.metadataService.parseMetadata(audio);
    }

    async isExist(id: string): Promise<boolean> {
        const count = await this.userModel.countDocuments({ _id: id }).exec();
        return count > 0;
    }

    checkAttr(mimetype, originalname) {
        if (!AllowedMimes.includes(mimetype)) {
            return `pls send me audio,you send:${mimetype}`;
        }
        let fileAttributes = originalname.split('.');
        let fileAttribute = fileAttributes[fileAttributes.length - 1];
        if (!AllowedFileAttributes.includes(fileAttribute)) {
            return `invalid file type:${fileAttribute}`;
        }

        return 'isOk';
    }
}
