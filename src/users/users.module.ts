import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/Model/user.schema';
import { Config, ConfigSchema } from 'src/Model/configs.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  MongooseModule.forFeature([{ name: Config.name, schema: ConfigSchema }])
  ],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule { }
