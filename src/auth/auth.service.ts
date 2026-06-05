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
    ){}
    

// constructor(
//   @InjectModel(User.name)
//   private userModel: Model<UserDocument>,

//   private jwtService: JwtService,
// ) {}

async validateUser(email: string, password: string): Promise<any>{
    const user = await this.userModel.findOne({ email});
    if(!user){
        throw new UnauthorizedException('Invalid credentials');

    }

    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        throw new UnauthorizedException('Invalid credentials');
    }
    // TODO: verify password here (e.g., compare hashed passwords)
    return user;
}


}
