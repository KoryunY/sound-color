import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Genres } from 'src/Model/genres.enum';
import { UsersService } from './users.service';
import { AllowedMimes } from 'src/Defaults/conts';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @Get('init')
    getTest() {
        return this.userService.init();
    }

    @Post('syn')
    @UseInterceptors(FileInterceptor('file'))
    async getBySynesthesia(@UploadedFile() file: Express.Multer.File) {
        if (!AllowedMimes.includes(file.mimetype)) {
            return `pls send me audio,you send:${file.mimetype}`;
        }
        let fileAttributes = file.originalname.split('.');
        let fileAttribute = fileAttributes[fileAttributes.length - 1];
        if (fileAttribute != 'mp3') {
            return `invalid file type:${fileAttribute}`;
        }
        return await this.userService.getBySynesthesia(file.buffer);
    }

    @Post('gen')
    @UseInterceptors(FileInterceptor('file'))
    async GetByGenre(@UploadedFile() file: Express.Multer.File) {
        if (!AllowedMimes.includes(file.mimetype)) {
            return `pls send me audio,you send:${file.mimetype}`;
        }
        let fileAttributes = file.originalname.split('.');
        let fileAttribute = fileAttributes[fileAttributes.length - 1];
        if (fileAttribute != 'mp3') {
            return `invalid file type:${fileAttribute}`;
        }
        return await this.userService.GetByGenre(file.buffer);
    }

    @Post('bpm')
    @UseInterceptors(FileInterceptor('file'))
    async GetByTempo(@UploadedFile() file: Express.Multer.File) {
        if (!AllowedMimes.includes(file.mimetype)) {
            return `pls send me audio,you send:${file.mimetype}`;
        }
        let fileAttributes = file.originalname.split('.');
        let fileAttribute = fileAttributes[fileAttributes.length - 1];
        if (fileAttribute != 'mp3') {
            return `invalid file type:${fileAttribute}`;
        }
        return await this.userService.GetByTempo(file.buffer);
    }

    //gettingcategory
    // @Get('genres/sound')
    // getGenreBySound() {
    //     return this.userService.getGenreByAudio();
    // }

    // @Get('genres/name')
    // getGenreByMusicName() {
    //     return this.userService.getGenreByMusicName();
    // }

    @Get('genres')
    getGenress() {
        return Genres;
    }
}

