import { Config, ConfigSchema } from 'src/Model/configs.schema';
import { Audio, AudioSchema } from 'src/Model/audio.schema';
import { User, UserSchema } from 'src/Model/user.schema';
import { AudioController } from './audio.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from 'src/config/config.service';
import { AudioService } from './audio.service';
import { MusicService } from 'src/services/music.service';
import { Module } from '@nestjs/common';
import { MetadataProcessingService } from 'src/services/metadata.service';
import { ServicesModule } from 'src/services/services.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  MongooseModule.forFeature([{ name: Config.name, schema: ConfigSchema }]),
  MongooseModule.forFeature([{ name: Audio.name, schema: AudioSchema }]),
    ServicesModule
  ],
  providers: [AudioService, MusicService, ConfigService, MetadataProcessingService],
  controllers: [AudioController],
})
export class AudioModule { }
