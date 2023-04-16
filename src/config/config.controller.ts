import { Body, Controller, Delete, Post, Put, Query, Get } from '@nestjs/common';
import { ConfigDto } from 'src/Model/Dto/Config.dto';
import { UpdateConfigDto } from 'src/Model/Dto/UpdateConfig.dto';
import { ConfigService } from './config.service';

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

}
