import { Body, Controller, Delete, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AudioService } from './audio.service';
import { AudioDto } from 'src/Model/Dto/Audio.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ColorOptionsDto } from 'src/Model/Dto/ColorOptions.dto';

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
    generateSynesthesiaColors(@Body() colorOptionsDto: ColorOptionsDto, @UploadedFile() audio: Express.Multer.File) {
        const checkAttrMessage = this.audioService.checkAttr(audio.mimetype, audio.originalname);
        if (checkAttrMessage != "isOk")
            return checkAttrMessage;
        return this.audioService.generateBySynesthesia(colorOptionsDto, audio);
    }

    @Post('genre')
    @UseInterceptors(FileInterceptor('audio'))
    generateGenreColors(@Body() colorOptionsDto: ColorOptionsDto, @UploadedFile() audio: Express.Multer.File) {
        const checkAttrMessage = this.audioService.checkAttr(audio.mimetype, audio.originalname);
        if (checkAttrMessage != "isOk")
            return checkAttrMessage;
        return this.audioService.generateByGenre(colorOptionsDto, audio);
    }

    @Post('tempo')
    @UseInterceptors(FileInterceptor('audio'))
    generateTempoColors(@Body() colorOptionsDto: ColorOptionsDto, @UploadedFile() audio: Express.Multer.File) {
        const checkAttrMessage = this.audioService.checkAttr(audio.mimetype, audio.originalname);
        if (checkAttrMessage != "isOk")
            return checkAttrMessage;
        return this.audioService.generateByTempo(colorOptionsDto, audio);
    }

    @Post('insrument')
    @UseInterceptors(FileInterceptor('audio'))
    generateInstrumentColors(@Body() colorOptionsDto: ColorOptionsDto, @UploadedFile() audio: Express.Multer.File) {
        const checkAttrMessage = this.audioService.checkAttr(audio.mimetype, audio.originalname);
        if (checkAttrMessage != "isOk")
            return checkAttrMessage;
        return this.audioService.generateByInstrument(colorOptionsDto, audio);
    }

    @Post('energy')
    @UseInterceptors(FileInterceptor('audio'))
    generateEnergyColors(@Body() colorOptionsDto: ColorOptionsDto, @UploadedFile() audio: Express.Multer.File) {
        const checkAttrMessage = this.audioService.checkAttr(audio.mimetype, audio.originalname);
        if (checkAttrMessage != "isOk")
            return checkAttrMessage;
        return this.audioService.generateByEnergy(colorOptionsDto, audio);
    }

    @Post('sentiment')
    @UseInterceptors(FileInterceptor('audio'))
    generateSentimentColors(@Body() colorOptionsDto: ColorOptionsDto, @UploadedFile() audio: Express.Multer.File) {
        const checkAttrMessage = this.audioService.checkAttr(audio.mimetype, audio.originalname);
        if (checkAttrMessage != "isOk")
            return checkAttrMessage;
        return this.audioService.generateBySentiment(colorOptionsDto, audio);
    }

}
