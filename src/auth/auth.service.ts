import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { Login, LoginDocument } from 'src/auth/schema/auth.schema';
import { LoginUserDto } from 'src/auth/dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';

@Injectable()

export class AuthService {

    constructor(
        @InjectModel(User.name)
        private userModel: Model<UserDocument>,

        @InjectModel(Login.name)
        private loginModel: Model<LoginDocument>,

        private jwtService: JwtService,
    ) { }


    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return user;
    }



    async login(loginDto: LoginUserDto) {
        try {

            const user = await this.validateUser(loginDto.email, loginDto.password);
            const payload = { email: user.email, sub: user._id }

            return {
                access_token: this.jwtService.sign(payload),
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            }
        } catch {
            throw new UnauthorizedException('Invalid credentials');
        }


    }


    async register(user: any) {
        const existingUser = await this.userModel.findOne({ email: user.email });
        if (existingUser) {
            throw new UnauthorizedException('User already exists with this email')
        }
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const newUser = new this.userModel({
            ...user,
            password: hashedPassword
        })
        await newUser.save();
        return newUser;
    }


    async getUserById(id: string): Promise<User | null> {
        return this.userModel.findById(id).exec();
    }

    async getAllUsers(): Promise<User[]> {
        return this.userModel.find().exec();
    }


    async DeleteUserById(id: string): Promise<User | null> {
        return this.userModel.findByIdAndDelete(id)
    }


}


