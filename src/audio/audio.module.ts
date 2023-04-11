import { Module } from '@nestjs/common';
import { AudioService } from './audio.service';
import { AudioController } from './audio.controller';
import { MusicService } from 'src/services/music.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Config, ConfigSchema } from 'src/Model/configs.schema';
import { Audio, AudioSchema } from 'src/Model/audio.schema';
import { User, UserSchema } from 'src/Model/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  MongooseModule.forFeature([{ name: Config.name, schema: ConfigSchema }]),
  MongooseModule.forFeature([{ name: Audio.name, schema: AudioSchema }])
  ],
  providers: [AudioService,MusicService],
  controllers: [AudioController],
})
export class AudioModule {}
