import { Controller, Get, Post, Put, Delete, Param, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UsersService } from './users.service';
import * as fs from 'fs';
import { CreateUserDto, UpdateUserDto } from './dto/restapidto/user.dto';



@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Post()
    @UseInterceptors(FileInterceptor('profilePhoto', {
        storage: memoryStorage(),
    }))
    async create(
        @Body() data: any,
        @UploadedFile() file?: Express.Multer.File
    ) {
    
        return this.usersService.create(data,file);
    }


    @Get()
    async findAll() {
        return this.usersService.findAll();
    }


    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }


    @Put(':id')
    @UseInterceptors(FileInterceptor('profilePhoto', {
        storage: memoryStorage(),
    }))
    async update(
        @Param('id') id: string,
        @Body() data: UpdateUserDto,
        @UploadedFile() file?: Express.Multer.File  
    ) {
        console.log('BODY:', data);   
        console.log('FILE:', file);
        return this.usersService.update(id, data, file);  
    }


    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }

}
