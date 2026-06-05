import { IsString, IsNotEmpty, IsEmail, IsNumber, IsOptional } from 'class-validator';


export class LoginUserDto {
    @IsNotEmpty()
    @IsEmail()
    email!:string;

    @IsNotEmpty()
    @IsString()
    password!:string;
}