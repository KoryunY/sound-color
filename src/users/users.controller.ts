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

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!AllowedMimes.includes(file.mimetype)) {
            return `pls send me audio,you send:${file.mimetype}`;
        }

        return await this.userService.decodeAudio(file.originalname, file.buffer);
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

