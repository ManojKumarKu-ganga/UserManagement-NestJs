import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {MongooseModule} from '@nestjs/mongoose';
import { UserSchema, User } from './schemas/user.schema';
import { UsersResolver } from './users.resolver';
import { FileStorageService } from '../file-storage.service';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: User.name,
      schema: UserSchema
    }])
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersResolver, FileStorageService]
})


export class UsersModule {}
