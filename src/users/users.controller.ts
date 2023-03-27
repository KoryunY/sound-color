import { Controller, Get } from '@nestjs/common';
import { Genres } from 'src/Model/genres.enum';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @Get('test')
    getTest() {
        return this.userService.create();
    }

    //gettingcategory
    @Get('genres/sound')
    getGenreBySound() {
        return this.userService.create();
    }

    @Get('genres/name')
    getGenreByName() {
        return this.userService.create();
    }

    @Get('genres')
    getGenress() {
        return Genres;
    }
}

