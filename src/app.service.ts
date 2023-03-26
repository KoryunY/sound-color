import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User } from './Model/user.schema';
import { Config } from './Model/configs.schema';
@Injectable()
export class AppService {
  constructor(@InjectModel(User.name) private userModel: Model<User>, @InjectModel(Config.name) private configModel: Model<Config>) { }

  getHello(): string {
    return 'Hello World!';
  }
}
