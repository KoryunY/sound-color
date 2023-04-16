import { Config, ConfigSchema } from 'src/Model/configs.schema';
import { User, UserSchema } from 'src/Model/user.schema';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { MusicService } from 'src/services/music.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  MongooseModule.forFeature([{ name: Config.name, schema: ConfigSchema }]),
  ],
  providers: [UsersService, MusicService],
  controllers: [UsersController]
})
export class UsersModule { }
