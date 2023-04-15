import { Body, Controller, Delete, Get, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AudioService } from './audio.service';
import { AudioDto } from 'src/Model/Dto/Audio.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { SynesthesiaOptionsDto } from 'src/Model/Dto/SynesthesiaOptions.dto';
import { GenreOptionsDto } from 'src/Model/Dto/GenreOptions.dto';
import { TempoOptionsDto } from 'src/Model/Dto/TempoOptions.dto';
import { InstrumentOptionsDto } from 'src/Model/Dto/InstrumentOptions.dto';
import { EnergyOptionsDto } from 'src/Model/Dto/EnergyOptions.dto';

@Controller('audio')
export class AudioController {
    constructor(private readonly audioService: AudioService) { }

    @Post()
    createAudio(@Body() dto: AudioDto) {
        return this.audioService.create(dto);
    }

    @Delete()
    removeAudio(@Query('id') id: string) {
        return this.audioService.delete(id);
    }

    @Post('synesthesia')
    @UseInterceptors(FileInterceptor('audio'))
    generateSynesthesiaColors(@Body() colorOptionsDto: SynesthesiaOptionsDto, @UploadedFile() audio: Express.Multer.File) {
        const checkAttrMessage = this.audioService.checkAttr(audio.mimetype, audio.originalname);
        if (checkAttrMessage != "isOk")
            return checkAttrMessage;
        return this.audioService.generateBySynesthesia(colorOptionsDto, audio);
    }

    @Post('genre')
    @UseInterceptors(FileInterceptor('audio'))
    generateGenreColors(@Body() colorOptionsDto: GenreOptionsDto, @UploadedFile() audio: Express.Multer.File) {
        const checkAttrMessage = this.audioService.checkAttr(audio.mimetype, audio.originalname);
        if (checkAttrMessage != "isOk")
            return checkAttrMessage;
        return this.audioService.generateByGenre(colorOptionsDto, audio);
    }

    @Post('tempo')
    @UseInterceptors(FileInterceptor('audio'))
    generateTempoColors(@Body() colorOptionsDto: TempoOptionsDto, @UploadedFile() audio: Express.Multer.File) {
        const checkAttrMessage = this.audioService.checkAttr(audio.mimetype, audio.originalname);
        if (checkAttrMessage != "isOk")
            return checkAttrMessage;
        return this.audioService.generateByTempo(colorOptionsDto, audio);
    }

    @Post('insrument')
    @UseInterceptors(FileInterceptor('audio'))
    generateInstrumentColors(@Body() colorOptionsDto: InstrumentOptionsDto, @UploadedFile() audio: Express.Multer.File) {
        const checkAttrMessage = this.audioService.checkAttr(audio.mimetype, audio.originalname);
        if (checkAttrMessage != "isOk")
            return checkAttrMessage;
        return this.audioService.generateByInstrument(colorOptionsDto, audio);
    }

    @Post('energy')
    @UseInterceptors(FileInterceptor('audio'))
    generateEnergyColors(@Body() colorOptionsDto: EnergyOptionsDto, @UploadedFile() audio: Express.Multer.File) {
        const checkAttrMessage = this.audioService.checkAttr(audio.mimetype, audio.originalname);
        if (checkAttrMessage != "isOk")
            return checkAttrMessage;
        return this.audioService.generateByEnergy(colorOptionsDto, audio);
    }

    @Post('sentiment')
    @UseInterceptors(FileInterceptor('audio'))
    generateSentimentColors(@Body() colorOptionsDto: SynesthesiaOptionsDto, @UploadedFile() audio: Express.Multer.File) {
        const checkAttrMessage = this.audioService.checkAttr(audio.mimetype, audio.originalname);
        if (checkAttrMessage != "isOk")
            return checkAttrMessage;
        return this.audioService.generateBySentiment(colorOptionsDto, audio);
    }

    @Get('check')
    exist(@Query('id') id: string) {
        return this.audioService.isExist(id);
    }

}
