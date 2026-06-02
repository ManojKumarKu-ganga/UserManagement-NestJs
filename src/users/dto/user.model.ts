import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()


export class UserModel {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  email!: string;

  @Field(() => Int)
  age!: number;

  @Field({ nullable: true })
  profilePhoto?: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
