import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AudioModule } from './audio/audio.module';
import { ConfigsModule } from './config/config.module';

@Module({
  imports: [ConfigModule.forRoot(), MongooseModule.forRoot(process.env.DB), UsersModule, AudioModule, ConfigsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }


//dto passing param using
//defaults creating and update add delete to for others
//audio-metadata getting from shazam and others

//genreWeights
//energyLevel

//add postman test fix,fix clean all code create front
//color family
//gradient