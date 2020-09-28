import { Controller, Get, Put, Body, Param, Post, Delete } from '@nestjs/common';
import { User } from './entity/user.entity'
import { DbService } from './db.service';
import { CreateUserDTO } from './dto/create-user.dto';

@Controller('db')
export class DbController {
    constructor(private readonly services: DbService) { }

    @Get('users')
    getAllUsers(): Promise<User[]> {
        return this.services.findAll();
    }

    @Get('/users/:username',)
    getUser(@Param('username') username: string): Promise<User> {
        return this.services.findOne(username);
    }

    @Put('/users/update/:username',)
    update(@Param('username') username: string, @Body() dto: CreateUserDTO): Promise<User> {
        return this.services.update(username, dto);
    }

    @Post('/users/create')
    create(@Body() dto: CreateUserDTO): Promise<User> {
        return this.services.create(dto);
    }

    @Delete('/users/delete/:username')
    remove(@Param('username') username: string): Promise<User> {
        return this.services.remove(username);
    }
}
