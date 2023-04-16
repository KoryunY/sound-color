import { Config, ConfigSchema } from 'src/Model/configs.schema';
import { ConfigController } from './config.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from './config.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [MongooseModule.forFeature([{ name: Config.name, schema: ConfigSchema }])],
  providers: [ConfigService],
  controllers: [ConfigController],
  exports: [ConfigService]
})
export class ConfigsModule { }
