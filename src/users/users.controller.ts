import { Body, Controller, Delete, Get, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { AllowedMimes } from 'src/Defaults/consts';
import { ColorOptionsDto } from 'src/Model/Dto/ColorOptions.dto';
import { Genre, Tempo } from 'src/Defaults/types';


@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @Post()
    create(@Body() name: string) {
        return this.userService.createUser(name);
    }

    @Delete()
    delete(@Query('id') id: string) {
        return this.userService.deleteUser(id);
    }

    @Post('config')
    createConfig(@Query('id') id: string) {
        return this.userService.createConfig(id);
    }

    @Delete('config')
    removeConfig(@Query('id') id: string) {
        return this.userService.createConfig(id);
    }

    @Get('defaults')
    getGenress() {
        return { genres: Genre, tempos: Tempo };
    }

    @Post('shazam-audio')
    @UseInterceptors(FileInterceptor('file'))
    async shazamAudio(@UploadedFile() audio: Express.Multer.File) {
        return await this.userService.shazamAudio(audio);
    }

    @Post('shazam-text')
    async shazamText(@Body() text: string) {
        return await this.userService.shazamText(text);
    }

    @Post('metadata')
    @UseInterceptors(FileInterceptor('file'))
    async metadata(@UploadedFile() audio: Express.Multer.File) {
        return await this.userService.metadata(audio);
    }


}

