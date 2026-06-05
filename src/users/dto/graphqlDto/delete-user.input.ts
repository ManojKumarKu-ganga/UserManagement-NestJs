import { Field, ID, InputType} from '@nestjs/graphql';
import {
  IsNotEmpty,
} from 'class-validator';



@InputType()
export class DeleteUserDto  {
  @Field(() => ID)
  @IsNotEmpty()
  id!: string;
}
