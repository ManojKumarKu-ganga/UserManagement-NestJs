import { Controller, Post, Body, Param, Get, Query, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/auth/dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Post('login')
  async login(
    @Body() data: LoginUserDto,
  ) {
    
    return this.authService.login(data);
  }


  @Post('register')
  async register(
    @Body() data: any,
  ) {
    const user = await this.authService.register(data);
    return user;
  }


  @Get('allusers')
  async getAllUsers() {
    const users = await this.authService.getAllUsers();
    return users;
  }



@Get('user/:id')
async getUser(@Param('id') id: string) {
  return this.authService.getUserById(id);
}

@Delete('user/:id')
async deleteUser(@Param('id') id: string) {
  return this.authService.DeleteUserById(id);
}


}
