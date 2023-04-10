import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Genres } from 'src/Model/genres.enum';
import { UsersService } from './users.service';
import { AllowedMimes } from 'src/Defaults/conts';
import { ColorOptionsDto } from 'src/Model/Dto/ColorOptions.dto';


@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @Post('create')
    async User(@Body() name: string) {
        return this.userService.create(name);
    }

    @Post('init')
    async Init(@Param("id") id: string) {
        return this.userService.init(id);
    }

    @Post('generate')
    @UseInterceptors(FileInterceptor('audio'))
    async generateColors(colorOptionsDto: ColorOptionsDto, @UploadedFile() audio: Express.Multer.File) {
        return await this.userService.generateColors(colorOptionsDto, audio);
    }

    @Post('test')
    @UseInterceptors(FileInterceptor('file'))
    async generateColorss(@UploadedFile() audio: Express.Multer.File) {
        return await this.userService.test(audio);
    }

    @Post('test2')
    @UseInterceptors(FileInterceptor('file'))
    async test(@UploadedFile() audio: Express.Multer.File) {
        return await this.userService.test2(audio);
    }

    // @Post('syn')
    // @UseInterceptors(FileInterceptor('file'))
    // async getBySynesthesia(@UploadedFile() file: Express.Multer.File) {
    //     if (!AllowedMimes.includes(file.mimetype)) {
    //         return `pls send me audio,you send:${file.mimetype}`;
    //     }
    //     let fileAttributes = file.originalname.split('.');
    //     let fileAttribute = fileAttributes[fileAttributes.length - 1];
    //     if (fileAttribute != 'mp3') {
    //         return `invalid file type:${fileAttribute}`;
    //     }
    //     return await this.userService.getBySynesthesia(file.buffer);
    // }

    // @Post('gen')
    // @UseInterceptors(FileInterceptor('file'))
    // async GetByGenre(@UploadedFile() file: Express.Multer.File) {
    //     if (!AllowedMimes.includes(file.mimetype)) {
    //         return `pls send me audio,you send:${file.mimetype}`;
    //     }
    //     let fileAttributes = file.originalname.split('.');
    //     let fileAttribute = fileAttributes[fileAttributes.length - 1];
    //     if (fileAttribute != 'mp3') {
    //         return `invalid file type:${fileAttribute}`;
    //     }
    //     return await this.userService.GetByGenre(file.buffer);
    // }

    // @Post('bpm')
    // @UseInterceptors(FileInterceptor('file'))
    // async GetByTempo(@UploadedFile() file: Express.Multer.File) {
    //     if (!AllowedMimes.includes(file.mimetype)) {
    //         return `pls send me audio,you send:${file.mimetype}`;
    //     }
    //     let fileAttributes = file.originalname.split('.');
    //     let fileAttribute = fileAttributes[fileAttributes.length - 1];
    //     if (fileAttribute != 'mp3') {
    //         return `invalid file type:${fileAttribute}`;
    //     }
    //     return await this.userService.GetByTempo(file.buffer);
    // }

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

