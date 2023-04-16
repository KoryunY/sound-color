import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { ConfigsModule } from './config/config.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AudioModule } from './audio/audio.module';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [ConfigModule.forRoot(), MongooseModule.forRoot(process.env.DB), UsersModule, AudioModule, ConfigsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }