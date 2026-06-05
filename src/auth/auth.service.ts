import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';

@Injectable()

export class AuthService {

    constructor(
        @InjectModel(User.name)
        private userModel: Model<UserDocument>,
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

        // TODO: verify password here (e.g., compare hashed passwords)
        return user;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user._id }
        return {
            access_token: this.jwtService.sign(payload)
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


}


