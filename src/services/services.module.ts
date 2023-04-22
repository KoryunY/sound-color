import { Module } from '@nestjs/common';
import { MetadataProcessingService } from 'src/services/metadata.service';
import { AudioProcessingService } from 'src/services/audio.service';
import { OtherProcessingService } from 'src/services/other.service';
import { MusicService } from './music.service';
import { ColorrocessingService } from './colors.service';

@Module({
  providers: [AudioProcessingService, MetadataProcessingService, OtherProcessingService, MusicService, ColorrocessingService],
  exports: [AudioProcessingService, MetadataProcessingService, OtherProcessingService, MusicService, ColorrocessingService]
})
export class ServicesModule { }
