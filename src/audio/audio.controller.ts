import { Body, Controller, Delete, Get, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ConvertingType, Genre, Instrument, SaveAndReturnOption, Sentiment, Tempo } from 'src/Defaults/types';
import { SynesthesiaOptionsDto } from 'src/Model/Dto/SynesthesiaOptions.dto';
import { InstrumentOptionsDto } from 'src/Model/Dto/InstrumentOptions.dto';
import { SentimentOptionsDto } from 'src/Model/Dto/SentimentOptions.dto';
import { EnergyOptionsDto } from 'src/Model/Dto/EnergyOptions.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { GenreOptionsDto } from 'src/Model/Dto/GenreOptions.dto';
import { TempoOptionsDto } from 'src/Model/Dto/TempoOptions.dto';
import { AudioService } from './audio.service';
import { AudioDto } from 'src/Model/Dto/Audio.dto';
import { AioOptionsDto } from 'src/Model/Dto/AioOptions.dto';

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
            user: colorOptionsDto.user,
            gradientSplitCount: parseInt(colorOptionsDto.gradientSplitCount),
            useCustomFft: Boolean(colorOptionsDto.useCustomFft)
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
            user: colorOptionsDto.user,
            useCustomFft: Boolean(colorOptionsDto.useCustomFft)
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
            user: colorOptionsDto.user,
            useCustomFft: Boolean(colorOptionsDto.useCustomFft)
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
            user: colorOptionsDto.user,
            useCustomFft: Boolean(colorOptionsDto.useCustomFft)
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
            user: colorOptionsDto.user,
            useCustomFft: Boolean(colorOptionsDto.useCustomFft)
        };
        return this.audioService.generateByEnergy(dto, audio);
    }

    @Post('sentiment')
    @UseInterceptors(FileInterceptor('audio'))
    generateSentimentColors(@Body() colorOptionsDto: any, @UploadedFile() audio: Express.Multer.File) {
        const checkAttrMessage = this.audioService.checkAttr(audio.mimetype, audio.originalname);
        if (checkAttrMessage != "isOk")
            return checkAttrMessage;

        const dto: SentimentOptionsDto = {
            name: colorOptionsDto.name,
            type: ConvertingType[colorOptionsDto.type],
            saveAndReturnOption: SaveAndReturnOption[colorOptionsDto.saveAndReturnOption],
            intervalCount: parseInt(colorOptionsDto.intervalCount),
            config: colorOptionsDto.config,
            user: colorOptionsDto.user,
            sentiment: Sentiment[colorOptionsDto.sentiment],
            familyCount: parseInt(colorOptionsDto.familyCount),
            useCustomFft: Boolean(colorOptionsDto.useCustomFft)
        };

        return this.audioService.generateBySentiment(dto, audio);
    }

    @Post('aio')
    @UseInterceptors(FileInterceptor('audio'))
    generateAIOColors(@Body() colorOptionsDto: any, @UploadedFile() audio: Express.Multer.File) {
        const checkAttrMessage = this.audioService.checkAttr(audio.mimetype, audio.originalname);
        if (checkAttrMessage != "isOk")
            return checkAttrMessage;

        const dto: AioOptionsDto = {
            name: colorOptionsDto.name,
            type: ConvertingType[colorOptionsDto.type],
            saveAndReturnOption: SaveAndReturnOption[colorOptionsDto.saveAndReturnOption],
            user: colorOptionsDto.user,
            config: colorOptionsDto.config,
            useIntervals: Boolean(colorOptionsDto.useIntervals),
            intervalCount: parseInt(colorOptionsDto.intervalCount),
            familyCount: parseInt(colorOptionsDto.intervalCount),
            gradientSplitCount: parseInt(colorOptionsDto.intervalCount),
            genre: Genre[colorOptionsDto.genre],
            instrument: Instrument[colorOptionsDto.instrument],
            tempo: Tempo[colorOptionsDto.tempo],
            sentiment: Sentiment[colorOptionsDto.sentiment],
            useCustomFft: Boolean(colorOptionsDto.useCustomFft)
        };

        return this.audioService.generateByAio(dto, audio);
    }

    @Get('check')
    exist(@Query('id') id: string) {
        return this.audioService.isExist(id);
    }

    @Post('test')
    @UseInterceptors(FileInterceptor('audio'))
    test(@UploadedFile() audio: Express.Multer.File) {
        return this.audioService.test(audio);
    }

    @Post('test2')
    @UseInterceptors(FileInterceptor('audio'))
    test2(@UploadedFile() audio: Express.Multer.File) {
        return this.audioService.test2(audio);
    }

}
