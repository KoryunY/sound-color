import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { AllowedMimes } from 'src/Defaults/consts';
import { SynesthesiaOptionsDto } from 'src/Model/Dto/SynesthesiaOptions.dto';
import { Energy, Genre, Instrument, Sentiment, Tempo } from 'src/Defaults/types';
import { UpdateConfigDto } from 'src/Model/Dto/UpdateConfig.dto';
import { ConfigDto } from 'src/Model/Dto/Config.dto';


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

    @Get('configs')
    getConfigs(@Query('id') id: string) {
        return this.userService.getUserConfig(id);
    }

    @Get('audioss')
    getAudios(@Query('id') id: string) {
        return this.userService.getUserAudios(id);
    }


    @Get('defaults')
    getGenress() {
        return { genres: Genre, tempos: Tempo, energys: Energy, instruments: Instrument, sentiments: Sentiment };
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

