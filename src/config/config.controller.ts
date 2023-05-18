import { Body, Controller, Delete, Post, Put, Query, Get } from '@nestjs/common';
import { UpdateConfigDto } from 'src/Model/dto/UpdateConfig.dto';
import { ConfigService } from './config.service';
import { ConfigDto } from 'src/Model/dto/Config.dto';
import { Energy, Genre, Instrument, Sentiment, Tempo } from '../defaults/types';

@Controller('config')
export class ConfigController {
    constructor(private readonly configService: ConfigService) { }

    @Post()
    createConfig(@Query('id') id: string, @Body() dto: ConfigDto) {
        return this.configService.createConfig(id, dto);
    }

    @Put()
    updateConfig(@Query('id') id: string, @Body() dto: UpdateConfigDto) {
        return this.configService.updateConfig(id, dto);
    }

    @Delete()
    removeConfig(@Query('id') id: string) {
        return this.configService.removeConfig(id);
    }

    @Get()
    getConfig(@Query('id') id: string) {
        return this.configService.getConfig(id);
    }

    @Get('defaults')
    getDefaults() {
        return { genres: Genre, tempos: Tempo, energys: Energy, instruments: Instrument, sentiments: Sentiment };
    }
}
