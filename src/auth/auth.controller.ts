import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/common/dto/common/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Post('login')
  async login(
    @Body() data: LoginUserDto,
  ) {
    const user = await this.authService.validateUser(data.email, data.password);
    return user;
  }


  @Post('register')
  async register(
    @Body() data: any,
  ) {
    const user = await this.authService.register(data);
    return user;
  }


}
