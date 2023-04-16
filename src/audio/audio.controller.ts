import { Body, Controller, Delete, Get, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AudioService } from './audio.service';
import { AudioDto } from 'src/Model/Dto/Audio.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { SynesthesiaOptionsDto } from 'src/Model/Dto/SynesthesiaOptions.dto';
import { GenreOptionsDto } from 'src/Model/Dto/GenreOptions.dto';
import { TempoOptionsDto } from 'src/Model/Dto/TempoOptions.dto';
import { InstrumentOptionsDto } from 'src/Model/Dto/InstrumentOptions.dto';
import { EnergyOptionsDto } from 'src/Model/Dto/EnergyOptions.dto';
import { ConvertingType, Energy, Genre, Instrument, SaveAndReturnOption, Tempo } from 'src/Defaults/types';

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
    generateSynesthesiaColors(@Body() colorOptionsDto: any, @UploadedFile() audio: Express.Multer.File) {
        const checkAttrMessage = this.audioService.checkAttr(audio.mimetype, audio.originalname);
        if (checkAttrMessage != "isOk")
            return checkAttrMessage;

        const dto: SynesthesiaOptionsDto = {
            name: colorOptionsDto.name,
            type: ConvertingType[colorOptionsDto.type],
            saveAndReturnOption: SaveAndReturnOption[colorOptionsDto.saveAndReturnOption],
            useIntervals: Boolean(colorOptionsDto.useIntervals),
            intervalCount: parseInt(colorOptionsDto.intervalCount),
            user: colorOptionsDto.user
        };

        return this.audioService.generateBySynesthesia(dto, audio);
    }

    @Post('genre')
    @UseInterceptors(FileInterceptor('audio'))
    generateGenreColors(@Body() colorOptionsDto: any, @UploadedFile() audio: Express.Multer.File) {
        const checkAttrMessage = this.audioService.checkAttr(audio.mimetype, audio.originalname);
        if (checkAttrMessage != "isOk")
            return checkAttrMessage;

        const dto: GenreOptionsDto = {
            name: colorOptionsDto.name,
            type: ConvertingType[colorOptionsDto.type],
            saveAndReturnOption: SaveAndReturnOption[colorOptionsDto.saveAndReturnOption],
            useIntervals: Boolean(colorOptionsDto.useIntervals),
            intervalCount: parseInt(colorOptionsDto.intervalCount),
            genre: Genre[colorOptionsDto.genre],
            config: colorOptionsDto.config,
            user: colorOptionsDto.user
        };

        return this.audioService.generateByGenre(dto, audio);
    }

    @Post('tempo')
    @UseInterceptors(FileInterceptor('audio'))
    generateTempoColors(@Body() colorOptionsDto: any, @UploadedFile() audio: Express.Multer.File) {
        const checkAttrMessage = this.audioService.checkAttr(audio.mimetype, audio.originalname);
        if (checkAttrMessage != "isOk")
            return checkAttrMessage;

        const dto: TempoOptionsDto = {
            name: colorOptionsDto.name,
            type: ConvertingType[colorOptionsDto.type],
            saveAndReturnOption: SaveAndReturnOption[colorOptionsDto.saveAndReturnOption],
            intervalCount: parseInt(colorOptionsDto.intervalCount),
            tempo: Tempo[colorOptionsDto.tempo],
            config: colorOptionsDto.config,
            user: colorOptionsDto.user
        };

        return this.audioService.generateByTempo(dto, audio);
    }

    @Post('instrument')
    @UseInterceptors(FileInterceptor('audio'))
    generateInstrumentColors(@Body() colorOptionsDto: any, @UploadedFile() audio: Express.Multer.File) {
        const checkAttrMessage = this.audioService.checkAttr(audio.mimetype, audio.originalname);
        if (checkAttrMessage != "isOk")
            return checkAttrMessage;

        const dto: InstrumentOptionsDto = {
            name: colorOptionsDto.name,
            type: ConvertingType[colorOptionsDto.type],
            saveAndReturnOption: SaveAndReturnOption[colorOptionsDto.saveAndReturnOption],
            intervalCount: parseInt(colorOptionsDto.intervalCount),
            instrument: Instrument[colorOptionsDto.instrument],
            config: colorOptionsDto.config,
            user: colorOptionsDto.user
        };

        return this.audioService.generateByInstrument(dto, audio);
    }

    @Post('energy')
    @UseInterceptors(FileInterceptor('audio'))
    generateEnergyColors(@Body() colorOptionsDto: any, @UploadedFile() audio: Express.Multer.File) {
        const checkAttrMessage = this.audioService.checkAttr(audio.mimetype, audio.originalname);
        if (checkAttrMessage != "isOk")
            return checkAttrMessage;

        const dto: EnergyOptionsDto = {
            name: colorOptionsDto.name,
            type: ConvertingType[colorOptionsDto.type],
            saveAndReturnOption: SaveAndReturnOption[colorOptionsDto.saveAndReturnOption],
            intervalCount: parseInt(colorOptionsDto.intervalCount),
            config: colorOptionsDto.config,
            user: colorOptionsDto.user
        };
        return this.audioService.generateByEnergy(dto, audio);
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
