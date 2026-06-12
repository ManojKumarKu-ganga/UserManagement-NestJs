// (for REST API)
import { IsString, IsNotEmpty, IsEmail, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserDto as RestCreateUserDto } from '../../../auth/dto/create-user.dto';

export class CreateUserDto extends RestCreateUserDto {

  @IsString()
  @IsNotEmpty()
  declare name: string;

  @IsEmail()
  @IsNotEmpty()
  declare email: string;

  @IsString()
  @IsNotEmpty()
  declare password: string;

  @IsNumber()
  @Type(() => Number)
  declare age: number;

  @IsOptional()
  declare profilePhoto?: any;
} 
