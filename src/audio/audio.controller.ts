import { Body, Controller, Delete, Get, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ConvertingType, Genre, Instrument, SaveAndReturnOption, Sentiment, Tempo } from '../defaults/types';
import { FrequencyOptionsDto as FrequencyOptionsDto } from 'src/Model/Dto/FrequencyOptions.dto';
import { InstrumentOptionsDto } from 'src/Model/dto/InstrumentOptions.dto';
import { SentimentOptionsDto } from 'src/Model/dto/SentimentOptions.dto';
import { EnergyOptionsDto } from 'src/Model/dto/EnergyOptions.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { GenreOptionsDto } from 'src/Model/dto/GenreOptions.dto';
import { TempoOptionsDto } from 'src/Model/dto/TempoOptions.dto';
import { AudioService } from './audio.service';
import { AudioDto } from 'src/Model/dto/Audio.dto';
import { AioOptionsDto } from 'src/Model/dto/AioOptions.dto';

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

    @Get()
    audio(@Query('id') id: string) {
        return this.audioService.find(id);
    }

    @Post('frequency')
    @UseInterceptors(FileInterceptor('audio'))
    generateFrequencyColors(@Body() colorOptionsDto: any, @UploadedFile() audio: Express.Multer.File) {
        if (!audio) return "Err:missing audio";

        const checkAttrMessage = this.audioService.checkAttr(audio.mimetype, audio.originalname);
        if (checkAttrMessage != "isOk")
            return checkAttrMessage;

        const dto: FrequencyOptionsDto = {
            name: colorOptionsDto.name,
            type: ConvertingType[colorOptionsDto.type],
            saveAndReturnOption: SaveAndReturnOption[colorOptionsDto.saveAndReturnOption],
            useIntervals: Boolean(colorOptionsDto.useIntervals),
            intervalCount: parseInt(colorOptionsDto.intervalCount),
            user: colorOptionsDto.user,
            gradientSplitCount: parseInt(colorOptionsDto.gradientSplitCount),
            useCustomFft: Boolean(colorOptionsDto.useCustomFft)
        };
        return this.audioService.generateByFrequency(dto, audio);
    }

    @Post('genre')
    @UseInterceptors(FileInterceptor('audio'))
    generateGenreColors(@Body() colorOptionsDto: any, @UploadedFile() audio: Express.Multer.File) {
        if (!audio) return "Err:missing audio";

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
        if (!audio) return "Err:missing audio";

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
        if (!audio) return "Err:missing audio";

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
        if (!audio) return "Err:missing audio";

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
        if (!audio) return "Err:missing audio";

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
        try {
            return this.audioService.generateBySentiment(dto, audio);
        } catch (err) {
            return err.message;
        }
    }

    @Post('aio')
    @UseInterceptors(FileInterceptor('audio'))
    generateAIOColors(@Body() colorOptionsDto: any, @UploadedFile() audio: Express.Multer.File) {
        if (!audio) return "Err:missing audio";

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

    @Post('html')
    @UseInterceptors(FileInterceptor('audio'))
    generateHtml(@Body() body: any, @UploadedFile() audio: Express.Multer.File) {
        if (!audio) return "Err:missing audio";

        const checkAttrMessage = this.audioService.checkAttr(audio.mimetype, audio.originalname);
        if (checkAttrMessage != "isOk")
            return checkAttrMessage;
        const data = body.data

        return this.audioService.generateHtml(data, audio);
    }

    @Get('check')
    exist(@Query('id') id: string) {
        return this.audioService.isExist(id);
    }

}
