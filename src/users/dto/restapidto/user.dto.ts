// (for REST API)
import { IsString, IsNotEmpty, IsEmail, IsNumber, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsNumber()
  @Type(() => Number)       
  age!: number;

  @IsOptional()
  profilePhoto?: any; } 


  export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()                              
  @Transform(({ value }) => value?.trim())
  name?: string;

  @IsEmail()
  @IsOptional()                              
  @Transform(({ value }) => value?.trim())
  email?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()                              
  @Transform(({ value }) => value?.trim())
  password?: string;

  @IsNumber()
  @IsOptional()                              
  @Type(() => Number)
  age?: number;

  @IsOptional()
  profilePhoto?: any;
}
