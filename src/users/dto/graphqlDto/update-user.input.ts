import { CreateUserDto } from "./create-user.input";
import { Field, ID, InputType, PartialType ,} from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
} from 'class-validator';




@InputType()
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @Field(() => ID)
  @IsNotEmpty()
  @IsString()
  id!: string;
}