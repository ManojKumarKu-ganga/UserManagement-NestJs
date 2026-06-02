import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserModel } from './dto/user.model';
import { CreateUserDto, UpdateUserDto, DeleteUserDto } from './dto/graphqlDto/user.dto';
import { UploadResponse } from './dto/upload-response.model';
import { UploadScalar } from '../graphql/scalars/upload.scalar';
import { UserInterface } from './interface/user.interface';


@Resolver(() => UserModel)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) { }

  @Query(() => [UserModel])
  async users() {
    const result = await this.usersService.findAll();
    return result;
  }

  @Query(() => UserModel)
  async user(@Args('id') id: string) {
    const result = await this.usersService.findOne(id);
    return result;
  }



  @Mutation(() => UserModel)
  async createUser(
    @Args({ name: 'input', type: () => CreateUserDto }) createUserInput: CreateUserDto,
  ) {
    const { name, email, password, age, profilePhoto } = createUserInput;
    const dto: CreateUserDto = { name, email, password, age } as CreateUserDto;

    const result = await this.usersService.create(dto, profilePhoto);
    return result;
  }



  @Mutation(() => UserModel)
  async updateUser(
    @Args({ name: 'input', type: () => UpdateUserDto }) updateUserDto: UpdateUserDto,
  ) {
    const { id, name, email, password, age, profilePhoto } = updateUserDto;
    const updateData: Partial<UserInterface> = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.password = password;
    if (age) updateData.age = age;
    const result = await this.usersService.update(id, updateData, profilePhoto);
    return result;
  }



  @Mutation(() => Boolean)
  async deleteUser(
    @Args({ name: 'input', type: () => DeleteUserDto }) deleteUserDto: DeleteUserDto,
  ) {
    await this.usersService.remove(deleteUserDto.id);
    return true;
  }




  @Mutation(() => UploadResponse)
  async uploadImage(
    @Args({ name: 'file', type: () => UploadScalar })
    file: any,
  ) {
    const upload = await (typeof file.then === 'function' ? file : file);
    const url = await this.usersService.saveFile(upload);
    return { url };
  }


}
