import { Config, ConfigSchema } from 'src/Model/configs.schema';
import { ConfigController } from './config.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from './config.service';
import { Module } from '@nestjs/common';
import { User, UserSchema } from 'src/Model/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Config.name, schema: ConfigSchema }]), MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [ConfigService],
  controllers: [ConfigController],
  exports: [ConfigService]
})
export class ConfigsModule { }
