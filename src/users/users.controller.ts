import { Body, Controller, Delete, Get, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @Post()
    create(@Body() body: { name: string }) {
        return this.userService.createUser(body.name);
    }

    @Delete()
    delete(@Query('id') id: string) {
        return this.userService.deleteUser(id);
    }

    @Get('configs')
    getConfigs(@Query('id') id: string) {
        return this.userService.getUserConfig(id);
    }

    @Get('audios')
    getAudios(@Query('id') id: string) {
        return this.userService.getUserAudios(id);
    }

    @Get()
    user(@Query('id') id: string) {
        return this.userService.getUser(id);
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

