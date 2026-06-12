import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from "../auth/dto/create-user.dto";
import { FileStorageService, UploadFile } from '../file-storage/file-storage.service';
import { UpdateUserDto } from './dto/restapidto/update-user.dto';
import bcrypt from 'bcryptjs'; 

@Injectable()
export class UsersService {

    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private readonly fileStorageService: FileStorageService,
    ) { }


    async create(data: CreateUserDto, file?: UploadFile) {
        try { 
            const existingUser = await this.userModel.findOne({ email: data.email });
            if (existingUser) {
                throw new ConflictException('User already exists with this email');
            }

            const userData = { ...data ,
                password: await bcrypt.hash(data.password, 10) 
             };

            if (file) {
                const upload = (file && typeof (file as any).then === 'function') ? await (file as any) : file;
                userData.profilePhoto = await this.fileStorageService.saveFile(upload);
            }
            const user = await this.userModel.create(userData);
        
            console.log(user)
            return {
                success: true,
                message: 'User created successfully',
                data: user
            }

        } catch (error) {
            console.error('Create User Error:', error);
              if (error instanceof NotFoundException || error instanceof BadRequestException || error instanceof ConflictException || error instanceof HttpException ) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to create user')

        }
    }




    async findAll() {
        try {
            const users = await this.userModel.find();
            return users;
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException || error instanceof ConflictException || error instanceof HttpException ) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to fetch users');
        }
    }





    async findOne(id: string) {
        try {
            const user = await this.userModel.findById(id);
            if (!user) {
                throw new NotFoundException('User not found');
            }
            return user;
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException || error instanceof ConflictException || error instanceof HttpException ) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to fetch user');
        }
    }




    async update(id: string, data: UpdateUserDto, file?: UploadFile) {
        try {
            const existingUser = await this.userModel.findById(id);
            if (!existingUser) {
                throw new NotFoundException('User not found');
            }

            // Clean undefined fields
            const updateData = Object.fromEntries(
                Object.entries(data).filter(([ value]) => value !== undefined)
            );

            if (file) {
                if (existingUser.profilePhoto) {
                    await this.fileStorageService.deleteFile(existingUser.profilePhoto);
                }
                const upload = (file && typeof (file as any).then === 'function') ? await (file as any) : file;
                updateData.profilePhoto = await this.fileStorageService.saveFile(upload);
            }

            return await this.userModel.findByIdAndUpdate(
                id,
                updateData,
                { new: true }
            );

        } catch (err) {
            console.error('UPDATE ERROR:', err.message);

            if (err instanceof NotFoundException || err instanceof BadRequestException || err instanceof ConflictException || err instanceof HttpException ) {
                throw err;
            }

            throw new InternalServerErrorException(`Failed to update user: ${err.message}`);
        }
    }




    async remove(id: string) {
        try {
            const removedUser = await this.userModel.findByIdAndDelete(id);
            if (!removedUser) {
                throw new NotFoundException('User not found');
            }

            return {
                success: true,
                message: 'User deleted successfully',
                data: removedUser,
            };
            
        } catch (err) {
            if (err instanceof NotFoundException || err instanceof BadRequestException || err instanceof ConflictException || err instanceof HttpException ) {
                throw err;
            }
            throw new InternalServerErrorException('Failed to delete user');
        }
    }



    async saveFile(file: UploadFile): Promise<string> {
        const upload = (file && typeof (file as any).then === 'function') ? await (file as any) : file;
        return this.fileStorageService.saveFile(upload);
    }

}
