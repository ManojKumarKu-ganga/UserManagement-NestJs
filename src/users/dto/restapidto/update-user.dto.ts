// (for REST API)
import { IsString, IsNotEmpty, IsEmail, IsNumber, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';


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
