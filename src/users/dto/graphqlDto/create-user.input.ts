import { Field, InputType, Int ,} from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { UploadScalar } from '../../../graphql/scalars/upload.scalar';

@InputType()
export class CreateUserDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim()) 
  name!: string;

  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  password!: string;

  @Field(() => Int)
  @Transform(({ value }) => {
    if (typeof value === 'string') return parseInt(value, 10);
    return value;
  })

  @IsNumber()
  age!: number;


  @Field(() => UploadScalar, { nullable: true })
  @IsOptional()
  profilePhoto?: any;
}
