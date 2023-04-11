import { Body, Controller, Delete, Get, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Genres } from 'src/Model/genres.enum';
import { UsersService } from './users.service';
import { AllowedMimes } from 'src/Defaults/consts';
import { ColorOptionsDto } from 'src/Model/Dto/ColorOptions.dto';


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

    @Post('init')
    createConfig(@Query('id') id: string) {
        return this.userService.createConfig(id);
    }
    
    @Get('genres')
    getGenress() {
        return Genres;
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
    
    
}

