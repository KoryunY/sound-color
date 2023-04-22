import { Config, ConfigSchema } from 'src/Model/configs.schema';
import { User, UserSchema } from 'src/Model/user.schema';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { Module } from '@nestjs/common';
import { MetadataProcessingService } from 'src/services/metadata.service';
import { ServicesModule } from 'src/services/services.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  MongooseModule.forFeature([{ name: Config.name, schema: ConfigSchema }]),
    ServicesModule
  ],
  providers: [UsersService, MetadataProcessingService,],
  controllers: [UsersController]
})
export class UsersModule { }
